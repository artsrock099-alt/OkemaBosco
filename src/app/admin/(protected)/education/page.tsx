import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDateShort } from '@/lib/utils';

export const metadata = { title: 'Education Programs' };

const programTypeLabels: Record<string, string> = {
  SCHOOL_RESIDENCY: 'School Residency',
  ELDERLY_VISIT: 'Elderly Visits',
  COMMUNITY_WORKSHOP: 'Community Workshop',
  LIVE_PERFORMANCE: 'Live Performance',
};

export default async function AdminEducationPage() {
  const programs = await prisma.educationProgram.findMany({
    orderBy: [{ type: 'asc' }, { title: 'asc' }],
  });

  const items = programs.length > 0
    ? programs
    : [
        {
          id: 'e1',
          type: 'SCHOOL_RESIDENCY',
          title: 'In-School Music Residency',
          slug: 'school-residency',
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'e2',
          type: 'ELDERLY_VISIT',
          title: 'Memory Through Music (Elder Care)',
          slug: 'elderly-visits',
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'e3',
          type: 'COMMUNITY_WORKSHOP',
          title: 'Community Drum & Dance Circle',
          slug: 'community-workshop',
          isPublished: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

  const typeBreakdown: Record<string, number> = {};
  items.forEach((p: any) => {
    typeBreakdown[p.type] = (typeBreakdown[p.type] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <div className="font-label text-label-sm uppercase tracking-widest text-muted-ochre mb-3">
            Programs • Education
          </div>
          <h1 className="font-display text-headline-lg text-on-surface tracking-tight">
            Education Programs
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mt-2 max-w-2xl">
            Configure School Residencies, Elderly Visits, workshops and community offerings. Each program is CMS-driven — content, features, formats and CTA are editable here.
          </p>
        </div>
        <button className="px-4 py-2.5 bg-deep-charcoal text-warm-ivory font-label text-label-sm hover:bg-muted-ochre transition-colors uppercase tracking-widest rounded">
          + New Program
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Total Programs</div>
          <div className="font-display text-headline-lg text-on-surface">{items.length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Published</div>
          <div className="font-display text-headline-lg text-muted-ochre">{(items as any[]).filter(p => p.isPublished).length}</div>
        </div>
        <div className="card-surface p-4">
          <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Types</div>
          <div className="font-display text-headline-lg text-earth-brown">{Object.keys(typeBreakdown).length}</div>
        </div>
        <div className="card-surface p-4" />
      </div>

      <div className="card-surface overflow-hidden divide-y divide-earth-brown/10">
        {(items as any[]).length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant">
            No programs yet.
          </div>
        ) : (
          (items as any[]).map((p) => (
            <div key={p.id} className="p-6 flex flex-wrap items-start gap-5 hover:bg-surface-container/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-muted-ochre/10 border border-muted-ochre/20 flex items-center justify-center text-2xl flex-shrink-0">
                {p.type === 'SCHOOL_RESIDENCY' ? '🏫' : p.type === 'ELDERLY_VISIT' ? '👵' : p.type === 'COMMUNITY_WORKSHOP' ? '🤝' : '🎵'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant font-label text-[10px] rounded uppercase tracking-wider">
                    {programTypeLabels[p.type] || p.type}
                  </span>
                  {!p.isPublished && (
                    <span className="px-2 py-0.5 bg-surface-container-high text-on-surface-variant border border-earth-brown/20 font-label text-[10px] rounded uppercase tracking-wider">
                      DRAFT
                    </span>
                  )}
                  {p.isPublished && (
                    <span className="px-2 py-0.5 bg-earth-brown/10 text-earth-brown font-label text-[10px] rounded uppercase tracking-wider">
                      LIVE
                    </span>
                  )}
                </div>
                <h3 className="font-headline text-headline-md text-on-surface tracking-tight leading-tight">
                  {p.title}
                </h3>
                <div className="font-mono text-[12px] text-muted-ochre mt-1">
                  /education/{p.slug}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Updated {formatDateShort(p.updatedAt)}
                </span>
                <Link href={`/admin/education/${p.id}`} className="text-muted-ochre hover:text-earth-brown font-label text-label-sm uppercase tracking-widest">
                  Edit
                </Link>
                <Link href={`/education/${p.slug}`} target="_blank" className="text-on-surface-variant hover:text-on-surface font-label text-label-sm uppercase tracking-widest">
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
