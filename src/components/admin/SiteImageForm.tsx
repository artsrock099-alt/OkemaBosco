'use client';

import { useState } from 'react';
import MediaField from '@/components/admin/MediaField';

type Props = {
  imageKey: string;
  label: string;
  defaultUrl: string;
  hasSavedRow: boolean;
  initial: { url: string; altText: string };
};

/**
 * One picture slot inside a coded page layout. The admin can point it at any
 * photo in the library or any URL, clear it, or go back to the photo the
 * layout ships with.
 */
export default function SiteImageForm({
  imageKey,
  label,
  defaultUrl,
  hasSavedRow,
  initial,
}: Props) {
  const [url, setUrl] = useState(initial.url);
  const [altText, setAltText] = useState(initial.altText);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [savedRow, setSavedRow] = useState(hasSavedRow);

  const send = async (method: 'PATCH' | 'DELETE', body: Record<string, any>) => {
    setStatus('saving');
    setMessage('');
    try {
      const res = await fetch('/api/admin/images', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setMessage(data.message || 'Could not save.');
        return;
      }
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 2500);
    } catch {
      setStatus('error');
      setMessage('Could not save.');
    }
  };

  const save = () => {
    setSavedRow(true);
    return send('PATCH', { key: imageKey, url: url.trim(), altText: altText.trim() });
  };

  const clear = () => {
    setUrl('');
    setSavedRow(true);
    return send('PATCH', { key: imageKey, url: '', altText: altText.trim() });
  };

  const reset = () => {
    setUrl('');
    setAltText('');
    setSavedRow(false);
    return send('DELETE', { key: imageKey });
  };

  const preview = savedRow ? url : url || defaultUrl;

  return (
    <div className="border border-earth-brown/15 rounded-lg p-5 grid grid-cols-1 md:grid-cols-12 gap-5">
      <div className="md:col-span-3">
        <div className="aspect-[4/3] bg-surface-container overflow-hidden border border-earth-brown/15">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              No picture
            </div>
          )}
        </div>
        <p className="font-body text-body-sm text-on-surface-variant mt-2">
          {savedRow
            ? url
              ? 'Using your saved picture.'
              : 'Picture removed from this section.'
            : 'Using the layout default.'}
        </p>
      </div>

      <div className="md:col-span-9 space-y-4">
        <h4 className="font-headline text-headline-md text-on-surface">{label}</h4>

        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Picture
          </label>
          <MediaField value={url} onChange={setUrl} accept="image" />
        </div>

        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Description for screen readers
          </label>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="input-field"
            placeholder="Leave blank to keep the default wording"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={status === 'saving'}
            className="btn-primary !px-8 disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving…' : 'Save picture'}
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={status === 'saving'}
            className="px-4 py-2.5 border border-earth-brown/20 hover:border-error hover:text-error font-label text-label-sm uppercase tracking-widest rounded transition-colors disabled:opacity-50"
          >
            Remove picture
          </button>
          {savedRow && (
            <button
              type="button"
              onClick={reset}
              disabled={status === 'saving'}
              className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-50"
            >
              Reset to layout default
            </button>
          )}
          {status === 'saved' && (
            <span className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Saved
            </span>
          )}
          {status === 'error' && (
            <span className="font-label text-label-sm uppercase tracking-widest text-error">
              {message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
