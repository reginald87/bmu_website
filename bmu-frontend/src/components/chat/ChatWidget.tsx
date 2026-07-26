import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ChevronDown, CheckCheck, X, RotateCcw } from 'lucide-react';
import {
  useChatWebSocket,
  updateContactInfo,
  getStoredSession,
  storeSession,
  type ChatMessage,
} from '../../services/chat';

function formatTime(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isVisitor = msg.role === 'visitor';
  const isSystem = msg.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center mb-3">
        <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs text-gray-600 text-center">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isVisitor ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isVisitor && (
        <div className="flex-shrink-0 mr-2 self-end">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: msg.role === 'bot' ? '#A51C30' : '#1E1E1E' }}
          >
            {msg.role === 'bot' ? 'B' : 'A'}
          </div>
        </div>
      )}
      <div className={`max-w-[75%] ${isVisitor ? 'order-1' : 'order-2'}`}>
        {!isVisitor && msg.sender_name && (
          <div className="text-[10px] font-medium text-gray-500 mb-0.5 ml-1">{msg.sender_name}</div>
        )}
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed ${
            isVisitor
              ? 'rounded-2xl rounded-br-md'
              : 'rounded-2xl rounded-bl-md'
          }`}
          style={{
            backgroundColor: isVisitor ? '#A51C30' : '#f0f0f0',
            color: isVisitor ? '#fff' : '#1a1a1a',
          }}
        >
          {msg.content}
        </div>
        <div
          className={`flex items-center gap-1 mt-0.5 ${
            isVisitor ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-gray-400">{formatTime(msg.created_at)}</span>
          {isVisitor && (
            <CheckCheck className="w-3 h-3 text-blue-400" />
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="flex-shrink-0 mr-2 self-end">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: '#1E1E1E' }}
        >
          A
        </div>
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-md"
        style={{ backgroundColor: '#f0f0f0' }}
      >
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}

export function ChatWidget() {
  const stored = getStoredSession();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [showContactForm, setShowContactForm] = useState(!stored);
  const [contactName, setContactName] = useState(stored?.name || '');
  const [contactEmail, setContactEmail] = useState(stored?.email || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const {
    messages,
    isConnected,
    agentOnline,
    agentTyping,
    sendMessage,
    sendTyping,
    startConversation,
    startNewChat,
    sessionId,
    retryConnection,
    agentJoined,
    agentName,
    conversationEnded,
    endConversation,
  } = useChatWebSocket();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, agentTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;

    if (showContactForm) {
      setShowContactForm(false);
    }

    sendMessage(text);
    setInputText('');
  }, [inputText, sendMessage, showContactForm]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputText(e.target.value);

      sendTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, 1500);
    },
    [sendTyping]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleContactSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!contactName.trim()) return;
      setShowContactForm(false);
      storeSession({ sessionId, name: contactName, email: contactEmail });
      updateContactInfo(sessionId, contactName, contactEmail).catch(() => {});
      startConversation();
    },
    [sessionId, contactName, contactEmail, startConversation]
  );

  const handleNewChat = useCallback(() => {
    setShowContactForm(true);
    setContactName('');
    setContactEmail('');
    startNewChat();
  }, [startNewChat]);

  const isEmpty = messages.length === 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-5 z-[60] w-[calc(100vw-2.5rem)] max-w-[360px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ backgroundColor: '#A51C30' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="/logo.png"
                    alt="BMU"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      agentOnline ? 'bg-green-400' : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Bayelsa Medical University</div>
                  <div className="text-white/70 text-xs">
                    {conversationEnded
                      ? 'Conversation Ended'
                      : agentJoined
                      ? `${agentName} is assisting you`
                      : isConnected
                      ? agentOnline
                        ? 'Online'
                        : 'Bot Assistant'
                      : 'Reconnecting...'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conversationEnded && (
                  <button
                    onClick={handleNewChat}
                    className="text-white/80 hover:text-white transition p-1"
                    title="New conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                {!conversationEnded && (
                  <button
                    onClick={endConversation}
                    className="text-white/80 hover:text-white transition p-1"
                    title="End conversation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition p-1"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" style={{ backgroundColor: '#e8ddd0' }}>
              {isEmpty && showContactForm ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: '#A51C30' }}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Welcome to Bayelsa Medical University! Please introduce yourself so we can assist you better.
                  </p>
                  <form onSubmit={handleContactSubmit} className="w-full space-y-2">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none"
                      style={{ borderColor: contactName ? '#A51C30' : '#d1d5db' }}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your email (optional)"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg text-white font-medium text-sm"
                      style={{ backgroundColor: '#A51C30' }}
                    >
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <MessageBubble key={msg.id ?? i} msg={msg} />
                  ))}
                  {agentTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />

                  {conversationEnded && (
                    <div className="flex flex-col items-center mt-4 pt-4 border-t border-gray-300/50">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: '#A51C30' }}
                      >
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-600 text-sm text-center mb-3">
                        Need more help? Start a new conversation.
                      </p>
                      <button
                        onClick={handleNewChat}
                        className="px-6 py-2.5 rounded-lg text-white font-medium text-sm transition hover:opacity-90"
                        style={{ backgroundColor: '#A51C30' }}
                      >
                        Start New Conversation
                      </button>
                    </div>
                  )}
                </>
              )}

              {!isConnected && messages.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={retryConnection}
                    className="text-xs text-blue-500 hover:underline py-1"
                  >
                    Connection lost. Click to reconnect.
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-3 py-3 border-t border-gray-200" style={{ backgroundColor: '#f7f7f7' }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={conversationEnded ? "Conversation ended" : "Type a message..."}
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={conversationEnded}
                  className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 text-sm focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#fff' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputText.trim() || conversationEnded}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition"
                  style={{ backgroundColor: inputText.trim() && !conversationEnded ? '#A51C30' : '#ccc' }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-20 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-white"
          style={{ backgroundColor: '#A51C30' }}
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </>
  );
}
