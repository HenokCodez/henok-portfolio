import { useState, useEffect, useCallback } from 'react';
import { getMessages, markMessageRead, deleteMessage } from '../../lib/api';
import { MessageList } from '../../components/admin/MessageList';
import type { Message } from '../../types';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Messages — Henok Admin';
    loadMessages();
  }, [loadMessages]);

  async function handleMarkRead(id: string, read: boolean) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read } : m)),
    );
    await markMessageRead(id, read);
  }

  async function handleDeleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await deleteMessage(id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold uppercase text-3xl sm:text-[34px] tracking-tight leading-none text-text">
          MESSAGES
        </h1>
        <p className="font-mono text-xs text-muted uppercase tracking-mono mt-1.5">
          Inquiries received through the public contact form
        </p>
      </div>

      {loading ? (
        <div className="rounded-[14px] border border-line bg-surface p-14 text-center font-mono text-sm text-muted">
          Loading messages…
        </div>
      ) : (
        <MessageList
          messages={messages}
          onMarkRead={handleMarkRead}
          onDelete={handleDeleteMessage}
        />
      )}
    </div>
  );
}
