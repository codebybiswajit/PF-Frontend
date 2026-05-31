import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { KeyboardEvent } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_CHAT_QA } from '../data/portfolioData';
import { authApi } from '../services/api';

/* ── Types ─────────────────────────────────────────────────────── */
interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

type ModelStatus =
  | 'ready'
  | 'guest';

/* ── Constants ─────────────────────────────────────────────────── */
const MODEL_ID = 'Groq Llama 3.3';

const SYSTEM_PROMPT = `You are Biswajit Mohapatra's AI portfolio assistant. Biswajit is a Full Stack Developer & Data Engineer specializing in React, Node.js, Python, and data engineering.

His 3 major projects:
1. E-Commerce Platform (React, Node.js, PostgreSQL, Stripe, Redis) - full shopping experience with auth, cart, payments
2. Hospital Management System (Django, React, MySQL, Docker) - HIPAA-compliant EHR with scheduling, billing, staff mgmt
3. Python Web Scraping Engine (Scrapy, Selenium, Kafka, MongoDB) - distributed scraping with proxy rotation, data pipeline

This portfolio website was founded by Biswajit Mohapatra. It allows users to: browse Biswajit's projects, generate their own ATS-friendly resume by registering, and chat with AI.

Personality: helpful, casual but professional, technically precise, warm. Keep responses concise (2-4 sentences usually) unless detail is needed. Use occasional light humor. Use markdown formatting for lists.`;

const GUEST_FALLBACK = `Great question! Sign up or log in to chat with our full AI assistant for more personalized answers. Here's what I can help with as a guest:

• **Who is the founder?** — Ask about Biswajit Mohapatra
• **What can this site do?** — Features & capabilities
• **Tell me about the projects** — E-Commerce, Hospital, Scraper
• **What tech stack?** — Biswajit's skills & technologies
• **Resume / CV info** — How the resume generator works

Feel free to try one of the quick buttons above! 🚀`;

const PUBLIC_QUICK_ACTIONS = [
  'What can this site do?',
  'Who is the founder?',
  'Tell me about the projects',
  'What tech stack?',
];

const AUTH_QUICK_ACTIONS = [
  ...PUBLIC_QUICK_ACTIONS,
  'Tell me about E-Commerce project',
  'What are your strengths?',
];

/* ── Pattern Matching (Tier 1) ─────────────────────────────────── */
function matchPublicQA(input: string): string | null {
  const normalized = input.toLowerCase().trim();
  for (const qa of PUBLIC_CHAT_QA) {
    if (qa.patterns.some((p) => normalized.includes(p.toLowerCase()))) {
      return qa.answer;
    }
  }
  return null;
}

/* ── Simple Markdown renderer ──────────────────────────────────── */
function renderMarkdown(text: string): React.ReactNode {
  // Split by newlines and bold markers
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    // Bold **text** inline rendering
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const renderedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={partIdx}>{part}</React.Fragment>;
    });

    elements.push(<React.Fragment key={`line-${lineIdx}`}>{renderedLine}</React.Fragment>);
    if (lineIdx < lines.length - 1) {
      elements.push(<br key={`br-${lineIdx}`} />);
    }
  });

  return <>{elements}</>;
}

/* ── ChatPage Component ─────────────────────────────────────────── */
const ChatPage: React.FC = () => {
  // Derive isAuthenticated from user (compatible with both AuthContext versions)
  const authCtx = useAuth();
  const user = authCtx.user;
  // Support both { isAuthenticated } and derivation from user
  const isAuthenticated: boolean =
    'isAuthenticated' in authCtx
      ? (authCtx as typeof authCtx & { isAuthenticated: boolean }).isAuthenticated
      : !!user;

  /* ── State ───────────────────────────────────────────────────── */
  const [messages, setMessages] = useState<ChatMsg[]>(() => [
    {
      role: 'assistant',
      content: isAuthenticated
        ? `Hey ${'firstName' in (user ?? {}) ? (user as { firstName?: string }).firstName ?? 'there' : 'there'}! 👋 I'm Biswajit's AI assistant, powered by Groq. Ask me anything about the portfolio, Biswajit's projects, or tech stack!`
        : `Hey there! 👋 I'm Biswajit's AI assistant. I'm running in **Guest Mode** — I can answer common questions about this portfolio instantly. For full AI conversations, sign up or log in!`,
    },
  ]);

  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>(
    isAuthenticated ? 'ready' : 'guest'
  );

  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /* ── Auto-scroll to latest message ──────────────────────────── */
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  /* ── Focus input on mount ────────────────────────────────────── */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Auto-update model status when authentication loads ──────── */
  useEffect(() => {
    if (!authCtx.isLoading) {
      if (isAuthenticated && modelStatus === 'guest') {
        setModelStatus('ready');
        setMessages([
          {
            role: 'assistant',
            content: `Hey ${'firstName' in (user ?? {}) ? (user as { firstName?: string }).firstName ?? 'there' : 'there'}! 👋 I'm Biswajit's AI assistant, powered by Groq. Ask me anything about the portfolio, Biswajit's projects, or tech stack!`
          }
        ]);
      } else if (!isAuthenticated && modelStatus !== 'guest') {
        setModelStatus('guest');
        setMessages([
          {
            role: 'assistant',
            content: `Hey there! 👋 I'm Biswajit's AI assistant. I'm running in **Guest Mode** — I can answer common questions about this portfolio instantly. For full AI conversations, sign up or log in!`
          }
        ]);
      }
    }
  }, [isAuthenticated, modelStatus, authCtx.isLoading, user]);

  /* ── Human-readable status label ─────────────────────────────── */
  const statusLabel = (): string => {
    switch (modelStatus) {
      case 'ready': return '● Ready';
      case 'guest': return '● Guest Mode';
      default: return '● Unknown';
    }
  };

  /* ── Stop generation handler ────────────────────────────────── */
  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setThinking(false);
    setGenerating(false);
  }, []);

  /* ── Core: send a message ────────────────────────────────────── */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking || generating) return;

      const userMsg: ChatMsg = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setThinking(true);
      setGenerating(true);

      try {
        /* ════ TIER 1: Instant pattern match — no model needed ════ */
        const patternAnswer = matchPublicQA(trimmed);

        if (patternAnswer) {
          // Brief synthetic delay for natural feel
          await new Promise<void>((r) => setTimeout(r, 380));
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: patternAnswer },
          ]);
          return;
        }

        /* ════ TIER 2: LLM — authenticated users only ════ */
        if (!isAuthenticated) {
          // Guest with no pattern match → friendly upsell
          await new Promise<void>((r) => setTimeout(r, 350));
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: GUEST_FALLBACK },
          ]);
          return;
        }

        // Dynamic, personalized system prompt
        const userName = user && 'firstName' in user ? (user as { firstName?: string }).firstName ?? 'Guest' : 'Guest';
        const dynamicSystemPrompt = `${SYSTEM_PROMPT}\n\nYou are chatting with ${userName}. Feel free to refer to them by their name naturally.`;

        // Dynamically adjust history window size based on user prompt (default last 5, but last 10 if querying memory)
        const queriesMemory = trimmed.toLowerCase().match(/\b(remember|recall|earlier|previous)\b/);
        const historyWindowSize = queriesMemory ? -10 : -5;

        // Build conversation context
        const history = [
          { role: 'system', content: dynamicSystemPrompt },
          // Exclude the initial greeting message at index 0, and keep N turns
          ...messages.slice(1).slice(historyWindowSize).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: 'user', content: trimmed },
        ];

        // Create AbortController for this request
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const resData = await authApi.chat(history, { signal: controller.signal });

        const replyContent =
          resData.choices?.[0]?.message?.content ??
          'I could not generate a response. Please try again.';

        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: replyContent },
        ]);

      } catch (err: any) {
        if (err.name === 'CanceledError' || axios.isCancel?.(err)) {
          console.log('[ChatPage] Request canceled by user.');
        } else {
          console.error('[ChatPage] sendMessage error:', err);
          const errMsg =
            err.response?.data?.message || err.message || 'An unexpected error occurred.';
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `❌ Oops! Something went wrong: ${errMsg}. Please try again.`,
            },
          ]);
        }
      } finally {
        setThinking(false);
        setGenerating(false);
        inputRef.current?.focus();
      }
    },
    [thinking, generating, isAuthenticated, messages, user]
  );

  /* ── Enter key handler ───────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    },
    [input, sendMessage]
  );

  /* ── Quick action click ──────────────────────────────────────── */
  const handleQuickAction = useCallback(
    (action: string) => {
      sendMessage(action);
    },
    [sendMessage]
  );

  const quickActions = isAuthenticated ? AUTH_QUICK_ACTIONS : PUBLIC_QUICK_ACTIONS;

  /* ── Render ──────────────────────────────────────────────────── */
  if (authCtx.isLoading) {
    return (
      <div
        style={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'var(--bg)',
          color: 'var(--neon)',
          fontFamily: 'Orbitron, monospace',
          letterSpacing: '2px'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', animation: 'spin 4s linear infinite' }}>🤖</div>
        <h3>ESTABLISHING SECURE AI SESSION...</h3>
      </div>
    );
  }

  return (
    <div className="chat-wrap" >

      {/* ── Header ── */}
      <div className="d-flex align-items-start justify-content-between mb-3 flex-wrap gap-2">
        <div>
          <h1 className="chat-title mb-0">🤖 AI CHAT</h1>
          <span className="chat-status">{statusLabel()}</span>
        </div>

        {/* Guest badge */}
        {!isAuthenticated && (
          <span
            style={{
              background: 'rgba(255,0,200,0.1)',
              border: '1px solid rgba(255,0,200,0.35)',
              color: 'var(--neon2)',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.72rem',
              letterSpacing: '1px',
              padding: '0.4rem 0.85rem',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              alignSelf: 'flex-start',
            }}
          >
            🔒 Guest Mode — Sign up for personalized AI chat
          </span>
        )}
      </div>



      {/* ── Quick action buttons ── */}
      <div className="quick-actions">
        {quickActions.map((action) => (
          <button
            key={action}
            className="quick-btn"
            onClick={() => handleQuickAction(action)}
            disabled={generating}
          >
            {action}
          </button>
        ))}
      </div>

      {/* ── Message history ── */}
      <div className="chat-msgs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`msg ${msg.role === 'user' ? 'user' : 'bot'}`}
          >
            {msg.role === 'assistant' && (
              <div className="bot-name">BM-AI</div>
            )}
            <div>{renderMarkdown(msg.content)}</div>
          </div>
        ))}

        {/* Thinking / loading dots */}
        {thinking && (
          <div className="msg bot">
            <div className="bot-name">BM-AI</div>
            <div className="thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={msgsEndRef} />
      </div>

      {/* ── Input row ── */}
      <div className="chat-input-row">
        <input
          ref={inputRef}
          type="text"
          placeholder={
            isAuthenticated
              ? 'Ask anything about Biswajit or the portfolio…'
              : "Ask about Biswajit's portfolio (Guest Mode)…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={generating}
          autoComplete="off"
          spellCheck={false}
        />
        {generating ? (
          <button
            className="btn-pink"
            onClick={handleStop}
            style={{ whiteSpace: 'nowrap', minWidth: '84px' }}
          >
            STOP
          </button>
        ) : (
          <button
            className="btn-neon"
            onClick={() => sendMessage(input)}
            disabled={!input.trim()}
            style={{ whiteSpace: 'nowrap', minWidth: '84px' }}
          >
            SEND
          </button>
        )}
      </div>

      {/* ── Guest upsell footer ── */}
      {!isAuthenticated && (
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--muted)',
            textAlign: 'center',
            marginTop: '0.75rem',
            marginBottom: 0,
          }}
        >
          Running in Guest Mode.{' '}
          <a
            href="/signup"
            style={{ color: 'var(--neon)', textDecoration: 'none' }}
          >
            Sign up
          </a>{' '}
          or{' '}
          <a
            href="/signin"
            style={{ color: 'var(--neon)', textDecoration: 'none' }}
          >
            Sign in
          </a>{' '}
          to unlock full AI responses powered by{' '}
          <span style={{ color: 'var(--neon)' }}>{MODEL_ID}</span>.
        </p>
      )}
    </div>
  );
};

export default ChatPage;
