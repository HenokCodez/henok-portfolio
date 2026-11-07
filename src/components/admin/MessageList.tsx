import { useState, useEffect } from 'react';
import { Chip } from '../ui/Chip';
import type { Message } from '../../types';
import { Mail, CheckCircle2, Trash2, ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface MessageListProps {
  messages: Message[];
  onMarkRead: (id: string, read: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function formatRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function MessageList({
  messages,
  onMarkRead,
  onDelete,
}: MessageListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    messages.length > 0 ? messages[0].id : null,
  );
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const selectedMessage = messages.find((m) => m.id === selectedId) || null;

  // Auto-mark read after 1s
  useEffect(() => {
    if (selectedMessage && !selectedMessage.read) {
      const timer = setTimeout(() => {
        onMarkRead(selectedMessage.id, true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedMessage, onMarkRead]);

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileDetailOpen(true);
  }

  async function handleDelete(id: string) {
    if (window.confirm('Delete this message? This cannot be undone.')) {
      await onDelete(id);
      if (selectedId === id) {
        const remaining = messages.filter((m) => m.id !== id);
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        setMobileDetailOpen(false);
      }
    }
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-[14px] border border-line bg-surface p-14 text-center space-y-3">
        <p className="font-display font-semibold text-lg text-text">
          No messages yet.
        </p>
        <p className="text-muted text-sm font-mono max-w-sm mx-auto">
          They&apos;ll show up here automatically when visitors submit the contact form.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-line bg-surface overflow-hidden min-h-[640px] grid grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* Left List Pane (Hidden on mobile if detail is open) */}
      <div
        className={cn(
          'border-r border-line bg-surface divide-y divide-line overflow-y-auto max-h-[700px]',
          mobileDetailOpen ? 'hidden md:block' : 'block',
        )}
      >
        {messages.map((msg) => {
          const isSelected = msg.id === selectedId;
          return (
            <div
              key={msg.id}
              onClick={() => handleSelect(msg.id)}
              className={cn(
                'p-4 cursor-pointer transition-colors select-none text-left',
                isSelected ? 'bg-surface-2' : 'hover:bg-surface-2/50',
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {!msg.read && (
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                )}
                <h4
                  className={cn(
                    'font-display font-semibold text-sm truncate',
                    msg.read ? 'text-muted' : 'text-text font-bold',
                  )}
                >
                  {msg.name}
                </h4>
              </div>
              <p className="font-mono text-xs text-muted truncate">
                {msg.project_type} · {formatRelativeTime(msg.created_at)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Right Detail Pane */}
      <div
        className={cn(
          'p-6 sm:p-8 flex flex-col justify-between overflow-y-auto',
          !mobileDetailOpen ? 'hidden md:flex' : 'flex',
        )}
      >
        {selectedMessage ? (
          <div className="space-y-6">
            {/* Mobile Back Button */}
            <div className="md:hidden pb-3 border-b border-line">
              <button
                type="button"
                onClick={() => setMobileDetailOpen(false)}
                className="flex items-center gap-2 font-mono text-xs uppercase text-muted hover:text-text"
              >
                <ArrowLeft size={14} />
                <span>Back to messages</span>
              </button>
            </div>

            {/* Header: Name, Email & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-line">
              <div>
                <h2 className="font-display font-extrabold text-2xl sm:text-[28px] uppercase tracking-tight text-text">
                  {selectedMessage.name}
                </h2>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="font-mono text-sm text-muted hover:text-accent transition-colors"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                    `Re: ${selectedMessage.project_type} project`,
                  )}`}
                  className="h-8 px-3.5 rounded-full border border-line-strong text-xs font-semibold text-text hover:bg-surface-2 flex items-center gap-1.5 transition-colors"
                >
                  <Mail size={13} />
                  <span>Reply by email</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    onMarkRead(selectedMessage.id, !selectedMessage.read)
                  }
                  className="h-8 px-3.5 rounded-full border border-line-strong text-xs font-semibold text-text hover:bg-surface-2 flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 size={13} />
                  <span>{selectedMessage.read ? 'Mark unread' : 'Mark read'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="h-8 px-3 rounded-full border border-danger/40 text-danger text-xs font-semibold hover:bg-danger/10 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Project Tags */}
            <div className="flex items-center gap-2.5">
              <Chip variant="acc" size="sm">
                {selectedMessage.project_type}
              </Chip>
              {selectedMessage.budget && (
                <Chip variant="default" size="sm">
                  Budget: {selectedMessage.budget}
                </Chip>
              )}
            </div>

            {/* Message Body */}
            <div className="text-text/90 text-base md:text-[17px] leading-relaxed max-w-[640px] whitespace-pre-wrap py-2">
              {selectedMessage.message}
            </div>

            {/* Timestamp */}
            <div className="pt-6 border-t border-line font-mono text-xs text-muted">
              Received: {new Date(selectedMessage.created_at).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-center text-muted font-mono text-sm">
            Select a message to view details.
          </div>
        )}
      </div>
    </div>
  );
}
