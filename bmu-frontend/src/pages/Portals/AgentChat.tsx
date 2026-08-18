import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import {
  MessageCircle, Send, Search,
  PhoneOff, RefreshCw, Wifi, WifiOff, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { chatAdminApi, type ChatConversation, type ChatConversationDetail } from '../../services/api';

const WS_BASE = import.meta.env.VITE_WS_URL || '';

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  agent_handling: 'bg-blue-100 text-blue-700',
  ended: 'bg-gray-100 text-gray-500',
  bot_only: 'bg-yellow-100 text-yellow-700',
};

function formatTime(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return formatTime(dateStr);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export const AgentChat = () => {
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<ChatConversationDetail | null>(null);
  const [messages, setMessages] = useState<Array<{ id: number; role: string; content: string; created_at: string }>>([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [agentOnline, setAgentOnline] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatAdminApi.getConversations(statusFilter || undefined);
      setConversations(data);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 15000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  const connectToConversation = useCallback((_convId: number, sessionId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${WS_BASE}/ws/chat/${sessionId}/`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'agent_join' }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          setMessages(prev => [...prev, {
            id: data.id,
            role: data.role,
            content: data.content,
            created_at: data.created_at,
          }]);
        } else if (data.type === 'typing' && data.role === 'visitor') {
          // Could show visitor typing indicator
        } else if (data.type === 'conversation_ended') {
          setMessages(prev => [...prev, {
            id: Date.now(),
            role: 'system',
            content: 'This conversation has ended.',
            created_at: new Date().toISOString(),
          }]);
        }
      } catch { /* ignore */ }
    };

    ws.onerror = () => ws.close();
    ws.onclose = () => { /* reconnect could be added */ };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (selectedConv) {
      setMessages(selectedConv.messages || []);
      connectToConversation(selectedConv.id, selectedConv.session_id);
      setTimeout(scrollToBottom, 100);
      inputRef.current?.focus();
    }
  }, [selectedConv, connectToConversation, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSelectConversation = async (conv: ChatConversation) => {
    try {
      const detail = await chatAdminApi.getConversationDetail(conv.id);
      setSelectedConv(detail);
    } catch {
      // fallback
      setSelectedConv({
        ...conv,
        agent_assigned_at: null,
        messages: [],
      });
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || !selectedConv || isSending) return;

    setIsSending(true);
    try {
      // Try WebSocket first
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'message', content: text }));
        // Message will come back via onmessage
      } else {
        // Fallback to REST
        await chatAdminApi.sendMessage(selectedConv.id, text);
        // Reload conversation to get the new message
        const updated = await chatAdminApi.getConversationDetail(selectedConv.id);
        setMessages(updated.messages);
      }
      setInputText('');
    } catch {
      // ignore
    } finally {
      setIsSending(false);
    }
  };

  const handleJoin = async (conv: ChatConversation) => {
    try {
      await chatAdminApi.joinConversation(conv.id);
      await handleSelectConversation(conv);
      loadConversations();
    } catch {
      // ignore
    }
  };

  const handleLeave = async () => {
    if (!selectedConv) return;
    try {
      await chatAdminApi.leaveConversation(selectedConv.id);
      setSelectedConv(null);
      setMessages([]);
      loadConversations();
    } catch {
      // ignore
    }
  };

  const handleEnd = async () => {
    if (!selectedConv) return;
    try {
      await chatAdminApi.endConversation(selectedConv.id);
      setSelectedConv(null);
      setMessages([]);
      loadConversations();
    } catch {
      // ignore
    }
  };

  const handleToggleStatus = async () => {
    try {
      const res = await chatAdminApi.toggleAgentStatus(!agentOnline);
      setAgentOnline(res.is_online);
    } catch {
      // ignore
    }
  };

  const filteredConversations = conversations.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.visitor_name.toLowerCase().includes(q) ||
      c.visitor_email.toLowerCase().includes(q) ||
      c.last_message.toLowerCase().includes(q) ||
      c.session_id.toLowerCase().includes(q)
    );
  });

  if (!isAuthenticated || !['admin', 'staff'].includes(user?.role || '')) {
    return <Navigate to="/portals/login" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Agent Chat | Admin Portal | Bayelsa Medical University</title>
      </Helmet>

      <div className="flex h-[calc(100vh-73px-48px)] gap-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-base">Conversations</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleStatus}
                  className={`p-1.5 rounded-full transition ${
                    agentOnline
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                  title={agentOnline ? 'Go offline' : 'Go online'}
                >
                  {agentOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={loadConversations}
                  className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#A51C30]"
              />
            </div>

            {/* Filters */}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <span className="text-gray-600">
                  Filter: {statusFilter || 'All'} {statusFilter ? `(${conversations.filter(c => !statusFilter || c.status === statusFilter).length})` : ''}
                </span>
                <ChevronRight className={`w-3 h-3 text-gray-400 transition ${filterOpen ? 'rotate-90' : ''}`} />
              </button>
              {filterOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {[
                    { value: '', label: 'All' },
                    { value: 'active', label: 'Active' },
                    { value: 'agent_handling', label: 'Agent Handling' },
                    { value: 'ended', label: 'Ended' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setStatusFilter(opt.value); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition ${
                        statusFilter === opt.value ? 'bg-[#A51C30]/5 text-[#A51C30] font-medium' : 'text-gray-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-[#A51C30] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">No conversations found</p>
              </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                    selectedConv?.id === conv.id ? 'bg-[#A51C30]/5 border-l-2 border-l-[#A51C30]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#A51C30]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[#A51C30]">
                          {(conv.visitor_name || 'V')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {conv.visitor_name || 'Anonymous'}
                        </p>
                        {conv.visitor_email && (
                          <p className="text-xs text-gray-400 truncate">{conv.visitor_email}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {formatDate(conv.updated_at)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1.5 ml-10">
                    {conv.last_message || 'No messages yet'}
                  </p>
                  <div className="flex items-center gap-2 ml-10">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColors[conv.status] || 'bg-gray-100 text-gray-500'}`}>
                      {conv.status === 'agent_handling' ? 'Assigned' : conv.status}
                    </span>
                    {conv.agent_assigned_name && (
                      <span className="text-[10px] text-gray-400">{conv.agent_assigned_name}</span>
                    )}
                    {conv.message_count > 0 && (
                      <span className="text-[10px] text-gray-400 ml-auto">{conv.message_count} msgs</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Agent Chat</h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Select a conversation from the list to start assisting visitors.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#A51C30] flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {(selectedConv.visitor_name || 'V')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedConv.visitor_name || 'Anonymous'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedConv.visitor_email || `Session: ${selectedConv.session_id.slice(0, 8)}...`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedConv.status === 'active' && !selectedConv.agent_assigned_id && (
                    <button
                      onClick={() => handleJoin(selectedConv)}
                      className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition"
                    >
                      Join
                    </button>
                  )}
                  {selectedConv.agent_assigned_id === user?.id && (
                    <button
                      onClick={handleLeave}
                      className="px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-lg hover:bg-yellow-600 transition flex items-center gap-1"
                    >
                      <PhoneOff className="w-3 h-3" />
                      Leave
                    </button>
                  )}
                  <button
                    onClick={handleEnd}
                    className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    End
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 bg-[#f5f0ea]">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-400">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isAgent = msg.role === 'agent';
                    const isSystem = msg.role === 'system';
                    if (isSystem) {
                      return (
                        <div key={msg.id || i} className="flex justify-center my-3">
                          <div className="px-3 py-1.5 bg-gray-200 rounded-full text-xs text-gray-500">
                            {msg.content}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={msg.id || i} className={`flex mb-3 ${isAgent ? 'justify-end' : 'justify-start'}`}>
                        {!isAgent && (
                          <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center mr-2 flex-shrink-0 self-end">
                            <span className="text-xs font-bold text-white">
                              {msg.role === 'bot' ? 'B' : 'V'}
                            </span>
                          </div>
                        )}
                        <div className={`max-w-[70%] ${isAgent ? 'order-1' : 'order-2'}`}>
                          <div
                            className={`px-4 py-2.5 text-sm leading-relaxed ${
                              isAgent ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-bl-md'
                            }`}
                            style={{
                              backgroundColor: isAgent ? '#A51C30' : msg.role === 'bot' ? '#fff' : '#e0d5c8',
                              color: isAgent ? '#fff' : '#1a1a1a',
                            }}
                          >
                            {msg.content}
                          </div>
                          <div className={`text-[10px] text-gray-400 mt-0.5 ${isAgent ? 'text-right' : 'text-left'}`}>
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                        {isAgent && (
                          <div className="w-7 h-7 rounded-full bg-[#A51C30] flex items-center justify-center ml-2 flex-shrink-0 self-end">
                            <span className="text-xs font-bold text-white">A</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-3 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      selectedConv.status === 'ended'
                        ? 'Conversation ended'
                        : selectedConv.agent_assigned_id !== user?.id && selectedConv.agent_assigned_id !== null
                        ? 'Assigned to another agent...'
                        : 'Type your message...'
                    }
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={selectedConv.status === 'ended' || isSending}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#A51C30] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputText.trim() || isSending || selectedConv.status === 'ended'}
                    className="w-10 h-10 rounded-full bg-[#A51C30] text-white flex items-center justify-center hover:bg-[#8a1725] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
