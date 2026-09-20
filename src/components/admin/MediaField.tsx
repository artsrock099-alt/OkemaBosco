'use client';

import { useEffect, useState } from 'react';

type Props = {
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'video' | 'all';
  placeholder?: string;
};

/** URL field with a picker that browses the media library. */
export default function MediaField({
  value,
  onChange,
  accept = 'image',
  placeholder = '/OKema/pic5.png or https://...',
}: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/upload')
      .then((res) => res.json())
      .then((data) => {
        const all: any[] = data.media || [];
        setItems(
          accept === 'all'
            ? all
            : all.filter((m) => m.type === (accept === 'image' ? 'IMAGE' : 'VIDEO'))
        );
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, accept]);

  const isVideo = /\.(mp4|webm|mov)$/i.test(value) || accept === 'video';

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-3 py-2 border border-earth-brown/20 hover:border-earth-brown/50 font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface rounded transition-colors whitespace-nowrap"
        >
          Library
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-2 font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error whitespace-nowrap"
          >
            Remove
          </button>
        )}
      </div>

      {value && (
        <div className="w-28 h-16 bg-surface-container border border-earth-brown/15 overflow-hidden">
          {isVideo ? (
            <video src={value} muted className="w-full h-full object-cover" />
          ) : (
            <img src={value} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-deep-charcoal/60 flex items-center justify-center p-5">
          <div className="bg-surface border border-earth-brown/20 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-earth-brown/10">
              <h4 className="font-headline text-body-lg text-on-surface">Media library</h4>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
              >
                Close
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              {loading ? (
                <p className="font-body text-body-md text-on-surface-variant">Loading…</p>
              ) : items.length === 0 ? (
                <p className="font-body text-body-md text-on-surface-variant">
                  Nothing here yet. Upload files under Media, then come back to pick one.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {items.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => {
                        onChange(m.url);
                        setOpen(false);
                      }}
                      className="text-left border border-earth-brown/15 hover:border-muted-ochre rounded overflow-hidden transition-colors"
                    >
                      <div className="aspect-square bg-surface-container overflow-hidden">
                        {m.type === 'IMAGE' ? (
                          <img src={m.url} alt={m.altText || m.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-label text-label-sm uppercase tracking-widest text-on-surface-variant">
                            {m.type}
                          </div>
                        )}
                      </div>
                      <div className="p-2 font-body text-body-sm text-on-surface truncate">{m.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
