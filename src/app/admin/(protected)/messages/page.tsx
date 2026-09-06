import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'Messages' };

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
  });
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Messages</h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2">
            View, respond to and manage incoming contact inquiries.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 border border-earth-brown/20 hover:bg-surface-container font-label text-label-sm uppercase tracking-widest rounded text-on-surface-variant hover:text-on-surface transition-colors">
            Mark All Read ({unreadCount} unread)
          </button>
        </div>
      </div>
      <div className="card-surface overflow-hidden divide-y divide-earth-brown/10">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant">
            No messages yet — your inbox is quiet.
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`p-6 hover:bg-surface-container/30 transition-colors flex items-start gap-4 ${!m.isRead ? 'bg-surface-container-low' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-muted-ochre/15 border border-muted-ochre/30 flex items-center justify-center flex-shrink-0">
                <span className="font-headline text-muted-ochre text-body-md leading-none">
                  {m.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="font-medium text-on-surface">{m.name}</span>
                    {m.organization && (
                      <span className="mx-2 text-on-surface-variant font-body text-body-md">
                        • {m.organization}
                      </span>
                    )}
                    <span className="font-label text-[11px] uppercase tracking-widest text-on-surface-variant ml-2">
                      {m.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {!m.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
                    )}
                    <span className="font-label text-[10px] uppercase tracking-wider text-on-surface-variant whitespace-nowrap">
                      {formatDateShort(m.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="font-medium text-on-surface mt-2">{m.subject}</div>
                <p className="text-on-surface-variant mt-1 line-clamp-2 text-body-md">{m.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
