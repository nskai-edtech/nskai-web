import { NextResponse } from "next/server";
import { ASSISTANT_SYSTEM_PROMPT } from "@/lib/assistant-knowledge";

// xAI's Grok API speaks the OpenAI chat-completions format, so any other
// OpenAI-compatible provider can be swapped in with ASSISTANT_API_URL.
const DEFAULT_URL = "https://api.x.ai/v1/chat/completions";

const MAX_TURNS = 12;
const MAX_CHARS = 1500;

type ChatMessage = { role: "user" | "assistant"; content: string };

/* Best-effort only: it lives in this route's memory, so it resets on restart
   and is per-instance on serverless. It exists to stop one visitor draining
   the model quota, not as a security control. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 25;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const messages: ChatMessage[] = [];
  for (const item of input.slice(-MAX_TURNS)) {
    const role = (item as ChatMessage)?.role;
    const content = (item as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const trimmed = content.trim().slice(0, MAX_CHARS);
    if (trimmed) messages.push({ role, content: trimmed });
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = parseMessages(body.messages);
  if (!messages) {
    return NextResponse.json({ error: "Ask a question to get started." }, { status: 400 });
  }

  // Both are required: there is no default model, because a model id that
  // has been retired upstream would fail every question silently.
  const apiKey = process.env.XAI_API_KEY;
  const model = process.env.ASSISTANT_MODEL?.trim();
  if (!apiKey || !model) {
    console.error("Assistant: XAI_API_KEY and ASSISTANT_MODEL must both be set.");
    return NextResponse.json({ error: "The assistant is not connected yet." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "That is a lot of questions in a short time. Give it a few minutes." },
      { status: 429 }
    );
  }

  const url = process.env.ASSISTANT_API_URL || DEFAULT_URL;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        max_tokens: 500,
        messages: [{ role: "system", content: ASSISTANT_SYSTEM_PROMPT }, ...messages],
      }),
      signal: request.signal,
    });
  } catch (err) {
    console.error("Assistant: upstream request failed", err);
    return NextResponse.json({ error: "The assistant could not be reached." }, { status: 502 });
  }

  if (!upstream.ok || !upstream.body) {
    console.error("Assistant: upstream error", upstream.status, await upstream.text().catch(() => ""));
    const busy = upstream.status === 429;
    return NextResponse.json(
      { error: busy ? "The assistant is busy right now. Try again in a minute." : "The assistant could not answer that." },
      { status: busy ? 429 : 502 }
    );
  }

  // Upstream speaks SSE; the widget only needs the text, so unwrap it here.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      let sent = false;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const data = line.slice(5).trim();
            if (!data || data === "[DONE]") continue;
            try {
              const text = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (typeof text === "string" && text) {
                controller.enqueue(encoder.encode(text));
                sent = true;
              }
            } catch {
              // A keep-alive or partial line: ignore it.
            }
          }
        }
        if (!sent) controller.enqueue(encoder.encode("I could not produce an answer just then. Please ask again."));
      } catch (err) {
        console.error("Assistant: stream interrupted", err);
      } finally {
        controller.close();
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
