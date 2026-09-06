'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  BrickWall,
  Menu as MenuIcon,
  Navigation,
  Settings,
  CalendarDays,
  Tag,
  GraduationCap,
  Music,
  Disc,
  Share2,
  FolderOpen,
  Image as ImageIcon,
  Video,
  Music2,
  FileArchive,
  Newspaper,
  BookText,
  CalendarClock,
  CreditCard,
  Receipt,
  MessageSquare,
  Users2,
  Mail,
  Megaphone,
  ShieldAlert,
  LogOut,
  X,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

type NavGroup = {
  label: string;
  items: { label: string; href: string; icon: React.ReactNode }[];
};

const navGroups: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    ],
  },
  {
    label: 'WEBSITE',
    items: [
      { label: 'Pages', href: '/admin/pages', icon: <FileText className="w-5 h-5" /> },
      { label: 'Page Builder', href: '/admin/builder', icon: <BrickWall className="w-5 h-5" /> },
      { label: 'Navigation', href: '/admin/navigation', icon: <Navigation className="w-5 h-5" /> },
      { label: 'Site Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ],
  },
  {
    label: 'EVENTS',
    items: [
      { label: 'Events', href: '/admin/events', icon: <CalendarDays className="w-5 h-5" /> },
      { label: 'Categories', href: '/admin/events/categories', icon: <Tag className="w-5 h-5" /> },
    ],
  },
  {
    label: 'EDUCATION',
    items: [
      { label: 'Programs', href: '/admin/education', icon: <GraduationCap className="w-5 h-5" /> },
    ],
  },
  {
    label: 'MUSIC',
    items: [
      { label: 'Music', href: '/admin/music', icon: <Music className="w-5 h-5" /> },
      { label: 'Albums', href: '/admin/albums', icon: <Disc className="w-5 h-5" /> },
      { label: 'Platforms', href: '/admin/platforms', icon: <Share2 className="w-5 h-5" /> },
    ],
  },
  {
    label: 'MEDIA',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: <FolderOpen className="w-5 h-5" /> },
      { label: 'Photos', href: '/admin/media/photos', icon: <ImageIcon className="w-5 h-5" /> },
      { label: 'Videos', href: '/admin/media/videos', icon: <Video className="w-5 h-5" /> },
      { label: 'Audio', href: '/admin/media/audio', icon: <Music2 className="w-5 h-5" /> },
      { label: 'Documents', href: '/admin/media/documents', icon: <FileArchive className="w-5 h-5" /> },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { label: 'Articles', href: '/admin/articles', icon: <Newspaper className="w-5 h-5" /> },
      { label: 'Categories', href: '/admin/articles/categories', icon: <Tag className="w-5 h-5" /> },
      { label: 'Tags', href: '/admin/articles/tags', icon: <BookText className="w-5 h-5" /> },
    ],
  },
  {
    label: 'BOOKINGS',
    items: [
      { label: 'All Bookings', href: '/admin/bookings', icon: <CalendarClock className="w-5 h-5" /> },
    ],
  },
  {
    label: 'PAYMENTS',
    items: [
      { label: 'Transactions', href: '/admin/payments', icon: <CreditCard className="w-5 h-5" /> },
      { label: 'Invoices', href: '/admin/invoices', icon: <Receipt className="w-5 h-5" /> },
    ],
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
      {
        label: 'Newsletter',
        href: '/admin/newsletter',
        icon: <Mail className="w-5 h-5" />,
      },
      {
        label: 'Campaigns',
        href: '/admin/newsletter/campaigns',
        icon: <Megaphone className="w-5 h-5" />,
      },
      { label: 'Messages', href: '/admin/messages', icon: <MessageSquare className="w-5 h-5" /> },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Users', href: '/admin/users', icon: <Users2 className="w-5 h-5" /> },
      { label: 'SEO', href: '/admin/seo', icon: <ShieldAlert className="w-5 h-5" /> },
    ],
  },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col md:flex-row antialiased">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex justify-between items-center px-5 py-3 bg-surface dark:bg-deep-charcoal sticky top-0 z-40 border-b border-earth-brown/10">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-on-surface-variant hover:text-primary"
          aria-label="Open menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <span className="font-display text-headline-lg-mobile text-on-surface tracking-tighter">
          BOSCO OKEMA
        </span>
        <button
          onClick={() => signOut()}
          className="font-label text-label-sm text-on-surface-variant hover:text-accent-orange uppercase"
        >
          SIGN OUT
        </button>
      </header>

      {/* Sidebar */}
      <nav
        className={cn(
          'fixed left-0 top-0 h-full bg-deep-charcoal z-50 w-[280px] shadow-[40px_0_40px_rgba(0,0,0,0.04)] overflow-y-auto transition-transform duration-300 flex flex-col',
          'hidden md:flex',
          mobileOpen && 'flex md:hidden translate-x-0',
          !mobileOpen && 'md:flex -translate-x-full md:translate-x-0'
        )}
      >
        <div className="mb-10 px-6 pt-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted-ochre/20 border border-warm-ivory/20 flex items-center justify-center">
            <span className="font-display text-warm-ivory text-headline-md leading-none">BO</span>
          </div>
          <div>
            <h2 className="font-headline text-headline-md text-warm-ivory leading-none tracking-tight">
              Bosco Okema
            </h2>
            <span className="font-body text-body-md text-surface-variant opacity-70">
              Admin Portal
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden ml-auto text-surface-variant hover:text-warm-ivory"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="flex-1 flex flex-col gap-1 px-3 pb-6">
          {navGroups.map((group) => (
            <li key={group.label} className="mt-5 first:mt-0">
              <div className="px-3 py-2 font-label text-label-sm uppercase tracking-widest text-surface-variant opacity-60">
                {group.label}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== '/admin' && pathname?.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded transition-all font-body text-body-md',
                          active
                            ? 'text-warm-ivory bg-muted-ochre/20'
                            : 'text-surface-variant opacity-80 hover:bg-muted-ochre/10 hover:opacity-100'
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>

        <div className="px-3 pb-6 pt-4 border-t border-warm-ivory/10 mt-auto">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2.5 rounded w-full transition-all font-body text-body-md text-surface-variant opacity-80 hover:bg-muted-ochre/10 hover:opacity-100 hover:text-warm-ivory"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-deep-charcoal/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-[280px] min-h-screen">
        {/* Top bar */}
        <header className="hidden md:flex justify-between items-center h-16 px-6 bg-surface-container border-b border-earth-brown/10 sticky top-0 z-30">
          <span className="font-headline text-headline-md text-on-surface tracking-tight pl-2">
            Admin Portal
          </span>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high p-2 rounded-full transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="flex items-center gap-3 pl-3 border-l border-earth-brown/10">
              <div className="w-9 h-9 rounded-full bg-muted-ochre/20 border border-earth-brown/20 flex items-center justify-center">
                <span className="font-headline text-earth-brown text-body-md leading-none">
                  {session?.user?.name?.charAt(0) || 'B'}
                </span>
              </div>
              <div className="leading-tight">
                <div className="font-label text-label-sm text-on-surface">
                  {session?.user?.name || 'Admin User'}
                </div>
                <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  {session?.user?.role || 'ADMIN'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
