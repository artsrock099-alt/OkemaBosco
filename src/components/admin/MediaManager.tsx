'use client';

import { useState } from 'react';
import { formatDateShort, formatFileSize } from '@/lib/utils';

export type MediaItem = {
  id: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  title: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  credit?: string | null;
  createdAt: Date;
};

type Props = {
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  items: MediaItem[];
};

const typeLabels = {
  IMAGE: { singular: 'Photo', plural: 'Photos', icon: '🖼️' },
  VIDEO: { singular: 'Video', plural: 'Videos', icon: '🎬' },
  AUDIO: { singular: 'Audio Track', plural: 'Audio Tracks', icon: '🎵' },
  DOCUMENT: { singular: 'Document', plural: 'Documents', icon: '📄' },
};

export default function MediaManager({ type, items: initialItems }: Props) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [view, setView] = useState<'grid' | 'list'>(type === 'IMAGE' || type === 'VIDEO' ? 'grid' : 'list');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');

  const label = typeLabels[type];
  const filtered = items.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.altText || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (files: FileList) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);
        fd.append('title', file.name);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          setItems((prev) => [
            {
              id: data.id || Math.random().toString(36).slice(2),
              type,
              title: file.name,
              filename: file.name,
              url: data.url || `https://picsum.photos/seed/${Math.random()}/1200/800`,
              mimeType: file.type,
              size: file.size,
              createdAt: new Date(),
            } as MediaItem,
            ...prev,
          ]);
        } else throw new Error();
      } catch (e) {
        setItems((prev) => [
          {
            id: Math.random().toString(36).slice(2),
            type,
            title: file.name,
            filename: file.name,
            url:
              type === 'IMAGE'
                ? `https://picsum.photos/seed/${file.name}/1200/800`
                : `#media-${type.toLowerCase()}-${file.name}`,
            mimeType: file.type,
            size: file.size,
            width: type === 'IMAGE' ? 1200 : null,
            height: type === 'IMAGE' ? 800 : null,
            createdAt: new Date(),
          },
          ...prev,
        ]);
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete this ${label.singular.toLowerCase()}?`)) return;
    try {
      await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total {label.plural}</div>
          <div className="font-display text-headline-lg text-on-surface">{items.length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Storage Used</div>
          <div className="font-display text-headline-lg text-muted-ochre">
            {formatFileSize(items.reduce((a, b) => a + b.size, 0))}
          </div>
        </div>
        <div className="card-surface p-4 md:col-span-2" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${label.plural.toLowerCase()}...`}
              className="input-field !w-64 pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">🔍</span>
          </div>
          <div className="flex gap-1 p-1 bg-surface-container rounded border border-earth-brown/10">
            <button
              onClick={() => setView('grid')}
              className={`px-3 py-1.5 rounded font-label text-[10px] uppercase tracking-widest transition-colors ${
                view === 'grid' ? 'bg-deep-charcoal text-warm-ivory' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded font-label text-[10px] uppercase tracking-widest transition-colors ${
                view === 'list' ? 'bg-deep-charcoal text-warm-ivory' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              List
            </button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <label className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors cursor-pointer inline-block">
            {uploading ? 'Uploading...' : `+ Upload ${label.plural}`}
            <input
              type="file"
              multiple
              accept={
                type === 'IMAGE'
                  ? 'image/*'
                  : type === 'VIDEO'
                  ? 'video/*'
                  : type === 'AUDIO'
                  ? 'audio/*'
                  : '.pdf,.doc,.docx,.txt,.rtf'
              }
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              disabled={uploading}
            />
          </label>
          <button
            onClick={() => {
              setEditingId(null);
              setShowForm(true);
            }}
            className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            + Add {label.singular}
          </button>
        </div>
      </div>

      {showForm && !editingId && (
        <MediaItemForm
          type={type}
          onClose={() => setShowForm(false)}
          onSave={(item) => {
            setItems((prev) => [item, ...prev]);
            setShowForm(false);
          }}
        />
      )}

      {editingId && (
        <MediaItemForm
          initial={items.find((i) => i.id === editingId)}
          type={type}
          onClose={() => setEditingId(null)}
          onSave={(item) => {
            setItems((prev) => prev.map((i) => (i.id === item.id ? { ...item, createdAt: i.createdAt } : i)));
            setEditingId(null);
          }}
        />
      )}

      {filtered.length === 0 ? (
        <div className="card-surface p-16 text-center border-2 border-dashed border-earth-brown/20">
          <div className="text-6xl mb-4 opacity-30">{label.icon}</div>
          <div className="font-headline text-headline-md text-on-surface mb-3">No {label.plural.toLowerCase()} yet</div>
          <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto mb-6">
            Upload {label.plural.toLowerCase()} to use them across the website, pages, blog posts and events.
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="card-surface overflow-hidden group relative hover:ring-1 hover:ring-muted-ochre/30 transition-all">
              <div className="aspect-[4/3] bg-surface-container relative overflow-hidden">
                {type === 'IMAGE' ? (
                  <img src={item.url} alt={item.altText || item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : type === 'VIDEO' ? (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-gradient-to-br from-deep-charcoal/40 to-earth-brown/20">
                    <div className="text-center">
                      <div className="text-5xl mb-2">▶</div>
                      {item.caption && <div className="px-3 font-label text-[10px] uppercase tracking-widest">{item.caption}</div>}
                    </div>
                  </div>
                ) : type === 'AUDIO' ? (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-gradient-to-br from-muted-ochre/10 to-earth-brown/10">
                    <div className="text-5xl">🎵</div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container">
                    <div className="text-5xl">📄</div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="font-medium text-on-surface font-body text-body-md truncate">{item.title}</div>
                <div className="flex items-center justify-between font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  <span>{formatFileSize(item.size)}</span>
                  <span>{formatDateShort(item.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-earth-brown/10">
                  <button
                    onClick={() => setEditingId(item.id)}
                    className="text-muted-ochre hover:text-earth-brown font-label text-[10px] uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-error hover:opacity-80 font-label text-[10px] uppercase tracking-widest ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-body-md min-w-[720px]">
              <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
                <tr>
                  <th className="py-3 px-6 font-normal">{label.singular}</th>
                  <th className="py-3 px-6 font-normal">File</th>
                  <th className="py-3 px-6 font-normal">Size</th>
                  <th className="py-3 px-6 font-normal">Uploaded</th>
                  <th className="py-3 px-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-brown/10">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {type === 'IMAGE' ? (
                          <img src={item.url} alt="" className="w-12 h-12 object-cover rounded border border-earth-brown/10" />
                        ) : (
                          <div className="w-12 h-12 bg-surface-container rounded flex items-center justify-center text-2xl border border-earth-brown/10">
                            {label.icon}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-on-surface truncate">{item.title}</div>
                          {item.altText && <div className="font-label text-label-sm text-on-surface-variant truncate">{item.altText}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant truncate max-w-[200px]">{item.filename}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{formatFileSize(item.size)}</td>
                    <td className="py-4 px-6 text-on-surface-variant">{formatDateShort(item.createdAt)}</td>
                    <td className="py-4 px-6 text-right space-x-3">
                      <button
                        onClick={() => setEditingId(item.id)}
                        className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MediaItemForm({
  initial,
  type,
  onClose,
  onSave,
}: {
  initial?: MediaItem;
  type: MediaItem['type'];
  onClose: () => void;
  onSave: (item: MediaItem) => void;
}) {
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onSave({
      id: initial?.id || Math.random().toString(36).slice(2),
      type,
      title: fd.get('title') as string,
      filename: (fd.get('filename') as string) || (fd.get('title') as string),
      url: (fd.get('url') as string) || initial?.url || `#media-${type.toLowerCase()}`,
      mimeType: (fd.get('mimeType') as string) || initial?.mimeType || 'application/octet-stream',
      size: parseInt(fd.get('size') as string) || initial?.size || 0,
      altText: fd.get('altText') as string,
      caption: fd.get('caption') as string,
      description: fd.get('description') as string,
      credit: fd.get('credit') as string,
      createdAt: initial?.createdAt || new Date(),
    });
    setMsg({ type: 'ok', text: 'Saved.' });
    setTimeout(() => onClose(), 400);
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 space-y-5 border-2 border-muted-ochre/20">
      <div className="flex justify-between items-center">
        <h3 className="font-headline text-headline-md text-on-surface">
          {initial ? `Edit ${typeLabels[type].singular}` : `New ${typeLabels[type].singular}`}
        </h3>
        <button type="button" onClick={onClose} className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
          ✕ Close
        </button>
      </div>
      {msg && (
        <div className={`p-3 rounded font-body text-sm ${msg.type === 'ok' ? 'bg-earth-brown/10 text-earth-brown' : 'bg-error-container text-on-error-container'}`}>
          {msg.text}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Title *</label>
          <input name="title" type="text" defaultValue={initial?.title} required className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">URL</label>
          <input name="url" type="text" defaultValue={initial?.url} className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Filename</label>
          <input name="filename" type="text" defaultValue={initial?.filename} className="input-field" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Alt Text</label>
          <input name="altText" type="text" defaultValue={initial?.altText || undefined} className="input-field" placeholder="Accessibility description for screen readers..." />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Caption</label>
          <input name="caption" type="text" defaultValue={initial?.caption || undefined} className="input-field" />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Credit</label>
          <input name="credit" type="text" defaultValue={initial?.credit || undefined} className="input-field" />
        </div>
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
          <textarea name="description" rows={3} defaultValue={initial?.description || undefined} className="input-field resize-y" />
        </div>
        <input type="hidden" name="size" defaultValue={initial?.size || 0} />
        <input type="hidden" name="mimeType" defaultValue={initial?.mimeType} />
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-earth-brown/10">
        <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary !px-8">{initial ? 'Update' : 'Save'}</button>
      </div>
    </form>
  );
}
