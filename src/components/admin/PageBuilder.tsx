'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDateShort } from '@/lib/utils';

type SectionType =
  | 'HERO' | 'RICH_TEXT' | 'IMAGE' | 'IMAGE_TEXT' | 'VIDEO' | 'AUDIO'
  | 'GALLERY' | 'EVENTS' | 'MUSIC' | 'TESTIMONIALS' | 'QUOTE' | 'CTA'
  | 'BUTTONS' | 'FAQ' | 'NEWSLETTER' | 'CONTACT_FORM' | 'BOOKING_FORM'
  | 'SOCIAL_LINKS' | 'EMBED' | 'SERVICES' | 'INSTRUMENTS' | 'FEATURED_VIDEO';

type PageSection = {
  id: string;
  pageId: string;
  type: SectionType;
  order: number;
  isVisible: boolean;
  settings: any;
  content: any;
};

type Page = {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  isHomepage: boolean;
  updatedAt: Date;
  sections: PageSection[];
};

const sectionLabels: Record<SectionType, { label: string; desc: string; icon: string }> = {
  HERO: { label: 'Hero', desc: 'Large headline + image intro section', icon: '🖼️' },
  RICH_TEXT: { label: 'Rich Text', desc: 'Long-form editorial content', icon: '📝' },
  IMAGE: { label: 'Full Image', desc: 'Single large photograph', icon: '🌄' },
  IMAGE_TEXT: { label: 'Image + Text', desc: 'Two-column image & copy', icon: '🖼' },
  VIDEO: { label: 'Video Player', desc: 'Embedded or hosted video', icon: '🎬' },
  AUDIO: { label: 'Audio Player', desc: 'Embedded or hosted audio', icon: '🎵' },
  GALLERY: { label: 'Gallery', desc: 'Grid of images or videos', icon: '🖼️' },
  EVENTS: { label: 'Events List', desc: 'Upcoming performances', icon: '📅' },
  MUSIC: { label: 'Music / Discography', desc: 'Albums and tracks', icon: '🎶' },
  TESTIMONIALS: { label: 'Testimonials', desc: 'Audience & client quotes', icon: '💬' },
  QUOTE: { label: 'Pull Quote', desc: 'Large featured quote', icon: '❝' },
  CTA: { label: 'Call to Action', desc: 'Booking or CTA section', icon: '✨' },
  BUTTONS: { label: 'Buttons Row', desc: 'Multiple action buttons', icon: '🔘' },
  FAQ: { label: 'FAQ / Accordion', desc: 'Common questions list', icon: '❓' },
  NEWSLETTER: { label: 'Newsletter Signup', desc: 'Email capture block', icon: '📧' },
  CONTACT_FORM: { label: 'Contact Form', desc: 'Contact inquiry form', icon: '✉️' },
  BOOKING_FORM: { label: 'Booking Form', desc: 'Booking inquiry form', icon: '🎫' },
  SOCIAL_LINKS: { label: 'Social Links', desc: 'Social profile buttons', icon: '🔗' },
  EMBED: { label: 'Embed Code', desc: 'Custom HTML / iframe', icon: '⚙️' },
  SERVICES: { label: 'Services Grid', desc: 'Offered services cards', icon: '🎭' },
  INSTRUMENTS: { label: 'Instruments', desc: 'Musical instruments showcase', icon: '🪘' },
  FEATURED_VIDEO: { label: 'Featured Video', desc: 'Highlighted video section', icon: '🎥' },
};

type Props = {
  page: Page;
};

function formatContentPreview(content: any): string {
  if (content == null || content === '') return '';
  if (typeof content === 'string') return content;
  try {
    const c = content as Record<string, any>;
    const parts: string[] = [];
    if (c.heading) parts.push(String(c.heading));
    if (c.subheadline) parts.push(String(c.subheadline));
    if (c.description) parts.push(String(c.description));
    if (c.eyebrow) parts.push(String(c.eyebrow));
    if (Array.isArray(c.items)) parts.push(`${c.items.length} item(s)`);
    if (Array.isArray(c.body)) parts.push(String(c.body[0] || ''));
    const summary = parts.filter(Boolean).join(' — ');
    return summary || JSON.stringify(c).slice(0, 220);
  } catch {
    return JSON.stringify(content).slice(0, 220);
  }
}

function formatContentForEditor(content: any): string {
  if (content == null) return '';
  if (typeof content === 'string') return content;
  try {
    return JSON.stringify(content, null, 2);
  } catch {
    return String(content);
  }
}

export default function PageBuilder({ page: initialPage }: Props) {
  const [page, setPage] = useState<Page>(initialPage);
  const [showPalette, setShowPalette] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  const addSection = async (type: SectionType) => {
    const newOrder = sortedSections.length > 0
      ? Math.max(...sortedSections.map((s) => s.order)) + 1
      : 0;
    const newSection: PageSection = {
      id: Math.random().toString(36).slice(2),
      pageId: page.id,
      type,
      order: newOrder,
      isVisible: true,
      settings: {},
      content: null,
    };

    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.id,
          type,
          order: newOrder,
        }),
      });
      const data = await res.json();
      if (data.id) newSection.id = data.id;
    } catch (e) {}

    setPage((prev) => ({ ...prev, sections: [...prev.sections, newSection] }));
    setShowPalette(false);
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    const sorted = [...page.sections].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((s) => s.id === id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const newSections = [...page.sections].map((s) => {
      if (s.id === sorted[idx].id) return { ...s, order: sorted[swapIdx].order };
      if (s.id === sorted[swapIdx].id) return { ...s, order: sorted[idx].order };
      return s;
    });

    setPage((prev) => ({ ...prev, sections: newSections }));
  };

  const toggleVisible = (id: string) => {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      ),
    }));
  };

  const deleteSection = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    try {
      await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
    } catch (e) {}
    setPage((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== id) }));
  };

  const triggerSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 card-surface p-6">
        <div className="flex-1 min-w-[300px]">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <span className={`px-2 py-0.5 font-label text-[10px] rounded uppercase tracking-wider ${
              page.status === 'PUBLISHED'
                ? 'bg-earth-brown/10 text-earth-brown'
                : 'bg-surface-container-high text-on-surface-variant border border-earth-brown/20'
            }`}>
              {page.status}
            </span>
            {page.isHomepage && (
              <span className="px-2 py-0.5 bg-muted-ochre/10 text-muted-ochre font-label text-[10px] rounded uppercase tracking-wider">
                Homepage
              </span>
            )}
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
              /{page.isHomepage ? '' : page.slug}
            </span>
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            {page.title}
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-1">
            {sortedSections.length} section{sortedSections.length !== 1 ? 's' : ''} • Last updated {formatDateShort(page.updatedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          {saved && <span className="px-3 py-1.5 bg-earth-brown/10 text-earth-brown rounded font-label text-[10px] uppercase tracking-widest">✓ Saved</span>}
          <Link
            href={page.isHomepage ? '/' : `/${page.slug}`}
            target="_blank"
            onClick={triggerSave}
            className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            View Page
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            All Pages
          </Link>
          <button
            onClick={() => setShowPalette((v) => !v)}
            className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            + Add Section
          </button>
        </div>
      </div>

      {showPalette && (
        <div className="card-surface p-6 border-2 border-muted-ochre/20">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h3 className="font-headline text-headline-md text-on-surface">Add a section</h3>
            <button onClick={() => setShowPalette(false)} className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface">
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(Object.keys(sectionLabels) as SectionType[]).map((type) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className="text-left p-4 border border-earth-brown/15 hover:border-muted-ochre/50 hover:bg-surface-container/30 rounded-lg transition-all group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {sectionLabels[type].icon}
                </div>
                <div className="font-medium text-on-surface font-body text-body-md">
                  {sectionLabels[type].label}
                </div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  {sectionLabels[type].desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {sortedSections.length === 0 ? (
        <div className="card-surface p-16 text-center border-2 border-dashed border-earth-brown/20">
          <div className="font-headline text-headline-md text-on-surface mb-3">Blank canvas</div>
          <p className="font-body text-body-md text-on-surface-variant max-w-xl mx-auto mb-6">
            This page has no sections yet. Use <strong className="text-on-surface">+ Add Section</strong> above to build it out — stack HERO, IMAGE_TEXT, CTA, TESTIMONIALS or any block in any order.
          </p>
          <button
            onClick={() => setShowPalette(true)}
            className="px-6 py-3 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded"
          >
            + Add Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedSections.map((s, idx) => {
            const meta = sectionLabels[s.type];
            const isEditing = editingSectionId === s.id;
            return (
              <div
                key={s.id}
                className={`card-surface p-5 transition-all ${!s.isVisible ? 'opacity-50' : ''} ${
                  isEditing ? 'ring-2 ring-muted-ochre/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 text-on-surface-variant pt-1">
                    <button
                      onClick={() => moveSection(s.id, -1)}
                      disabled={idx === 0}
                      className="hover:text-muted-ochre disabled:opacity-30 disabled:cursor-not-allowed leading-none p-1"
                    >
                      ▲
                    </button>
                    <span className="font-label text-[9px] uppercase tracking-widest opacity-60">
                      #{idx + 1}
                    </span>
                    <button
                      onClick={() => moveSection(s.id, 1)}
                      disabled={idx === sortedSections.length - 1}
                      className="hover:text-muted-ochre disabled:opacity-30 disabled:cursor-not-allowed leading-none p-1"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-muted-ochre/10 border border-muted-ochre/20 flex items-center justify-center text-2xl flex-shrink-0">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-headline text-body-lg text-on-surface">{meta.label}</h4>
                      <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[9px] rounded uppercase tracking-wider">
                        {s.type}
                      </span>
                      {!s.isVisible && (
                        <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[9px] rounded uppercase tracking-wider">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="font-body text-body-sm text-on-surface-variant">{meta.desc}</p>
                    {s.content != null && s.content !== '' && (
                      <p className="font-body text-body-md text-on-surface mt-3 p-3 bg-surface-container/40 rounded line-clamp-3 whitespace-pre-wrap">
                        {formatContentPreview(s.content)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => toggleVisible(s.id)}
                      className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest"
                    >
                      {s.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => setEditingSectionId(isEditing ? null : s.id)}
                      className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest"
                    >
                      {isEditing ? 'Close' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteSection(s.id)}
                      className="text-error hover:opacity-80 font-label text-label-sm uppercase tracking-widest"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {isEditing && (
                  <SectionEditor
                    section={s}
                    onChange={(patch) =>
                      setPage((prev) => ({
                        ...prev,
                        sections: prev.sections.map((x) =>
                          x.id === s.id ? { ...x, ...patch } : x
                        ),
                      }))
                    }
                    onSave={triggerSave}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SectionEditor({
  section,
  onChange,
  onSave,
}: {
  section: PageSection;
  onChange: (patch: Partial<PageSection>) => void;
  onSave: () => void;
}) {
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    let content = (fd.get('content') as string) || '';
    const headline = fd.get('headline') as string;
    const subheadline = fd.get('subheadline') as string;
    const ctaText = fd.get('ctaText') as string;
    const ctaUrl = fd.get('ctaUrl') as string;

    // If the content is JSON text, parse it so the public renderer can use it
    const trimmed = content.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        content = JSON.parse(trimmed);
      } catch {
        /* keep as string */
      }
    }

    try {
      await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          settings: { headline, subheadline, ctaText, ctaUrl },
        }),
      });
    } catch (e) {}
    onSave();
  };

  return (
    <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-earth-brown/10 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Headline
          </label>
          <input
            name="headline"
            type="text"
            defaultValue={section.settings?.headline || ''}
            placeholder="Enter a headline for this section..."
            className="input-field font-headline text-headline-md tracking-tight"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Subheadline / Description
          </label>
          <textarea
            name="subheadline"
            rows={2}
            defaultValue={section.settings?.subheadline || ''}
            className="input-field resize-y"
            placeholder="Supporting copy..."
          />
        </div>
        <div className="md:col-span-2">
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            Content Body
          </label>
          <textarea
            name="content"
            rows={8}
            defaultValue={formatContentForEditor(section.content)}
            className="input-field resize-y font-mono text-sm"
            placeholder="Main rich-text content. For structured sections, paste JSON: {&quot;heading&quot;: ...}"
          />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            CTA Button Text
          </label>
          <input
            name="ctaText"
            type="text"
            defaultValue={section.settings?.ctaText || ''}
            placeholder="Book Now"
            className="input-field"
          />
        </div>
        <div>
          <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
            CTA Button URL
          </label>
          <input
            name="ctaUrl"
            type="text"
            defaultValue={section.settings?.ctaUrl || ''}
            placeholder="/book"
            className="input-field"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary !px-10">Save Section</button>
      </div>
    </form>
  );
}
