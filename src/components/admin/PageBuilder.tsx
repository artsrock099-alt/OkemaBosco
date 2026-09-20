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
  description?: string | null;
  updatedAt: Date;
  sections: PageSection[];
};

const sectionLabels: Record<SectionType, { label: string; desc: string; icon: string }> = {
  HERO: { label: 'Hero', desc: 'Headline over an image or video background', icon: '🖼️' },
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
    const summary = parts.filter(Boolean).join(' · ');
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
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    title: initialPage.title,
    slug: initialPage.slug,
    status: initialPage.status,
    description: initialPage.description || '',
    isHomepage: initialPage.isHomepage,
  });
  const [settingsError, setSettingsError] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

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

  const saveSettings = async (override?: Partial<typeof settings>) => {
    if (page.id === 'temp') {
      setSettingsError('Create the page first, then you can change its settings.');
      return;
    }
    const next = { ...settings, ...override };
    setSavingSettings(true);
    setSettingsError('');
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      const data = await res.json();
      if (!res.ok) {
        setSettingsError(data.message || 'Could not save the page settings.');
      } else {
        setSettings(next);
        setPage((prev) => ({ ...prev, ...next }));
        triggerSave();
      }
    } catch {
      setSettingsError('Could not save the page settings.');
    }
    setSavingSettings(false);
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
          <button
            onClick={() => saveSettings({ status: page.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' })}
            disabled={savingSettings}
            className={`px-4 py-2.5 font-label text-label-sm uppercase tracking-widest rounded transition-colors disabled:opacity-50 ${
              page.status === 'PUBLISHED'
                ? 'border border-earth-brown/20 text-on-surface-variant hover:text-on-surface'
                : 'bg-muted-ochre text-white hover:bg-earth-brown'
            }`}
          >
            {page.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="px-4 py-2.5 border border-earth-brown/20 text-on-surface-variant hover:text-on-surface hover:border-earth-brown/40 font-label text-label-sm uppercase tracking-widest rounded transition-colors"
          >
            Page settings
          </button>
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

      {showSettings && (
        <div className="card-surface p-6 border-2 border-muted-ochre/20">
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <h3 className="font-headline text-headline-md text-on-surface">Page settings</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
            >
              ✕ Close
            </button>
          </div>

          {settingsError && (
            <div className="p-3 mb-5 bg-error-container text-on-error-container rounded font-body text-body-md">
              {settingsError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Page title
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                URL slug
              </label>
              <input
                type="text"
                value={settings.slug}
                onChange={(e) => setSettings({ ...settings, slug: e.target.value })}
                className="input-field"
              />
              <p className="font-body text-body-sm text-on-surface-variant mt-2">
                Use the same slug as the built-in page (for example “about” or “media/photos”) so
                it replaces that page on the site.
              </p>
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Status
              </label>
              <select
                value={settings.status}
                onChange={(e) => setSettings({ ...settings, status: e.target.value as Page['status'] })}
                className="input-field appearance-none"
              >
                <option value="DRAFT">Draft (hidden from the public site)</option>
                <option value="PUBLISHED">Published (live on the site)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Short description
              </label>
              <input
                type="text"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input
                id="isHomepage"
                type="checkbox"
                checked={settings.isHomepage}
                onChange={(e) => setSettings({ ...settings, isHomepage: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isHomepage" className="font-body text-body-md text-on-surface">
                Use this page as the site homepage
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <button
              onClick={() => saveSettings()}
              disabled={savingSettings}
              className="btn-primary !px-10 disabled:opacity-50"
            >
              {savingSettings ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </div>
      )}

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
            This page has no sections yet. Use <strong className="text-on-surface">+ Add Section</strong> above to build it out. Stack HERO, IMAGE_TEXT, CTA, TESTIMONIALS or any block in any order.
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

// ---------- editable fields per section type ----------

type FieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'image'
  | 'video'
  | 'links'
  | 'paragraphs'
  | 'images'
  | 'faq'
  | 'services';

type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  hint?: string;
  rows?: number;
};

function field(key: string, label: string, kind: FieldKind = 'text', extra: Partial<FieldDef> = {}): FieldDef {
  return { key, label, kind, ...extra };
}

const sectionFields: Record<SectionType, FieldDef[]> = {
  HERO: [
    field('headline', 'Headline', 'text', { placeholder: 'BOSCO OKEMA' }),
    field('subheadline', 'Sub headline', 'text', { placeholder: 'Ugandan Musician, Cultural Educator, Performer' }),
    field('description', 'Intro paragraph', 'textarea', { rows: 3 }),
    field('image', 'Background image', 'image', { hint: 'Used on its own, or as the poster frame while a video loads.' }),
    field('imageAlt', 'Image description (alt text)', 'text'),
    field('videoUrl', 'Background video', 'video', {
      hint: 'Paste a YouTube or Vimeo link, or pick an uploaded video file. Leave empty to use the image. Use Clear to remove it.',
    }),
    field('overlay', 'Background darkness (0 to 100)', 'number', {
      placeholder: '50',
      hint: 'How much the image or video is dimmed behind the text. 50 keeps the default look.',
    }),
    field('buttons', 'Buttons (one per line: Label | /link)', 'links', { rows: 3, placeholder: 'BOOK BOSCO | /book' }),
  ],
  IMAGE_TEXT: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('body', 'Paragraphs (one per line)', 'paragraphs', { rows: 5 }),
    field('image', 'Image', 'image'),
    field('imageAlt', 'Image description (alt text)', 'text'),
    field('buttons', 'Buttons (one per line: Label | /link)', 'links', { rows: 3 }),
  ],
  RICH_TEXT: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('body', 'Paragraphs (one per line)', 'paragraphs', { rows: 6 }),
  ],
  SERVICES: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('items', 'Services (one per line: TITLE | Subtitle | Description | /link | image-url)', 'services', { rows: 6 }),
  ],
  INSTRUMENTS: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
  ],
  EVENTS: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('limit', 'How many events to show', 'number'),
  ],
  TESTIMONIALS: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('limit', 'How many testimonials to show', 'number'),
  ],
  FEATURED_VIDEO: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('videoUrl', 'Video', 'video', { hint: 'Paste a YouTube or Vimeo link, or choose an uploaded video file.' }),
    field('thumbnail', 'Poster image (used when no video is set)', 'image'),
    field('ctaLabel', 'Button label', 'text'),
    field('ctaHref', 'Button link', 'text', { placeholder: '/listen' }),
  ],
  VIDEO: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('videoUrl', 'Video', 'video', { hint: 'Paste a YouTube or Vimeo link, or choose an uploaded video file.' }),
    field('title', 'Caption title', 'text'),
    field('description', 'Caption text', 'textarea', { rows: 2 }),
  ],
  AUDIO: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('audioUrl', 'Audio file URL', 'text', { placeholder: '/uploads/track.mp3' }),
    field('title', 'Track title', 'text'),
  ],
  GALLERY: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('images', 'Images (one URL per line)', 'images', { rows: 5, hint: 'Use the media library to upload photos, then paste or pick each URL.' }),
  ],
  MUSIC: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('limit', 'How many tracks to show', 'number'),
  ],
  QUOTE: [
    field('quote', 'Quote', 'textarea', { rows: 3 }),
    field('attribution', 'Attributed to', 'text'),
    field('role', 'Role / context', 'text'),
  ],
  CTA: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('headline', 'Headline', 'textarea', { rows: 2 }),
    field('buttons', 'Buttons (one per line: Label | /link)', 'links', { rows: 3 }),
  ],
  BUTTONS: [
    field('buttons', 'Buttons (one per line: Label | /link)', 'links', { rows: 4 }),
  ],
  FAQ: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('items', 'Questions (one per line: Question | Answer)', 'faq', { rows: 6 }),
  ],
  NEWSLETTER: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
    field('description', 'Supporting text', 'textarea', { rows: 2 }),
  ],
  CONTACT_FORM: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
  ],
  BOOKING_FORM: [
    field('eyebrow', 'Small label above heading', 'text'),
    field('heading', 'Heading', 'text'),
  ],
  SOCIAL_LINKS: [],
  EMBED: [
    field('html', 'Embed code (HTML or iframe)', 'textarea', { rows: 6 }),
  ],
  IMAGE: [
    field('image', 'Image', 'image'),
    field('imageAlt', 'Image description (alt text)', 'text'),
    field('caption', 'Caption', 'text'),
  ],
};

function linesFrom(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function fieldToFormValue(f: FieldDef, content: any): string {
  const v = content?.[f.key];
  switch (f.kind) {
    case 'links':
      return (Array.isArray(v) ? v : []).map((b: any) => `${b?.label || ''} | ${b?.href || ''}`).join('\n');
    case 'paragraphs':
      return (Array.isArray(v) ? v : v ? [v] : []).join('\n');
    case 'images':
      return (Array.isArray(v) ? v : []).map((i: any) => (typeof i === 'string' ? i : i?.url || '')).join('\n');
    case 'faq':
      return (Array.isArray(v) ? v : []).map((i: any) => `${i?.question || ''} | ${i?.answer || ''}`).join('\n');
    case 'services':
      return (Array.isArray(v) ? v : [])
        .map((i: any) => [i?.title, i?.subtitle, i?.description, i?.href, i?.image].filter(Boolean).join(' | '))
        .join('\n');
    case 'number':
      return v == null ? '' : String(v);
    default:
      return v == null ? '' : String(v);
  }
}

function formValueToField(f: FieldDef, raw: string): any {
  const value = (raw || '').trim();
  switch (f.kind) {
    case 'links':
      return linesFrom(raw).map((line) => {
        const [label, href] = line.split('|').map((p) => p.trim());
        return { label, href: href || '#' };
      });
    case 'paragraphs':
      return linesFrom(raw);
    case 'images':
      return linesFrom(raw);
    case 'faq':
      return linesFrom(raw).map((line) => {
        const [question, ...rest] = line.split('|');
        return { question: (question || '').trim(), answer: rest.join('|').trim() };
      });
    case 'services':
      return linesFrom(raw).map((line) => {
        const [title, subtitle, description, href, image] = line.split('|').map((p) => p.trim());
        return { title, subtitle, description, href, image };
      });
    case 'number':
      return value === '' ? undefined : Number(value);
    default:
      return raw;
  }
}

// ---------- media library picker ----------

function MediaPicker({
  value,
  onChange,
  accept = 'image',
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'video' | 'all';
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      const all: any[] = data.media || [];
      setItems(
        accept === 'all'
          ? all
          : all.filter((m) => m.type === (accept === 'image' ? 'IMAGE' : 'VIDEO'))
      );
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/OKema/pic5.png or https://..."
        className="input-field"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            load();
          }}
          className="px-3 py-1.5 border border-earth-brown/20 hover:border-earth-brown/50 font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface rounded transition-colors"
        >
          Choose from library
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-error"
          >
            Clear
          </button>
        )}
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
      </div>

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

function SectionEditor({
  section,
  onChange,
  onSave,
}: {
  section: PageSection;
  onChange: (patch: Partial<PageSection>) => void;
  onSave: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of sectionFields[section.type] || []) {
      initial[f.key] = fieldToFormValue(f, section.content);
    }
    return initial;
  });
  const [showRaw, setShowRaw] = useState(false);
  const [raw, setRaw] = useState(() => formatContentForEditor(section.content));
  const [saving, setSaving] = useState(false);

  const setValue = (key: string, value: string) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fields = sectionFields[section.type] || [];
    const content: Record<string, any> = { ...(section.content || {}) };
    for (const f of fields) {
      content[f.key] = formValueToField(f, values[f.key] || '');
    }

    // Power users can still edit the raw JSON for section types we do not cover yet.
    if (showRaw) {
      const trimmed = raw.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          Object.assign(content, JSON.parse(trimmed));
        } catch {
          /* ignore invalid JSON, keep the field values */
        }
      }
    }

    const next = { content };
    try {
      await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next),
      });
      onChange(next);
    } catch (e) {
      /* keep local state */
    }
    setSaving(false);
    onSave();
  };

  const fields = sectionFields[section.type] || [];

  return (
    <form onSubmit={handleSave} className="mt-6 pt-5 border-t border-earth-brown/10 space-y-5">
      {fields.length === 0 ? (
        <p className="font-body text-body-md text-on-surface-variant">
          This section has no editable text. It pulls its content from the relevant database
          records, which you can manage from the matching admin page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {fields.map((f) => {
            const value = values[f.key] || '';
            const wide = f.kind !== 'number' && f.kind !== 'text';
            return (
              <div key={f.key} className={wide ? 'md:col-span-2' : ''}>
                <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                  {f.label}
                </label>

                {f.kind === 'image' ? (
                  <MediaPicker
                    value={value}
                    onChange={(url) => setValue(f.key, url)}
                    accept="image"
                    label="jpg, png or webp"
                  />
                ) : f.kind === 'video' ? (
                  <MediaPicker
                    value={value}
                    onChange={(url) => setValue(f.key, url)}
                    accept="all"
                    label="YouTube, Vimeo or an uploaded video"
                  />
                ) : f.kind === 'text' ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="input-field"
                  />
                ) : f.kind === 'number' ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="input-field"
                  />
                ) : (
                  <textarea
                    value={value}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    rows={f.rows || 4}
                    placeholder={f.placeholder}
                    className="input-field resize-y"
                  />
                )}

                {f.hint && (
                  <p className="font-body text-body-sm text-on-surface-variant mt-2">{f.hint}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowRaw((v) => !v)}
          className="font-label text-label-sm uppercase tracking-widest text-on-surface-variant hover:text-on-surface"
        >
          {showRaw ? 'Hide raw content' : 'Advanced: raw content'}
        </button>
        {showRaw && (
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            className="input-field resize-y font-mono text-sm mt-3"
            placeholder='{"heading": "..."}'
          />
        )}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-primary !px-10 disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Section'}
        </button>
      </div>
    </form>
  );
}
