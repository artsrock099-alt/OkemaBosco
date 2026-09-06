import type { Metadata } from 'next';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import PublicFrame from '@/components/PublicFrame';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://boscookema.com'),
  title: {
    default: 'Bosco Okema — Ugandan Musician • Cultural Educator • Performer',
    template: '%s | Bosco Okema',
  },
  description:
    'Experience the music, stories and traditions of Uganda through live performance, cultural education and meaningful community experiences with Bosco Okema.',
  keywords: [
    'Bosco Okema',
    'Ugandan musician',
    'cultural educator',
    'traditional music Uganda',
    'Adungu',
    'African music performer',
    'school residency',
    'live performance Kampala',
  ],
  openGraph: {
    title: 'Bosco Okema — Ugandan Musician • Cultural Educator • Performer',
    description:
      'Experience the music, stories and traditions of Uganda through live performance, cultural education and meaningful community experiences.',
    url: 'https://boscookema.com',
    siteName: 'Bosco Okema',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bosco Okema — Ugandan Musician • Cultural Educator • Performer',
    description:
      'Experience the music, stories and traditions of Uganda through live performance and cultural education.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-on-background font-body text-body-md overflow-x-hidden selection:bg-muted-ochre selection:text-white">
        <PublicFrame header={<Header />} footer={<Footer />}>
          {children}
        </PublicFrame>
      </body>
    </html>
  );
}
