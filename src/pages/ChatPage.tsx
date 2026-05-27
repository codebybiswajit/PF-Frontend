import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import type { KeyboardEvent } from 'react';
import * as webllm from '@mlc-ai/web-llm';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_CHAT_QA } from '../data/portfolioData';

/* ── Types ─────────────────────────────────────────────────────── */
interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

type ModelStatus =
  | 'idle'
  | 'initializing'
  | 'loading'
  | 'ready'
  | 'error'
  | 'guest';

/* ── Constants ─────────────────────────────────────────────────── */
const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC';

const SYSTEM_PROMPT = `You are Alex Johnson's AI portfolio assistant. Alex is a Full Stack Developer & Data Engineer specializing in React, Node.js, Python, and data engineering.

His 3 major projects:
1. E-Commerce Platform (React, Node.js, PostgreSQL, Stripe, Redis) - full shopping experience with auth, cart, payments
2. Hospital Management System (Django, React, MySQL, Docker) - HIPAA-compliant EHR with scheduling, billing, staff mgmt
3. Python Web Scraping Engine (Scrapy, Selenium, Kafka, MongoDB) - distributed scraping with proxy rotation, data pipeline

This portfolio website was founded by Alex Johnson. It allows users to: browse Alex's projects, generate their own ATS-friendly resume by registering, and chat with AI.

Personality: helpful, casual but professional, technically precise, warm. Keep responses concise (2-4 sentences usually) unless detail is needed. Use occasional light humor. Use markdown formatting for lists.`;

const GUEST_FALLBACK = `Great question! Sign up or log in to chat with our full AI assistant for more personalized answers. Here's what I can help with as a guest:

• **Who is the founder?** — Ask about Alex Johnson
• **What can this site do?** — Features & capabilities
• **Tell me about the projects** — E-Commerce, Hospital, Scraper
• **What tech stack?** — Alex's skills & technologies
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
        ? `Hey ${'firstName' in (user ?? {}) ? (user as { firstName?: string }).firstName ?? 'there' : 'there'}! 👋 I'm Alex's AI assistant, powered by a local LLM running right in your browser. Ask me anything about the portfolio, Alex's projects, or tech stack!`
        : `Hey there! 👋 I'm Alex's AI assistant. I'm running in **Guest Mode** — I can answer common questions about this portfolio instantly. For full AI conversations, sign up or log in!`,
    },
  ]);

  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [modelStatus, setModelStatus] = useState<ModelStatus>(
    isAuthenticated ? 'idle' : 'guest'
  );
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadText, setLoadText] = useState('');
  const [modelError, setModelError] = useState<string | null>(null);

  const engineRef = useRef<webllm.MLCEngineInterface | null>(null);
  const msgsEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const initStartedRef = useRef(false);

  /* ── Auto-scroll to latest message ──────────────────────────── */
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  /* ── Focus input on mount ────────────────────────────────────── */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ── Load WebLLM engine (authenticated users only) ───────────── */
  const loadModel = useCallback(async () => {
    if (!isAuthenticated) return;
    if (engineRef.current || initStartedRef.current) return;
    initStartedRef.current = true;

    setModelStatus('initializing');
    setLoadText('Initializing WebLLM engine…');

    try {
      const initProgress = (report: webllm.InitProgressReport) => {
        setLoadText(report.text);
        // Try to extract percentage like "Loading model... 42%"
        const match = report.text.match(/(\d+(\.\d+)?)\s*%/);
        if (match) {
          setLoadProgress(parseFloat(match[1]));
          setModelStatus('loading');
        } else {
          setModelStatus('initializing');
        }
      };

      const engine = await webllm.CreateMLCEngine(MODEL_ID, {
        initProgressCallback: initProgress,
      });

      engineRef.current = engine;
      setModelStatus('ready');
      setLoadProgress(100);
      setLoadText('');
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unknown error while loading model.';
      setModelError(msg);
      setModelStatus('error');
      console.error('[WebLLM] Load error:', err);
    }
  }, [isAuthenticated]);

  /* ── Auto-trigger model load for authenticated users ─────────── */
  useEffect(() => {
    if (isAuthenticated && modelStatus === 'idle') {
      loadModel();
    }
  }, [isAuthenticated, modelStatus, loadModel]);

  /* ── Human-readable status label ─────────────────────────────── */
  const statusLabel = (): string => {
    switch (modelStatus) {
      case 'idle':         return '● Idle';
      case 'initializing': return '● Initializing...';
      case 'loading':      return `● Loading model ${loadProgress.toFixed(0)}%...`;
      case 'ready':        return '● Ready';
      case 'error':        return '● Error';
      case 'guest':        return '● Guest Mode';
      default:             return '● Unknown';
    }
  };

  /* ── Core: send a message ────────────────────────────────────── */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      const userMsg: ChatMsg = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setThinking(true);

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

        // Model still loading?
        if (modelStatus !== 'ready' || !engineRef.current) {
          await new Promise<void>((r) => setTimeout(r, 500));
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                '⚙️ The AI model is still loading — watch the progress bar above! Once it hits 100% you\'ll get full AI responses. Pattern-matched answers still work instantly.',
            },
          ]);
          return;
        }

        // Build conversation context
        const history: webllm.ChatCompletionMessageParam[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          // Include recent history (last 10 turns to avoid token overflow)
          ...messages.slice(-10).map((m) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
          { role: 'user', content: trimmed },
        ];

        const reply = await engineRef.current.chat.completions.create({
          messages: history,
          temperature: 0.7,
          max_tokens: 512,
          stream: false,
        });

        const content =
          reply.choices[0]?.message?.content ??
          'Sorry, I couldn\'t generate a response. Please try again.';

        setMessages((prev) => [...prev, { role: 'assistant', content }]);

      } catch (err: unknown) {
        console.error('[ChatPage] sendMessage error:', err);
        const errMsg =
          err instanceof Error ? err.message : 'An unexpected error occurred.';
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `❌ Oops! Something went wrong: ${errMsg}. Please try again.`,
          },
        ]);
      } finally {
        setThinking(false);
        inputRef.current?.focus();
      }
    },
    [thinking, isAuthenticated, messages, modelStatus]
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
  return (
    <div className="chat-wrap">

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

      {/* ── WebLLM loading bar (authenticated + loading/initializing) ── */}
      {isAuthenticated &&
        (modelStatus === 'loading' || modelStatus === 'initializing') && (
          <div className="webllm-loading">
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginBottom: '0.4rem' }}
            >
              <span
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--neon)',
                  fontFamily: "'Share Tech Mono', monospace",
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '75%',
                }}
              >
                {loadText || 'Preparing AI engine…'}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  fontFamily: "'Share Tech Mono', monospace",
                  marginLeft: '0.5rem',
                  flexShrink: 0,
                }}
              >
                {loadProgress.toFixed(0)}%
              </span>
            </div>

            <div className="webllm-progress">
              <div
                className="webllm-progress-bar"
                style={{ width: `${loadProgress}%` }}
              />
            </div>

            <p
              style={{
                fontSize: '0.74rem',
                color: 'var(--muted)',
                marginTop: '0.5rem',
                marginBottom: 0,
              }}
            >
              ⚡ Loading{' '}
              <span style={{ color: 'var(--neon)' }}>{MODEL_ID}</span>{' '}
              locally in your browser — first-time load may take a minute.
            </p>
          </div>
        )}

      {/* ── Model error banner ── */}
      {modelStatus === 'error' && modelError && (
        <div
          className="mb-3 p-3"
          style={{
            background: 'rgba(255,68,68,0.07)',
            border: '1px solid rgba(255,68,68,0.3)',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#ff6666',
          }}
        >
          <strong>⚠ Model failed to load:</strong> {modelError}
          <br />
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            Pattern-based responses still work. Refresh the page to retry loading the model.
          </span>
        </div>
      )}

      {/* ── Quick action buttons ── */}
      <div className="quick-actions">
        {quickActions.map((action) => (
          <button
            key={action}
            className="quick-btn"
            onClick={() => handleQuickAction(action)}
            disabled={thinking}
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
              <div className="bot-name">ALEX-AI</div>
            )}
            <div>{renderMarkdown(msg.content)}</div>
          </div>
        ))}

        {/* Thinking / loading dots */}
        {thinking && (
          <div className="msg bot">
            <div className="bot-name">ALEX-AI</div>
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
              ? 'Ask anything about Alex or the portfolio…'
              : "Ask about Alex's portfolio (Guest Mode)…"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={thinking}
          autoComplete="off"
          spellCheck={false}
        />
        <button
          className="btn-neon"
          onClick={() => sendMessage(input)}
          disabled={thinking || !input.trim()}
          style={{ whiteSpace: 'nowrap', minWidth: '84px' }}
        >
          {thinking ? '…' : 'SEND'}
        </button>
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
