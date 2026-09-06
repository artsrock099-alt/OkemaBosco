'use client';

import Link from 'next/link';
import { useFormState } from 'react-dom';
import { useState } from 'react';
import { updateSiteSettings, createSocialLink, deleteSocialLink, updateSocialLink, type FormState } from '@/lib/actions';

type Settings = {
  id: string;
  siteName: string;
  tagline?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactLocation?: string | null;
  footerText?: string | null;
  copyrightText: string;
  privacyPolicyUrl?: string | null;
  termsUrl?: string | null;
  newsletterEnabled: boolean;
  footerVisible: boolean;
};

type SocialLinkItem = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label?: string | null;
  order: number;
  isVisible: boolean;
};

type Props = {
  settings: Settings;
  socials: SocialLinkItem[];
  mediaItems: { id: string; title: string }[];
};

export default function SettingsForm({ settings, socials, mediaItems }: Props) {
  const [settingsState, settingsAction, settingsPending] = useFormState(updateSiteSettings, {} as FormState);
  const [socialCreateState, socialCreateAction] = useFormState(createSocialLink, {} as FormState);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'media'>('general');

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('Delete this social link?')) return;
    await deleteSocialLink(id);
    window.location.reload();
  };

  const tabs = [
    { key: 'general', label: 'General Settings' },
    { key: 'social', label: `Social Links (${socials.length})` },
    { key: 'media', label: 'Media Defaults' },
  ] as const;

  return (
    <div className="max-w-4xl space-y-8">
      {settingsState?.success && (
        <div className="p-4 bg-earth-brown/10 text-earth-brown rounded font-body text-body-md">
          ✓ Settings saved successfully.
        </div>
      )}
      {settingsState?.error && (
        <div className="p-4 bg-error-container text-on-error-container rounded font-body text-body-md">
          {settingsState.message || settingsState.error}
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-earth-brown/10 pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
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

      {activeTab === 'general' && (
        <form action={settingsAction} className="space-y-6">
          <input type="hidden" name="id" value={settings.id || 'default'} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Site Name
              </label>
              <input name="siteName" type="text" defaultValue={settings.siteName} className="input-field" required />
            </div>
            <div>
              <label className="block font-label text-label-sm uppercase tracking-widest text-on-surface-variant mb-2">
                Tagline
              </label>
              <input name="tagline" type="text" defaultValue={settings.tagline || undefined} className="input-field" />
            </div>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Contact Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Email
                </label>
                <input name="contactEmail" type="email" defaultValue={settings.contactEmail || undefined} className="input-field" />
              </div>
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Phone
                </label>
                <input name="contactPhone" type="tel" defaultValue={settings.contactPhone || undefined} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Location
                </label>
                <input name="contactLocation" type="text" defaultValue={settings.contactLocation || undefined} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card-surface p-6 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
              Footer & Legal
            </div>
            <div>
              <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                Footer Text
              </label>
              <textarea
                name="footerText"
                rows={3}
                defaultValue={settings.footerText || undefined}
                className="input-field resize-none"
                placeholder="Brief footer description / tagline"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Copyright Notice
                </label>
                <input
                  name="copyrightText"
                  type="text"
                  defaultValue={settings.copyrightText}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Privacy Policy URL
                </label>
                <input name="privacyPolicyUrl" type="text" defaultValue={settings.privacyPolicyUrl || undefined} className="input-field" />
              </div>
              <div>
                <label className="block font-label text-label-sm text-on-surface-variant mb-2">
                  Terms URL
                </label>
                <input name="termsUrl" type="text" defaultValue={settings.termsUrl || undefined} className="input-field" />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  name="newsletterEnabled"
                  type="checkbox"
                  defaultChecked={settings.newsletterEnabled}
                  className="w-4 h-4 accent-earth-brown"
                />
                <span className="font-body text-body-md text-on-surface">Newsletter Subscribe enabled</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  name="footerVisible"
                  type="checkbox"
                  defaultChecked={settings.footerVisible}
                  className="w-4 h-4 accent-earth-brown"
                />
                <span className="font-body text-body-md text-on-surface">Footer visible</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-earth-brown/10">
            <button
              type="submit"
              disabled={settingsPending}
              className="btn-primary disabled:opacity-50 !px-10"
            >
              {settingsPending ? 'SAVING...' : 'Save Settings'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6">
          <form action={socialCreateAction} className="card-surface p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                Add Social Link
              </div>
              {socialCreateState?.success && (
                <span className="font-label text-label-sm text-earth-brown">✓ Added</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-label text-sm text-on-surface-variant mb-1">Platform</label>
                <input name="platform" type="text" required placeholder="Instagram" className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label text-sm text-on-surface-variant mb-1">URL</label>
                <input name="url" type="url" required placeholder="https://..." className="input-field" />
              </div>
              <div>
                <label className="block font-label text-sm text-on-surface-variant mb-1">Icon key</label>
                <input name="icon" type="text" placeholder="instagram" className="input-field" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-primary !py-2 !px-6">
                + Add
              </button>
            </div>
          </form>

          <div className="card-surface overflow-hidden">
            <table className="w-full text-left font-body text-body-md min-w-[500px]">
              <thead className="font-label text-label-sm text-on-surface-variant bg-surface-container/50 border-b border-earth-brown/10">
                <tr>
                  <th className="py-3 px-6 font-normal">Platform</th>
                  <th className="py-3 px-6 font-normal">URL</th>
                  <th className="py-3 px-6 font-normal">Order</th>
                  <th className="py-3 px-6 font-normal">Visible</th>
                  <th className="py-3 px-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-earth-brown/10">
                {socials.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-on-surface-variant">
                      No social links yet. Add your first one above.
                    </td>
                  </tr>
                ) : (
                  socials.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container/30">
                      <td className="py-3 px-6 font-medium text-on-surface">{s.platform}</td>
                      <td className="py-3 px-6 text-on-surface-variant truncate max-w-md">
                        <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-muted-ochre">
                          {s.url}
                        </a>
                      </td>
                      <td className="py-3 px-6 text-on-surface-variant">{s.order}</td>
                      <td className="py-3 px-6">
                        <span
                          className={`font-label text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
                            s.isVisible
                              ? 'bg-earth-brown/10 text-earth-brown'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {s.isVisible ? 'ON' : 'OFF'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <button
                          onClick={() => handleDeleteSocial(s.id)}
                          className="font-label text-label-sm uppercase tracking-widest text-error hover:opacity-80"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <form action={settingsAction} className="space-y-6">
          <input type="hidden" name="id" value={settings.id || 'default'} />
          <div className="card-surface p-6 space-y-4">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
              Default Media (IDs from Media Library)
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-label text-sm text-on-surface-variant mb-2">
                  Default Hero Image ID
                </label>
                <input
                  name="defaultHeroImageId"
                  type="text"
                  className="input-field"
                  placeholder="Media Library ID"
                  list="media-defaults"
                />
              </div>
              <div>
                <label className="block font-label text-sm text-on-surface-variant mb-2">
                  Logo Image ID
                </label>
                <input
                  name="logoImageId"
                  type="text"
                  className="input-field"
                  placeholder="Media Library ID"
                  list="media-defaults"
                />
              </div>
              <div>
                <label className="block font-label text-sm text-on-surface-variant mb-2">
                  Favicon ID
                </label>
                <input
                  name="faviconId"
                  type="text"
                  className="input-field"
                  placeholder="Media Library ID"
                  list="media-defaults"
                />
              </div>
              <datalist id="media-defaults">
                {mediaItems.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </datalist>
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={settingsPending} className="btn-primary disabled:opacity-50 !px-10">
              {settingsPending ? 'SAVING...' : 'Save Media Settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
