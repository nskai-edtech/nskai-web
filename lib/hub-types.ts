/**
 * Types and interfaces for the NSK AI Chapter Hub.
 */

export type ChapterStatus = "interim" | "chartered" | "probation";
export type MouStatus = "signed" | "under_review" | "pending" | "exempt";
export type RequestType = "event" | "finance" | "partnership";
export type RequestStatus = "pending" | "approved" | "changes_requested" | "rejected";
/** "treasurer" is the stored key for the Programs Coordinator seat; the key is
 * kept because accounts are stored under it. */
export type OfficerRole = "lead" | "deputy" | "treasurer";

export interface Chapter {
  id: string;
  institution: string;
  country: string;
  status: ChapterStatus;
  charterDate?: string;
  charterNumber?: string;
  leadName: string;
  leadEmail: string;
  deputyName?: string;
  deputyEmail?: string;
  treasurerName?: string;
  treasurerEmail?: string;
  facultyRepName?: string;
  facultyRepDepartment?: string;
  facultyRepEmail?: string;
  facultyRepConfirmed: boolean;
  whatsappGroupLink?: string;
  whatsappGroupVerified: boolean;
  udaraMouStatus: MouStatus;
  countryDirectorName: string;
  countryDirectorEmail: string;
  totalMembers: number;
  signedAgreement: boolean;
  hasThreeExecutives: boolean;
  lastReportSubmittedMonth?: string;
  meetingsThisSemester: number;
}

export interface UdaraAmbassador {
  id: string;
  chapterId: string;
  name: string;
  department: string;
  phoneNumber: string;
  role: string;
}

export interface ClearanceRequest {
  id: string;
  chapterId: string;
  institution: string;
  type: RequestType;
  title: string;
  dateFiled: string;
  status: RequestStatus;
  amount?: string;
  notes?: string;
  eventDate?: string;
  format?: "online" | "physical" | "hybrid";
  attendeesEstimate?: number;
}

export interface HubSession {
  email: string;
  role: "admin" | "officer" | "country";
  chapterId?: string;
  /** For role "country": the country this director or deputy can view. */
  country?: string;
  officerRole?: OfficerRole;
  name: string;
}

/** One lead/deputy/treasurer seat on a chapter. Lifecycle: empty -> invited -> active,
 * and back to empty once revoked or once the account's one-year TTL expires it out of KV. */
export type HubSlot =
  | { status: "empty" }
  | { status: "invited"; token: string; createdAt: string; createdBy: string }
  | { status: "active"; email: string; name: string; createdAt: string; expiresAt: string };

export interface HubAccount {
  chapterId: string;
  role: OfficerRole;
  name: string;
  expiresAt: string;
  /** Salted scrypt hash (lib/hub-password.ts). Never sent to the browser. */
  passwordHash?: string;
}

/** One member of a chapter's executive team, as entered by the Chapter Lead.
 * The Deputy and Programs Coordinator also get hub accounts (seats "deputy" and
 * "treasurer"); every other entry is stored as a record only. */
export interface ChapterExecutive {
  /** "deputy" and "treasurer" are the two compulsory seats; anything else is a free-text title. */
  seat: "deputy" | "treasurer" | "other";
  title: string;
  name: string;
  email: string;
  phone?: string;
}

/** What an invite link carries. Invites issued from the lead's Executives form
 * are bound to the email the lead entered, so only that person can activate it. */
export interface HubInvite {
  chapterId: string;
  role: OfficerRole;
  name?: string;
  email?: string;
}

/** Country Directors and their deputies hold seats like chapter officers, under
 * a pseudo chapter id `country:<Country>`: seat "lead" is the Country Director
 * and "deputy" the Country Deputy. Reusing the seat machinery gives them the
 * same invite links, revoke, one-year expiry and per-request re-validation. */
const COUNTRY_PREFIX = "country:";
export const countryScopeId = (country: string) => `${COUNTRY_PREFIX}${country}`;
export const countryFromScope = (id: string): string | null =>
  id.startsWith(COUNTRY_PREFIX) ? id.slice(COUNTRY_PREFIX.length) : null;
export const COUNTRY_ROLE_LABEL: Partial<Record<OfficerRole, string>> = {
  lead: "Country Director",
  deputy: "Country Deputy",
};

export const OFFICER_ROLE_LABEL: Record<OfficerRole, string> = {
  lead: "Chapter Lead",
  deputy: "Deputy Lead",
  treasurer: "Programs Coordinator",
};
