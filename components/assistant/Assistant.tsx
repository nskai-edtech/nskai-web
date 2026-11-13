"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/nav";
import styles from "./Assistant.module.css";

type Message = { role: "user" | "assistant"; content: string; error?: boolean };

const STORAGE_KEY = "nskai-assistant";

const SUGGESTIONS = [
  "What does NSK AI do?",
  "How do I become a campus chapter lead?",
  "What is the Udara Project?",
  "Is the community free to join?",
];

/* The browser speech APIs are not in TypeScript's DOM library, so only the
   parts used here are described. */
type RecognitionEvent = { results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }> };
type Recognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getRecognition(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition || w.webkitSpeechRecognition || null) as (new () => Recognition) | null;
}

// --- Rendering an answer --------------------------------------------------
// Answers are plain text with at most bold, links and short lists. They are
// turned into elements here rather than injected as HTML.

const INLINE =
  /(\*\*[^*\n]+\*\*|\[[^\]\n]+\]\((?:https?:\/\/|\/)[^)\s]+\)|https?:\/\/[^\s)]+|(?<![\w/.])\/[a-z][a-z0-9/-]*[a-z0-9])/g;

function link(href: string, label: string, key: number): ReactNode {
  return href.startsWith("/") ? (
    <Link key={key} href={href}>
      {label}
    </Link>
  ) : (
    <a key={key} href={href} target="_blank" rel="noopener">
      {label}
    </a>
  );
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const md = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (md) return link(md[2], md[1], i);
    const trailing = part.match(/[.,;:!?]+$/)?.[0] ?? "";
    const href = trailing ? part.slice(0, -trailing.length) : part;
    return (
      <span key={i}>
        {link(href, href, i)}
        {trailing}
      </span>
    );
  });
}

const LIST_ITEM = /^\s*(?:[-*•]|\d+[.)])\s+/;

function renderAnswer(text: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  let items: string[] = [];
  let lines: string[] = [];

  const flush = () => {
    if (items.length) {
      blocks.push(
        <ul key={blocks.length}>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      items = [];
    }
    if (lines.length) {
      blocks.push(<p key={blocks.length}>{renderInline(lines.join(" "))}</p>);
      lines = [];
    }
  };

  for (const raw of text.split("\n")) {
    const line = raw.replace(/^#+\s*/, "").trimEnd();
    if (!line.trim()) {
      flush();
    } else if (LIST_ITEM.test(line)) {
      if (lines.length) flush();
      items.push(line.replace(LIST_ITEM, ""));
    } else {
      if (items.length) flush();
      lines.push(line.trim());
    }
  }
  flush();
  return blocks;
}

function toSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/^#+\s*/gm, "");
}

// --- Icons ----------------------------------------------------------------

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" } as const;

function MicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M12 19V5M6 11l6-6 6 6" strokeLinejoin="round" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" fill="currentColor" />
    </svg>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M4 9.5h3l5-4v13l-5-4H4z" strokeLinejoin="round" />
      {on ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" {...stroke}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

// --- The widget -----------------------------------------------------------

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(false);
  const [canListen, setCanListen] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [restored, setRestored] = useState(false);

  const messagesRef = useRef<Message[]>([]);
  const streamingRef = useRef(false);
  const speakOnRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const heardRef = useRef("");
  const listRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const refocusRef = useRef(false);

  messagesRef.current = messages;
  speakOnRef.current = speakOn;

  // Restore the conversation: the widget remounts whenever navigation crosses
  // a route group, and losing the thread mid-question would be the worst part
  // of the experience.
  useEffect(() => {
    setCanListen(getRecognition() !== null);
    setCanSpeak("speechSynthesis" in window);
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved) {
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        setOpen(Boolean(saved.open));
        setSpeakOn(Boolean(saved.speakOn));
      }
    } catch {
      // Unreadable storage just means starting fresh.
    }
    setRestored(true);
  }, []);

  // Gated on state, not a ref: the first commit must never write, or it saves
  // the empty starting state over the stored conversation before it is read.
  useEffect(() => {
    if (!restored || streaming) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, open, speakOn }));
    } catch {
      // Storage full or blocked: the chat still works for this page.
    }
  }, [restored, messages, open, speakOn, streaming]);

  const speak = useCallback((text: string) => {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(toSpeech(text));
    utterance.lang = document.documentElement.lang || "en-GB";
    window.speechSynthesis.speak(utterance);
  }, []);

  const quiet = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const send = useCallback(
    async (text: string, viaVoice = false) => {
      const question = text.trim();
      if (!question || streamingRef.current) return;
      quiet();

      const history = messagesRef.current
        .filter((m) => !m.error && m.content)
        .map(({ role, content }) => ({ role, content }));
      const outgoing = [...history, { role: "user" as const, content: question }];

      stickRef.current = true;
      setInput("");
      setVoiceNote("");
      setMessages([...messagesRef.current, { role: "user", content: question }, { role: "assistant", content: "" }]);
      setStreaming(true);
      streamingRef.current = true;

      const setLast = (content: string, error = false) =>
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content, error }]);

      const controller = new AbortController();
      abortRef.current = controller;
      let answer = "";
      try {
        const response = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: outgoing }),
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(body?.error || "The assistant could not answer that.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setLast(answer);
        }
        if (viaVoice || speakOnRef.current) speak(answer);
      } catch (err) {
        if (controller.signal.aborted) {
          setLast(answer || "Stopped.");
        } else {
          const reason = err instanceof Error && err.message ? err.message : "Something went wrong.";
          setLast(`${reason} You can also email ${CONTACT_EMAIL}.`, true);
        }
      } finally {
        abortRef.current = null;
        streamingRef.current = false;
        setStreaming(false);
      }
    },
    [quiet, speak]
  );

  const stopListening = useCallback(() => recognitionRef.current?.stop(), []);

  const startListening = useCallback(() => {
    const Recognition = getRecognition();
    if (!Recognition || streamingRef.current) return;
    quiet();
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-GB";
    recognition.interimResults = true;
    recognition.continuous = false;
    heardRef.current = "";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) transcript += event.results[i][0].transcript;
      heardRef.current = transcript;
      setInput(transcript);
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setVoiceNote("Microphone access is blocked. Allow it in your browser, or type instead.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        setVoiceNote("Voice input did not work just then. You can type instead.");
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setListening(false);
      const heard = heardRef.current.trim();
      heardRef.current = "";
      if (heard) send(heard, true);
    };

    recognitionRef.current = recognition;
    setVoiceNote("");
    setListening(true);
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setListening(false);
    }
  }, [quiet, send]);

  const close = useCallback(() => {
    recognitionRef.current?.abort();
    quiet();
    refocusRef.current = true;
    setOpen(false);
  }, [quiet]);

  // The launcher only exists again after the panel has gone, so focus is
  // handed back to it once it has rendered.
  useEffect(() => {
    if (!open && refocusRef.current) {
      refocusRef.current = false;
      launcherRef.current?.focus();
    }
  }, [open]);

  // Stop everything that makes noise or holds a connection when the widget goes away.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      recognitionRef.current?.abort();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    []
  );

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    if (desktop) {
      inputRef.current?.focus();
      return;
    }
    // On a phone the panel is the whole screen, so the page behind must not scroll.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list && stickRef.current) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  // Grow the box with the question, up to a few lines.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open]);

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send(input);
    }
  }

  function toggleSpeak() {
    if (speakOn) quiet();
    setSpeakOn(!speakOn);
  }

  function clear() {
    abortRef.current?.abort();
    quiet();
    setMessages([]);
    setVoiceNote("");
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button ref={launcherRef} type="button" className={styles.launcher} onClick={() => setOpen(true)}>
        <span className={styles.launcherMark} aria-hidden="true" />
        Ask NSK AI
      </button>
    );
  }

  const last = messages[messages.length - 1];
  const waiting = streaming && last?.role === "assistant" && !last.content;

  return (
    <section
      className={styles.panel}
      role="dialog"
      aria-label="Ask NSK AI"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <header className={styles.head}>
        <div className={styles.headTitle}>
          <span className={styles.launcherMark} aria-hidden="true" />
          Ask NSK AI
        </div>
        <div className={styles.headActions}>
          {messages.length > 0 && (
            <button type="button" className={styles.textButton} onClick={clear}>
              New chat
            </button>
          )}
          {canSpeak && (
            <button
              type="button"
              className={`${styles.iconButton} ${speakOn ? styles.iconButtonOn : ""}`}
              onClick={toggleSpeak}
              aria-pressed={speakOn}
              aria-label={speakOn ? "Stop reading answers aloud" : "Read answers aloud"}
              title={speakOn ? "Reading answers aloud" : "Read answers aloud"}
            >
              <SpeakerIcon on={speakOn} />
            </button>
          )}
          <button type="button" className={styles.iconButton} onClick={close} aria-label="Close the assistant">
            <CloseIcon />
          </button>
        </div>
      </header>

      <div
        ref={listRef}
        className={styles.list}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
        }}
      >
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Ask anything about NSK AI.</p>
            <p className={styles.emptyLead}>
              The company, the products, the Foundation, Udara, the community, or leading a campus
              chapter. {canListen ? "Type, or tap the microphone and speak." : "Type your question below."}
            </p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" className={styles.suggestion} onClick={() => send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div aria-live="polite">
            {messages.map((message, i) =>
              message.role === "user" ? (
                <div key={i} className={styles.question}>
                  {message.content}
                </div>
              ) : (
                <div key={i} className={`${styles.answer} ${message.error ? styles.answerError : ""}`}>
                  {message.content ? (
                    renderAnswer(message.content)
                  ) : (
                    <span className={styles.thinking} aria-label="Thinking">
                      <span />
                      <span />
                      <span />
                    </span>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      <form
        className={styles.composer}
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        {(listening || voiceNote) && (
          <div className={styles.voiceRow} role="status">
            {listening ? (
              <>
                <span className={styles.bars} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                Listening. Tap the microphone when you are done.
              </>
            ) : (
              voiceNote
            )}
          </div>
        )}
        <div className={styles.inputRow}>
          <textarea
            ref={inputRef}
            rows={1}
            className={styles.input}
            placeholder={listening ? "Speak now…" : "Ask a question"}
            aria-label="Your question"
            value={input}
            maxLength={1500}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {canListen && (
            <button
              type="button"
              className={`${styles.roundButton} ${listening ? styles.roundButtonLive : ""}`}
              onClick={listening ? stopListening : startListening}
              disabled={streaming}
              aria-pressed={listening}
              aria-label={listening ? "Stop listening" : "Ask by voice"}
            >
              <MicIcon />
            </button>
          )}
          {streaming ? (
            <button
              type="button"
              className={`${styles.roundButton} ${styles.roundButtonSolid}`}
              onClick={() => abortRef.current?.abort()}
              aria-label={waiting ? "Cancel" : "Stop the answer"}
            >
              <StopIcon />
            </button>
          ) : (
            <button
              type="submit"
              className={`${styles.roundButton} ${styles.roundButtonSolid}`}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          )}
        </div>
        <p className={styles.footnote}>Answers come from NSK AI&rsquo;s published material and can be wrong.</p>
      </form>
    </section>
  );
}
