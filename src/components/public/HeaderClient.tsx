'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

type NavChild = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  children: NavChild[];
};

type NavItem = {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  children: NavChild[];
};

type HeaderClientProps = {
  brandName: string;
  navItems: NavItem[];
};

const defaultFallbackNav: NavItem[] = [
  { id: '1', label: 'Home', url: '/', isExternal: false, children: [] },
  { id: '2', label: 'Events', url: '/events', isExternal: false, children: [] },
  {
    id: '3',
    label: 'Education',
    url: '/education',
    isExternal: false,
    children: [
      { id: '3a', label: 'School Residency', url: '/education/school-residency', isExternal: false, children: [] },
      { id: '3b', label: 'Elderly Visits', url: '/education/elderly-visits', isExternal: false, children: [] },
    ],
  },
  { id: '4', label: 'Listen', url: '/listen', isExternal: false, children: [] },
  {
    id: '5',
    label: 'Media',
    url: '/media',
    isExternal: false,
    children: [
      { id: '5a', label: 'Photos', url: '/media/photos', isExternal: false, children: [] },
      { id: '5b', label: 'Videos', url: '/media/videos', isExternal: false, children: [] },
      { id: '5c', label: 'Instrument Gallery', url: '/media/instruments', isExternal: false, children: [] },
      { id: '5d', label: 'Press', url: '/media/press', isExternal: false, children: [] },
      { id: '5e', label: 'Articles', url: '/media/articles', isExternal: false, children: [] },
    ],
  },
  { id: '6', label: 'About', url: '/about', isExternal: false, children: [] },
  { id: '7', label: 'Contact', url: '/contact', isExternal: false, children: [] },
];

export default function HeaderClient({ brandName, navItems }: HeaderClientProps) {
  const items = navItems.length > 0 ? navItems : defaultFallbackNav;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 w-full z-50 transition-all duration-300',
          isScrolled
            ? 'bg-surface/90 backdrop-blur-md border-b border-earth-brown/10 py-2'
            : 'bg-transparent py-4'
        )}
      >
        <div className="flex justify-between items-center container-x">
          <div className="flex items-center gap-4">
            <button
              aria-label="Menu"
              className="md:hidden text-primary"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link
              href="/"
              className="font-display text-headline-lg-mobile md:text-headline-lg text-primary tracking-tighter hover:text-muted-ochre transition-colors duration-300"
            >
              {brandName || 'BOSCO OKEMA'}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {items.map((item) => (
              <div key={item.id} className="relative group">
                {item.isExternal ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="nav-link">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.url} className="nav-link">
                    {item.label}
                  </Link>
                )}
                {item.children && item.children.length > 0 && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-surface border border-earth-brown/10 rounded shadow-xl p-2 min-w-[220px]">
                      {item.children.map((child) => (
                        child.isExternal ? (
                          <a
                            key={child.id}
                            href={child.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-body-md text-on-surface-variant hover:bg-surface-container hover:text-muted-ochre rounded transition-colors"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block px-4 py-2 text-body-md text-on-surface-variant hover:bg-surface-container hover:text-muted-ochre rounded transition-colors"
                          >
                            {child.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Link href="/book" className="hidden md:inline-block btn-primary !px-6 !py-3">
            BOOK BOSCO
          </Link>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="absolute inset-0 bg-deep-charcoal/60"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[85%] max-w-sm bg-surface shadow-2xl transition-transform duration-300 flex flex-col',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex justify-between items-center p-6 border-b border-earth-brown/10">
            <span className="font-display text-headline-md text-primary tracking-tighter">
              {brandName || 'BOSCO OKEMA'}
            </span>
            <button aria-label="Close" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6 text-on-surface-variant" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <div key={item.id}>
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-3 font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors border-b border-earth-brown/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.url}
                      className="block py-3 font-headline text-headline-md text-on-surface hover:text-muted-ochre transition-colors border-b border-earth-brown/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && item.children.length > 0 && (
                    <div className="pl-4">
                      {item.children.map((child) => (
                        child.isExternal ? (
                          <a
                            key={child.id}
                            href={child.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block py-2 font-body text-body-md text-on-surface-variant hover:text-muted-ochre transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block py-2 font-body text-body-md text-on-surface-variant hover:text-muted-ochre transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.label}
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border-t border-earth-brown/10">
            <Link
              href="/book"
              className="btn-primary w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              BOOK BOSCO
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
