import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchWithFallback } from './api';

const WS_BASE = import.meta.env.VITE_WS_URL || '';

export interface ChatMessage {
  id?: number;
  role: 'visitor' | 'bot' | 'agent' | 'system';
  sender_name?: string;
  content: string;
  created_at?: string;
}

interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
  agent_online: boolean;
}

interface StoredSession {
  sessionId: string;
  name: string;
  email: string;
}

const SESSION_KEY = 'bmu_chat_session';

function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeSession(session: StoredSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('chat_session_id');
}

function generateSessionId(): string {
  const existing = localStorage.getItem('chat_session_id');
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem('chat_session_id', id);
  return id;
}

export async function fetchChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
  return fetchWithFallback(
    `/public/chat/conversations/${sessionId}`,
    () => ({ session_id: sessionId, messages: [], agent_online: false })
  );
}

export async function updateContactInfo(
  sessionId: string,
  name: string,
  email: string
): Promise<void> {
  await fetchWithFallback(
    `/public/chat/conversations/${sessionId}/contact`,
    () => ({ ok: true }),
    { name, email }
  );
}

export async function checkAgentStatus(): Promise<boolean> {
  const res = await fetchWithFallback(
    '/public/chat/agent-status',
    () => ({ agent_online: false })
  ) as { agent_online: boolean };
  return res.agent_online;
}

export function useChatWebSocket() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [visitorTyping, setVisitorTyping] = useState(false);
  const [agentJoined, setAgentJoined] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [conversationEnded, setConversationEnded] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef(generateSessionId());
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT = 10;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const sessionId = sessionIdRef.current;
    const ws = new WebSocket(`${WS_BASE}/ws/chat/${sessionId}/`);

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (reconnectAttempts.current < MAX_RECONNECT) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'connection_established':
            setAgentOnline(data.agent_online);
            break;
          case 'new_message':
            setMessages((prev) => {
              if (data.id && prev.some((m) => m.id === data.id)) return prev;
              return [
                ...prev,
                {
                  id: data.id,
                  role: data.role,
                  sender_name: data.sender_name,
                  content: data.content,
                  created_at: data.created_at,
                },
              ];
            });
            break;
          case 'typing':
            if (data.role === 'agent') {
              setAgentTyping(data.is_typing);
            } else {
              setVisitorTyping(data.is_typing);
            }
            break;
          case 'agent_status':
            setAgentOnline(data.is_online);
            break;
          case 'system_message':
            setMessages((prev) => [
              ...prev,
              {
                role: 'system',
                content: data.content,
                created_at: new Date().toISOString(),
              },
            ]);
            break;
          case 'agent_joined':
            setAgentJoined(true);
            setAgentName(data.agent_name);
            setMessages((prev) => [
              ...prev,
              {
                role: 'system',
                content: `${data.agent_name} has joined the conversation.`,
                created_at: new Date().toISOString(),
              },
            ]);
            break;
          case 'conversation_ended':
            setConversationEnded(true);
            setMessages((prev) => [
              ...prev,
              {
                role: 'system',
                content: 'This conversation has ended.',
                created_at: new Date().toISOString(),
              },
            ]);
            break;
        }
      } catch {
        // ignore malformed messages
      }
    };

    wsRef.current = ws;
  }, []);

  const loadHistory = useCallback(async (sessionId: string) => {
    const history = await fetchChatHistory(sessionId);
    if (history.messages.length > 0) {
      setMessages(history.messages.map((m) => ({
        id: m.id,
        role: m.role,
        sender_name: m.sender_name,
        content: m.content,
        created_at: m.created_at,
      })));
      setAgentOnline(history.agent_online);
    }
  }, []);

  useEffect(() => {
    const sessionId = sessionIdRef.current;
    loadHistory(sessionId);
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, loadHistory]);

  const sendMessage = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
    }
  }, []);

  const startConversation = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'start_conversation' }));
    }
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'typing',
        role: 'visitor',
        is_typing: isTyping,
      }));
    }
  }, []);

  const endConversation = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_conversation' }));
    }
  }, []);

  const retryConnection = useCallback(() => {
    reconnectAttempts.current = 0;
    disconnect();
    connect();
  }, [connect, disconnect]);

  const startNewChat = useCallback(() => {
    disconnect();
    clearSession();
    setMessages([]);
    setConversationEnded(false);
    setAgentJoined(false);
    setAgentName('');
    sessionIdRef.current = generateSessionId();
    reconnectAttempts.current = 0;
    connect();
  }, [connect, disconnect]);

  return {
    messages,
    isConnected,
    agentOnline,
    agentTyping,
    visitorTyping,
    agentJoined,
    agentName,
    conversationEnded,
    sendMessage,
    sendTyping,
    startConversation,
    endConversation,
    startNewChat,
    sessionId: sessionIdRef.current,
    retryConnection,
  };
}

export { getStoredSession, storeSession, clearSession };
export type { StoredSession };
