'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Send, Loader2 } from 'lucide-react';

/**
 * ChatWindow Component
 * 
 * Provides a multilingual, accessible chat interface for fans.
 * Integrates with Vercel AI SDK (useChat) for streaming responses and 
 * local AccessibilityContext for TTS and simplified language settings.
 */
export function ChatWindow() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [initialMessages] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem('chat_messages');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return [];
  });

  const { simplifiedLanguage } = useAccessibility();
  const { language, t } = useLanguage();

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages,
    body: {
      language,
      simplifiedLanguage,
    },
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Save to local storage on messages change
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && window.localStorage) {
      if (messages.length > 0) {
        window.localStorage.setItem('chat_messages', JSON.stringify(messages));
      }
    }
  }, [messages, isMounted]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-card rounded-xl shadow-lg border border-card-border overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-background">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t('chat.title')}</h2>
          <p className="text-xs text-foreground/60">{t('chat.sub')}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-foreground/40 space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-center max-w-xs text-foreground/60">
              {t('chat.empty')}
            </p>
          </div>
        ) : (
          <div role="list" className="space-y-4">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex w-full mb-4 justify-start">
                <div className="bg-card rounded-2xl rounded-bl-sm px-4 py-3 flex items-center space-x-2 border border-card-border">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-sm text-foreground/70">{t('chat.thinking')}</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-secondary/10 text-secondary text-sm rounded-lg border border-secondary/20 text-center">
            {t('chat.error')}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-card-border">
        <form 
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            className="flex-1 px-4 py-3 bg-background border border-card-border rounded-full focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm outline-none text-foreground placeholder-foreground/40"
            value={input}
            onChange={handleInputChange}
            placeholder={t('chat.placeholder')}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !(input || '').trim()}
            className="p-3 bg-accent text-background rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background shadow-[0_0_10px_rgba(166,255,0,0.3)]"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
