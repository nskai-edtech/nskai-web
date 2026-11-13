/**
 * Persistent state for the Chapter Hub's invite-link accounts: who holds the
 * Lead/Deputy/Treasurer seat on a chapter, the pending invite link for an empty
 * seat, the one-year TTL that wipes an account automatically, each officer's
 * password hash, and the failed-login counter that throttles password guessing.
 *
 * Backed by Upstash Redis (needs UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN).
 * Without those set, development falls back to a JSON file under `.data/` so
 * the invite/activate/revoke flow can be previewed locally — an in-process Map
 * will NOT do here, because Next.js compiles each API route handler into its
 * own bundle, so module-level state does not reliably share across routes even
 * within one server process. A file on disk is real shared state regardless of
 * bundling. Production refuses to create accounts rather than pretend
 * persistence it can't offer.
 */
import { Redis } from "@upstash/redis";
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { hashPassword } from "./hub-password";
import type { HubAccount, HubSlot, OfficerRole } from "./hub-types";

const ACCOUNT_TTL_SECONDS = 60 * 60 * 24 * 365; // one year

interface KvStore {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

class RedisStore implements KvStore {
  constructor(private redis: Redis) {}
  async get<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(key);
  }
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    await this.redis.set(key, value, ttlSeconds ? { ex: ttlSeconds } : undefined);
  }
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

type FileRecord = Record<string, { value: unknown; expiresAt: number | null }>;

/** Dev-only stand-in for Upstash so the hub's invite flow can be previewed
 * without creating an Upstash account. Reads and rewrites the whole file on
 * every call, which is fine at the scale of a local preview and never runs
 * in production. */
class FileStore implements KvStore {
  private path = join(process.cwd(), ".data", "hub-kv.dev.json");

  private async read(): Promise<FileRecord> {
    try {
      return JSON.parse(await readFile(this.path, "utf8"));
    } catch {
      return {};
    }
  }

  private async write(data: FileRecord): Promise<void> {
    await mkdir(join(process.cwd(), ".data"), { recursive: true });
    await writeFile(this.path, JSON.stringify(data), "utf8");
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.read();
    const entry = data[key];
    if (!entry) return null;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      delete data[key];
      await this.write(data);
      return null;
    }
    return entry.value as T;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const data = await this.read();
    data[key] = { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null };
    await this.write(data);
  }

  async del(key: string): Promise<void> {
    const data = await this.read();
    delete data[key];
    await this.write(data);
  }
}

let store: KvStore | null = null;
let warned = false;
const fileStoreSingleton = new FileStore();

function getStore(): KvStore {
  if (store) return store;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    store = new RedisStore(new Redis({ url, token }));
    return store;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. Chapter Hub invite links and officer accounts need real persistence in production."
    );
  }
  if (!warned) {
    console.warn(
      "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set — using a local .data/hub-kv.dev.json store for preview. Delete that file to reset, and this is never used in production."
    );
    warned = true;
  }
  store = fileStoreSingleton;
  return store;
}

/** For read paths: a KV or configuration problem should fail safe (behave as
 * "not found") rather than 500 the login/dashboard request. Write paths use
 * getStore() directly so they surface the real error to the admin who acted. */
async function readFromStore<T>(fn: (kv: KvStore) => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn(getStore());
  } catch (err) {
    console.error("Chapter Hub KV read failed, treating as empty:", err);
    return fallback;
  }
}

function slotKey(chapterId: string, role: OfficerRole) {
  return `hub:slot:${chapterId}:${role}`;
}
function tokenKey(token: string) {
  return `hub:token:${token}`;
}
function emailKey(email: string) {
  return `hub:email:${email.trim().toLowerCase()}`;
}

export async function getSlot(chapterId: string, role: OfficerRole): Promise<HubSlot> {
  const slot = await readFromStore((kv) => kv.get<HubSlot>(slotKey(chapterId, role)), null);
  return slot || { status: "empty" };
}

export async function getSlotsForChapter(chapterId: string): Promise<Record<OfficerRole, HubSlot>> {
  const roles: OfficerRole[] = ["lead", "deputy", "treasurer"];
  const slots = await Promise.all(roles.map((role) => getSlot(chapterId, role)));
  return { lead: slots[0], deputy: slots[1], treasurer: slots[2] };
}

/** Creates a fresh invite token for an empty seat. Throws if the seat is occupied —
 * callers must revoke the existing invite or account first. */
export async function createInvite(
  chapterId: string,
  role: OfficerRole,
  createdBy: string
): Promise<string> {
  const kv = getStore();

  const existing = await getSlot(chapterId, role);
  if (existing.status === "active") {
    throw new Error("This seat is occupied. Revoke the current account before issuing a new invite.");
  }
  if (existing.status === "invited") {
    await kv.del(tokenKey(existing.token));
  }

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
  await kv.set(tokenKey(token), { chapterId, role });
  await kv.set(slotKey(chapterId, role), {
    status: "invited",
    token,
    createdAt: new Date().toISOString(),
    createdBy,
  } satisfies HubSlot);
  return token;
}

export async function getInvite(token: string): Promise<{ chapterId: string; role: OfficerRole } | null> {
  return readFromStore((kv) => kv.get<{ chapterId: string; role: OfficerRole }>(tokenKey(token)), null);
}

/** Activates an invite into a real account, consuming the token. */
export async function activateInvite(
  token: string,
  name: string,
  email: string,
  password: string
): Promise<HubAccount> {
  const kv = getStore();

  const invite = await getInvite(token);
  if (!invite) throw new Error("This invite link is invalid or has already been used.");

  const cleanEmail = email.trim().toLowerCase();
  const existingForEmail = await kv.get<HubAccount>(emailKey(cleanEmail));
  if (existingForEmail) {
    throw new Error("This email already has an active Chapter Hub account.");
  }

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ACCOUNT_TTL_SECONDS * 1000);
  const account: HubAccount = {
    chapterId: invite.chapterId,
    role: invite.role,
    name: name.trim(),
    expiresAt: expiresAt.toISOString(),
    passwordHash: hashPassword(password),
  };

  await kv.set(emailKey(cleanEmail), account, ACCOUNT_TTL_SECONDS);
  await kv.set(
    slotKey(invite.chapterId, invite.role),
    {
      status: "active",
      email: cleanEmail,
      name: account.name,
      createdAt: createdAt.toISOString(),
      expiresAt: account.expiresAt,
    } satisfies HubSlot,
    ACCOUNT_TTL_SECONDS
  );
  await kv.del(tokenKey(token));

  return account;
}

export async function getAccountByEmail(email: string): Promise<HubAccount | null> {
  return readFromStore((kv) => kv.get<HubAccount>(emailKey(email)), null);
}

/** Clears whatever occupies a seat — a pending invite or an active account — back to empty. */
export async function revokeSlot(chapterId: string, role: OfficerRole): Promise<void> {
  const kv = getStore();

  const slot = await getSlot(chapterId, role);
  if (slot.status === "invited") {
    await kv.del(tokenKey(slot.token));
  } else if (slot.status === "active") {
    await kv.del(emailKey(slot.email));
  }
  await kv.del(slotKey(chapterId, role));
}

const LOGIN_LOCK_SECONDS = 60 * 15; // 15 minutes
const MAX_FAILED_LOGINS = 8;
function failKey(email: string) {
  return `hub:fail:${email.trim().toLowerCase()}`;
}

/** True once an email has had too many wrong passwords in the last 15 minutes,
 * so a password can't be guessed by brute force. */
export async function isLoginLocked(email: string): Promise<boolean> {
  const count = await readFromStore((kv) => kv.get<number>(failKey(email)), null);
  return (count ?? 0) >= MAX_FAILED_LOGINS;
}

export async function recordFailedLogin(email: string): Promise<void> {
  try {
    const kv = getStore();
    const count = (await kv.get<number>(failKey(email))) ?? 0;
    await kv.set(failKey(email), count + 1, LOGIN_LOCK_SECONDS);
  } catch (err) {
    console.error("Chapter Hub could not record a failed login:", err);
  }
}

export async function clearFailedLogins(email: string): Promise<void> {
  try {
    await getStore().del(failKey(email));
  } catch {
    // Nothing to clear, or KV unavailable: the counter expires on its own.
  }
}

/** An admin password changed from /hub/admin lives here as a hash and takes
 * precedence over ADMIN_PASSWORD. Deleting this key in Upstash falls back to
 * ADMIN_PASSWORD, which is the recovery path if the password is forgotten. */
const ADMIN_PASSWORD_KEY = "hub:adminpw";

export async function getAdminPasswordHash(): Promise<string | null> {
  return readFromStore((kv) => kv.get<string>(ADMIN_PASSWORD_KEY), null);
}

export async function setAdminPassword(password: string): Promise<void> {
  await getStore().set(ADMIN_PASSWORD_KEY, hashPassword(password));
}
