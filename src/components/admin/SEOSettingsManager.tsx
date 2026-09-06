'use client';

import { useState } from 'react';

type SEOData = {
  defaultTitle: string;
  defaultDescription: string;
  defaultKeywords: string;
  ogImage: string;
  twitterHandle: string;
  siteUrl: string;
  enableOpenGraph: boolean;
  enableTwitterCards: boolean;
  enableStructuredData: boolean;
  robotsText: string;
};

export default function SEOSettingsManager({ initial }: { initial: SEOData }) {
  const [data, setData] = useState<SEOData>(initial);
  const [tab, setTab] = useState<'general' | 'social' | 'robots'>('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  };

  const updateField = (key: keyof SEOData, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { key: 'general' as const, label: 'General SEO' },
    { key: 'social' as const, label: 'Social Media' },
    { key: 'robots' as const, label: 'Robots & Advanced' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2 border-b border-earth-brown/10 pb-2 flex-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 font-label text-label-sm uppercase tracking-widest transition-colors ${
                tab === t.key
                  ? 'text-muted-ochre border-b-2 border-muted-ochre -mb-[2px]'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="font-label text-label-sm text-earth-brown uppercase tracking-widest">
              ✓ Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {tab === 'general' && (
        <div className="card-surface p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-headline text-headline-md text-on-surface mb-2">Meta Tags Defaults</h2>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              These are used as fallbacks across the site when a page or article does not define its own SEO data.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default Site Title
              </label>
              <input
                type="text"
                value={data.defaultTitle}
                onChange={(e) => updateField('defaultTitle', e.target.value)}
                className="input-field"
                placeholder="Bosco Okema | Ugandan Musician • Cultural Educator • Performer"
              />
              <p className="font-label text-[11px] text-on-surface-variant mt-2 uppercase tracking-widest">
                Used in <code className="text-muted-ochre">&lt;title&gt;</code> tag
              </p>
            </div>

            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={data.defaultDescription}
                onChange={(e) => updateField('defaultDescription', e.target.value)}
                className="input-field resize-y"
                placeholder="Ugandan musician, cultural educator and performer. Experience authentic African music, storytelling and educational programs."
              />
              <p className="font-label text-[11px] text-on-surface-variant mt-2 uppercase tracking-widest">
                {data.defaultDescription.length}/160 characters recommended
              </p>
            </div>

            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Keywords (comma separated)
              </label>
              <input
                type="text"
                value={data.defaultKeywords}
                onChange={(e) => updateField('defaultKeywords', e.target.value)}
                className="input-field"
                placeholder="Ugandan music, African musician, cultural educator, traditional music, Adungu, storytelling"
              />
            </div>

            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Default OG Image URL
              </label>
              <input
                type="url"
                value={data.ogImage}
                onChange={(e) => updateField('ogImage', e.target.value)}
                className="input-field"
                placeholder="https://.../og-default.jpg"
              />
              {data.ogImage && (
                <div className="mt-3 p-3 bg-surface-container rounded overflow-hidden">
                  <img
                    src={data.ogImage}
                    alt="OG Preview"
                    className="w-full max-h-40 object-cover rounded border border-earth-brown/10"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={data.siteUrl}
                onChange={(e) => updateField('siteUrl', e.target.value)}
                className="input-field"
                placeholder="https://www.boscookema.com"
              />
            </div>

            <div className="pt-4 space-y-4 border-t border-earth-brown/10">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.enableOpenGraph}
                  onChange={(e) => updateField('enableOpenGraph', e.target.checked)}
                  className="w-4 h-4 accent-earth-brown mt-1"
                />
                <div>
                  <div className="font-body text-body-md text-on-surface">Enable Open Graph tags</div>
                  <div className="font-label text-label-sm text-on-surface-variant mt-0.5">
                    Facebook, LinkedIn, WhatsApp, iMessage rich link previews
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.enableTwitterCards}
                  onChange={(e) => updateField('enableTwitterCards', e.target.checked)}
                  className="w-4 h-4 accent-earth-brown mt-1"
                />
                <div>
                  <div className="font-body text-body-md text-on-surface">Enable Twitter Cards</div>
                  <div className="font-label text-label-sm text-on-surface-variant mt-0.5">
                    X / Twitter link preview format
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.enableStructuredData}
                  onChange={(e) => updateField('enableStructuredData', e.target.checked)}
                  className="w-4 h-4 accent-earth-brown mt-1"
                />
                <div>
                  <div className="font-body text-body-md text-on-surface">Enable JSON-LD Structured Data</div>
                  <div className="font-label text-label-sm text-on-surface-variant mt-0.5">
                    Schema.org Person, Event, Article and MusicGroup rich snippets
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {tab === 'social' && (
        <div className="card-surface p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-headline text-headline-md text-on-surface mb-2">Social Media Identity</h2>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              Linked to structured data and used to attribute content across social platforms.
            </p>
          </div>

          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              X / Twitter Handle
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-surface-container border border-r-0 border-earth-brown/20 rounded-l font-label text-label-sm text-on-surface-variant">
                @
              </span>
              <input
                type="text"
                value={data.twitterHandle.replace('@', '')}
                onChange={(e) => updateField('twitterHandle', e.target.value)}
                className="input-field !rounded-l-none"
                placeholder="boscookema"
              />
            </div>
          </div>

          <div className="p-5 bg-surface-container rounded space-y-3">
            <div className="font-headline text-headline-sm text-on-surface mb-2">Live Sitemap Preview</div>
            <p className="font-body text-body-md text-on-surface-variant">
              Your sitemap is automatically generated at{' '}
              <code className="text-muted-ochre font-mono">/sitemap.xml</code>
              {' '}and includes all published pages, events, articles and media.
            </p>
            <p className="font-body text-body-md text-on-surface-variant">
              Submit this URL to Google Search Console, Bing Webmaster Tools and other search engines.
            </p>
          </div>
        </div>
      )}

      {tab === 'robots' && (
        <div className="card-surface p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-headline text-headline-md text-on-surface mb-2">Robots.txt &amp; Crawling</h2>
            <p className="font-body text-body-md text-on-surface-variant mb-6">
              Control how search engines crawl your site. Served at{' '}
              <code className="text-muted-ochre font-mono">/robots.txt</code>
              .
            </p>
          </div>

          <div>
            <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
              robots.txt content
            </label>
            <textarea
              rows={12}
              value={data.robotsText}
              onChange={(e) => updateField('robotsText', e.target.value)}
              className="input-field font-mono text-sm resize-y"
            />
          </div>
        </div>
      )}
    </div>
  );
}
