import { prisma } from '@/lib/db';
import TaxonomyManager from '@/components/admin/TaxonomyManager';

export const metadata = { title: 'Music Platforms' };

export default async function AdminPlatformsPage() {
  const platforms = await prisma.musicPlatform.findMany({
    orderBy: { name: 'asc' },
  });

  const items = platforms.length > 0
    ? platforms.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    : [
        { id: '1', name: 'Spotify', slug: 'spotify', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'Apple Music', slug: 'apple-music', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', name: 'YouTube Music', slug: 'youtube-music', createdAt: new Date(), updatedAt: new Date() },
        { id: '4', name: 'Bandcamp', slug: 'bandcamp', createdAt: new Date(), updatedAt: new Date() },
        { id: '5', name: 'SoundCloud', slug: 'soundcloud', createdAt: new Date(), updatedAt: new Date() },
        { id: '6', name: 'Tidal', slug: 'tidal', createdAt: new Date(), updatedAt: new Date() },
      ];

  return (
    <div className="space-y-6">
      <div>
        <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
          Music • Platforms
        </div>
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
          Streaming Platforms
        </h1>
      </div>
      <TaxonomyManager
        resourceLabel={{ singular: 'Platform', plural: 'Platforms', icon: '🎧' }}
        endpoint="platforms"
        initialItems={items as any}
        description="Supported streaming services and social audio platforms. Tracks can have external streaming URLs mapped per platform."
        extraFields={[{ name: 'color', label: 'Brand Color', type: 'color' }, { name: 'icon', label: 'Icon (emoji/text)', type: 'text' }]}
      />
    </div>
  );
}
