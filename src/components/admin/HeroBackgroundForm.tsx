'use client';

import { useState } from 'react';
import MediaField from '@/components/admin/MediaField';

type Props = {
  pageSlug: string;
  pageTitle: string;
  pagePath: string;
  defaultImage?: string;
  hasSavedRow: boolean;
  initial: { imageUrl: string; videoUrl: string; overlay: number };
};

export default function HeroBackgroundForm({
  pageSlug,
  pageTitle,
  pagePath,
  defaultImage,
  hasSavedRow,
  initial,
}: Props) {
  const [imageUrl, setImageUrl] = useState(initial.imageUrl);
  const [videoUrl, setVideoUrl] = useState(initial.videoUrl);
  const [overlay, setOverlay] = useState(String(initial.overlay));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [savedRow, setSavedRow] = useState(hasSavedRow);

  const send = async (method: 'PATCH' | 'DELETE', body?: Record<string, any>) => {
    setStatus('saving');
    setMessage('');
    try {
      const res = await fetch('/api/admin/heroes', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body ? body : { pageSlug }),
      });
      const data = await res.json();
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
    setSavedRow(Boolean(imageUrl || videoUrl));
    return send('PATCH', {
      pageSlug,
      imageUrl: imageUrl.trim(),
      videoUrl: videoUrl.trim(),
      overlay: Number(overlay) || 0,
    });
  };

  const removeBackground = () => {
    setImageUrl('');
    setVideoUrl('');
    setSavedRow(true);
    return send('PATCH', { pageSlug, imageUrl: '', videoUrl: '', overlay: Number(overlay) || 0 });
  };

  const resetToDefault = () => {
    setImageUrl('');
    setVideoUrl('');
    setSavedRow(false);
    return send('DELETE', { pageSlug });
  };

  const preview =
    videoUrl.trim() ||
    imageUrl.trim() ||
    (savedRow ? '' : defaultImage || '');

  return (
    <div className="card-surface p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-3">
        <h3 className="font-headline text-headline-md text-on-surface">{pageTitle}</h3>
        <p className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant mt-1">
          {pagePath}
        </p>
        <div className="mt-4 aspect-video bg-deep-charcoal overflow-hidden border border-earth-brown/15">
          {preview ? (
            /\.(mp4|webm|mov)$/i.test(preview) ? (
              <video src={preview} muted loop autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <img src={preview} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center font-label text-[10px] uppercase tracking-widest text-surface-variant">
              No background
            </div>
          )}
        </div>
        <p className="font-body text-body-sm text-on-surface-variant mt-2">
          {savedRow
            ? imageUrl || videoUrl
              ? 'Using your saved background.'
              : 'Background removed for this page.'
            : defaultImage
            ? 'Using the layout default.'
            : 'This hero has no background yet.'}
        </p>
      </div>

      <div className="lg:col-span-9 space-y-5">
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Background image
          </label>
          <MediaField value={imageUrl} onChange={setImageUrl} accept="image" />
        </div>

        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Background video
          </label>
          <MediaField
            value={videoUrl}
            onChange={setVideoUrl}
            accept="all"
            placeholder="YouTube or Vimeo link, or /uploads/clip.mp4"
          />
          <p className="font-body text-body-sm text-on-surface-variant mt-2">
            A video takes priority over the image, which is then used as the poster frame. It plays
            muted, on a loop, without controls.
          </p>
        </div>

        <div className="max-w-[220px]">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Darkness (0 to 100)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={overlay}
            onChange={(e) => setOverlay(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="button"
            onClick={save}
            disabled={status === 'saving'}
            className="btn-primary !px-8 disabled:opacity-50"
          >
            {status === 'saving' ? 'Saving…' : 'Save background'}
          </button>
          <button
            type="button"
            onClick={removeBackground}
            disabled={status === 'saving'}
            className="px-4 py-2.5 border border-earth-brown/20 hover:border-error hover:text-error font-label text-label-sm uppercase tracking-widest rounded transition-colors disabled:opacity-50"
          >
            Remove background
          </button>
          {savedRow && (
            <button
              type="button"
              onClick={resetToDefault}
              disabled={status === 'saving'}
              className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface disabled:opacity-50"
            >
              Reset to layout default
            </button>
          )}
          {status === 'saved' && (
            <span className="px-3 py-1.5 bg-earth-brown/10 text-earth-brown rounded font-label text-[10px] uppercase tracking-widest">
              ✓ Saved
            </span>
          )}
          {message && <span className="font-body text-body-sm text-error">{message}</span>}
        </div>
      </div>
    </div>
  );
}
