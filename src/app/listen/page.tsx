import type { Metadata } from 'next';
import { MusicCard } from '@/components/public/MusicCard';
import { getMusic } from '@/lib/queries';
import SectionRenderer from '@/components/public/SectionRenderer';
import HeroMedia from '@/components/public/HeroMedia';
import { getCmsSections } from '@/lib/cms';
import { getSiteImages } from '@/lib/site-images';

export const metadata: Metadata = {
  title: 'Listen',
  description:
    'Listen to Bosco Okema: featured music, live recordings, studio tracks, and streams on Spotify, YouTube, Apple Music and SoundCloud.',
};

const videoTiles = [
  {
    key: 'listen-video-1',
    venue: 'Live at National Theatre',
    title: 'Adungu Solo Live',
    fallbackImage: '/OKema/liveperformance2.JPG',
  },
  {
    key: 'listen-video-2',
    venue: 'Kampala Arts Festival',
    title: 'Sounds of Uganda Ensemble',
    fallbackImage: '/OKema/liveperformance1.JPG',
  },
];

const platforms = [
  { name: 'Spotify', href: '#', color: 'bg-[#1DB954]' },
  { name: 'YouTube', href: '#', color: 'bg-[#FF0000]' },
  { name: 'Apple Music', href: '#', color: 'bg-gradient-to-br from-[#FA2D48] to-[#FB5C74]' },
  { name: 'SoundCloud', href: '#', color: 'bg-[#FF5500]' },
];

export default async function ListenPage() {
  const cmsSections = await getCmsSections('listen');
  if (cmsSections) return <SectionRenderer sections={cmsSections} />;

  const allMusic = await getMusic(false, 12);
  const featured = allMusic.filter((m) => m.isFeatured).slice(0, 3);
  const live = allMusic.filter((m) => m.isLive).slice(0, 3);
  const images = await getSiteImages();

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-deep-charcoal text-warm-ivory overflow-hidden">
        <HeroMedia slug="listen" gradient="from-deep-charcoal via-deep-charcoal/50 to-deep-charcoal/25" />
        <div className="relative z-10 container-x text-center">
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
          
          </div>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-warm-ivory tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            The sounds of Uganda, wherever you are.
          </h1>
          <p className="font-body text-body-md md:text-body-lg text-surface-variant max-w-2xl mx-auto mb-10">
            Studio recordings, live performances and exclusive releases. Listen here, or stream on
            your favorite platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-label text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity ${p.color}`}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MUSIC */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-earth-brown/20 pb-4">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                FEATURED MUSIC
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                New & Notable
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(featured.length > 0 ? featured : allMusic.slice(0, 3)).map((m) => (
              <MusicCard key={m.id} music={m} />
            ))}
          </div>
        </div>
      </section>

      {/* LIVE RECORDINGS */}
      <section className="section-y bg-surface-container">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-earth-brown/20 pb-4">
            <div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                LIVE RECORDINGS
              </div>
              <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Captured on stage.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(live.length > 0 ? live : allMusic.slice(3, 6)).map((m) => (
              <MusicCard key={m.id} music={m} />
            ))}
          </div>
        </div>
      </section>

      {/* FULL DISCOGRAPHY */}
      {allMusic.length > 6 && (
        <section className="section-y">
          <div className="container-x">
            <div className="flex items-end justify-between mb-10 md:mb-14 border-b border-earth-brown/20 pb-4">
              <div>
                <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-2">
                  FULL CATALOG
                </div>
                <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                  All releases
                </h2>
              </div>
              <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre">
                {allMusic.length} tracks
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allMusic.slice(6).map((m) => (
                <MusicCard key={m.id} music={m} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEOS */}
      <section className="section-y bg-deep-charcoal text-warm-ivory">
        <div className="container-x">
          <div className="text-center mb-12 md:mb-16">
            <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-4">
              VIDEOS
            </div>
            <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-warm-ivory tracking-tight">
              Watch the performances.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-2xl mx-auto">
            {videoTiles.map((tile) => (
              <div
                key={tile.key}
                className="group relative aspect-[2/3] bg-surface-container-high overflow-hidden cursor-pointer"
              >
                <img
                  src={images[tile.key].url || tile.fallbackImage}
                  alt={images[tile.key].alt || tile.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-warm-ivory/90 text-deep-charcoal flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-muted-ochre group-hover:text-white">
                    <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-deep-charcoal to-transparent">
                  <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-1">
                    {tile.venue}
                  </div>
                  <h3 className="font-headline text-headline-md text-warm-ivory">{tile.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STREAM CTA */}
      <section className="section-y">
        <div className="container-x text-center">
          <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-6 max-w-2xl mx-auto">
            Stream Bosco on your favorite platform.
          </h2>
          <p className="font-body text-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto">
            Follow to stay up to date with every new release, exclusive performance and upcoming
            show.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-label text-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity ${p.color}`}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
