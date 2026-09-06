'use client';

import { useState } from 'react';

type GlobalSEO = {
  id: string;
  siteName: string;
  tagline?: string | null;
  defaultSeoTitle?: string | null;
  defaultSeoDescription?: string | null;
  defaultKeywords?: string[];
  defaultOgImage?: string | null;
  twitterHandle?: string | null;
  facebookPageId?: string | null;
  googleAnalyticsId?: string | null;
  defaultNoIndex: boolean;
  defaultNoFollow: boolean;
  baseUrl?: string | null;
};

type Props = {
  settings: GlobalSEO;
  mediaItems: { id: string; title: string; url: string }[];
};

export default function SEOManager({ settings: initialSettings, mediaItems }: Props) {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<GlobalSEO>(initialSettings);
  const [keywordsInput, setKeywordsInput] = useState(
    (initialSettings.defaultKeywords || []).join(', ')
  );

  const handleChange = (field: keyof GlobalSEO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/admin/seo/global', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, defaultKeywords: keywords }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const tabs = [
    { key: 'global', label: 'Global Defaults' },
    { key: 'social', label: 'Social Media' },
    { key: 'advanced', label: 'Advanced' },
  ];
  const [activeTab, setActiveTab] = useState<'global' | 'social' | 'advanced'>('global');

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="font-body text-body-md text-on-surface-variant max-w-2xl">
          Configure global SEO defaults for the site. Defaults are inherited by pages, events and articles when no explicit SEO metadata is set.
        </p>
        {saved && (
          <div className="px-4 py-2 bg-earth-brown/10 text-earth-brown rounded font-label text-label-sm uppercase tracking-widest">
            ✓ Saved
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 border-b border-earth-brown/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            className={`px-4 py-2 font-label text-label-sm uppercase tracking-widest transition-colors ${
              activeTab === t.key
                ? 'text-muted-ochre border-b-2 border-muted-ochre -mb-[2px]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'global' && (
        <div className="space-y-6 card-surface p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Tagline / Default Title Suffix
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Ugandan Musician • Cultural Educator • Performer"
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default Page Title
              </label>
              <input
                type="text"
                value={formData.defaultSeoTitle || ''}
                onChange={(e) => handleChange('defaultSeoTitle', e.target.value)}
                placeholder="Bosco Okema | Ugandan Musician • Cultural Educator"
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.defaultSeoDescription || ''}
                onChange={(e) => handleChange('defaultSeoDescription', e.target.value)}
                className="input-field resize-y"
                placeholder="Award-winning Ugandan musician and cultural educator Bosco Okema. Traditional and contemporary performances, school residencies and community workshops."
              />
              <div className="mt-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                {(formData.defaultSeoDescription || '').length} / 160 characters recommended
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="Ugandan music, African musician, traditional music, cultural education, school residency"
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Canonical Base URL
              </label>
              <input
                type="url"
                value={formData.baseUrl || ''}
                onChange={(e) => handleChange('baseUrl', e.target.value)}
                placeholder="https://www.boscookema.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default OG / Social Image
              </label>
              <select
                value={formData.defaultOgImage || ''}
                onChange={(e) => handleChange('defaultOgImage', e.target.value)}
                className="input-field"
              >
                <option value="">— Use first image on page —</option>
                {mediaItems.map((m) => (
                  <option key={m.id} value={m.url}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6 card-surface p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Twitter Handle (X)
              </label>
              <input
                type="text"
                value={formData.twitterHandle || ''}
                onChange={(e) => handleChange('twitterHandle', e.target.value)}
                placeholder="@boscookema"
                className="input-field"
              />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Facebook Page ID
              </label>
              <input
                type="text"
                value={formData.facebookPageId || ''}
                onChange={(e) => handleChange('facebookPageId', e.target.value)}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Google Analytics Measurement ID
              </label>
              <input
                type="text"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="input-field"
              />
              <div className="mt-2 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Injected on all public pages when set.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-6 card-surface p-6">
          <div className="flex flex-wrap gap-8">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.defaultNoIndex}
                onChange={(e) => handleChange('defaultNoIndex', e.target.checked)}
                className="w-4 h-4 mt-1 accent-earth-brown"
              />
              <div>
                <span className="font-body text-body-md text-on-surface">noindex by default</span>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Tell search engines not to index pages unless explicitly enabled on that page.
                </div>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.defaultNoFollow}
                onChange={(e) => handleChange('defaultNoFollow', e.target.checked)}
                className="w-4 h-4 mt-1 accent-earth-brown"
              />
              <div>
                <span className="font-body text-body-md text-on-surface">nofollow by default</span>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">
                  Tell search engines not to follow links unless explicitly enabled on that page.
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-3">
        <button type="submit" className="btn-primary !px-10">Save SEO Settings</button>
      </div>
    </form>
  );
}
