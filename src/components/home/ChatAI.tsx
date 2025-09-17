// components/home/ChatAI.tsx  (또는 네가 쓰는 경로)
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import styles from "./AI.module.css";
import { useNavigate } from "react-router-dom";

export type Message = {
  id: string;
  from: "ai" | "user" | "system";
  text: string;
  ts?: number;
};

type ChatPanelProps = {
  title?: string;
  initialMessages?: Message[];
  suggestedPrompts?: string[];
  onSend?: (text: string) => Promise<string | void> | string | void;
  className?: string;
};

const nid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);

// **정규화 유틸**: 여러 경우(배열/객체/이중인코딩/이스케이프된 줄바꿈) 안전 처리
function normalizeTextPayload(payload: any): string {
  let raw: any = payload ?? "";

  if (typeof raw === "object") {
    raw = raw?.results ?? raw?.text ?? raw;
  }
  if (Array.isArray(raw)) {
    try {
      raw = raw.join("\n");
    } catch {
      raw = raw.map(String).join("\n");
    }
  }
  if (typeof raw !== "string") {
    try {
      raw = JSON.stringify(raw, null, 2);
    } catch {
      raw = String(raw);
    }
  }
  try {
    const maybe = JSON.parse(raw);
    if (typeof maybe === "string") raw = maybe;
  } catch {
    // ignore
  }
  raw = raw.replace(/\\n/g, "\n");
  return raw;
}

export default function ChatPanel({
  title = "EVLink AI",
  initialMessages = [],
  suggestedPrompts = ["선택한 충전소 근처에 가볼만한곳", "오늘 비올 것 같아?"],
  onSend,
  className = "",
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(() => [
    ...initialMessages,
    { id: nid(), from: "ai", text: "안녕하세요! 무엇을 도와드릴까요?", ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const nav = useNavigate();

  useEffect(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const pushMessage = (m: Message) => setMessages((s) => [...s, m]);

  // send handler
  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    const userMsg: Message = { id: nid(), from: "user", text: content, ts: Date.now() };
    pushMessage(userMsg);
    setInput("");
    setActivePrompt(null);

    if (!onSend) return;

    try {
      setLoading(true);
      const result = await onSend(content);
      // normalize if result is object/array or escaped string
      if (typeof result === "string" && result.trim()) {
        const normalized = normalizeTextPayload(result);
        pushMessage({ id: nid(), from: "ai", text: normalized, ts: Date.now() });
      } else if (result != null) {
        // if onSend returned structured payload, try to normalize it
        const normalized = normalizeTextPayload(result);
        pushMessage({ id: nid(), from: "ai", text: normalized, ts: Date.now() });
      } else {
        // onSend returned void/null -> let server call handle pushing, or show placeholder
        // optional: show "응답 대기" system message — here we do nothing
      }
    } catch (e) {
      pushMessage({
        id: nid(),
        from: "system",
        text: "요청 전송에 실패했습니다. 다시 시도해 주세요.",
        ts: Date.now(),
      });
    } finally {
      setLoading(false);
      // focus back to textarea
      textareaRef.current?.focus();
    }
  };

  const handlePrompt = (p: string) => {
    setActivePrompt(p);
    handleSend(p);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // small helper to safely render text via markdown
  const renderMessageContent = (text: string) => {
    const fixed = text.replace(/\\n/g, "\n");
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {fixed}
      </ReactMarkdown>
    );
  };

  return (
    <aside className={`${styles.panel} ${className}`} aria-label="AI 채팅 패널">
      <header className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>{title}</h3>
          <p className={styles.headerSubtitle}>대화를 시작하려면 아래에 입력하세요</p>
        </div>
        <div className={styles.headerBadge}>AI</div>
      </header>

      <div className={styles.prompts}>
        {suggestedPrompts.map((p) => {
          const active = p === activePrompt;
          return (
            <button
              key={p}
              onClick={() => handlePrompt(p)}
              className={`${styles.promptBtn} ${active ? styles.promptBtnActive : ""}`}
              type="button"
            >
              {p}
            </button>
          );
        })}
      </div>

      <div
        ref={scrollRef}
        className={styles.convo}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className={styles.messages}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`${styles.messageRow} ${m.from === "user" ? styles.right : styles.left}`}
            >
              <div
                className={`${styles.message} ${
                  m.from === "ai" ? styles.ai : m.from === "user" ? styles.user : styles.system
                }`}
              >
                {renderMessageContent(m.text)}
                {/* optional timestamp */}
                {/* <div className={styles.msgTime}>{new Date(m.ts||0).toLocaleTimeString()}</div> */}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.messageRow} ${styles.left}`}>
              <div className={`${styles.message} ${styles.loading}`}>응답을 생성중입니다...</div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.inputArea}>
        <label htmlFor="chat-input" className={styles.srOnly}>
          메시지 입력
        </label>
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="메시지를 입력... (Shift+Enter 줄바꿈)"
          className={styles.textarea}
          disabled={loading}
        />

        <div className={styles.controls}>
          <button onClick={() => handleSend()} disabled={loading || !input.trim()} className={styles.sendBtn} type="button">
            {loading ? "요청중..." : "보내기"}
          </button>

          <button
            onClick={() => {pushMessage({ id: nid(), from: "ai", text: "지도 페이지로 이동하겠습니다.", ts: Date.now() }); nav("/map"); }}
            className={styles.actionBtn}
            type="button"
          >
            지도 열기
          </button>

          <button
            onClick={() => pushMessage({ id: nid(), from: "ai", text: "예약 페이지로 이동합니다.", ts: Date.now() })}
            className={styles.actionBtn}
            type="button"
          >
            예약
          </button>
        </div>
      </div>
    </aside>
  );
}
