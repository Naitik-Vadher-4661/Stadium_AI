'use client';

import { Message } from 'ai';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      role="listitem"
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-background rounded-br-sm shadow-[0_0_10px_rgba(0,229,255,0.2)]'
            : 'bg-card text-foreground rounded-bl-sm border border-card-border shadow-sm'
        }`}
      >
        <div className="flex flex-col gap-2">
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
