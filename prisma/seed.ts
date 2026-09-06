import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============== USER ==============
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@boscookema.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      name: 'Bosco Okema',
      email: adminEmail,
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
    update: {
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log('  ✅ User:', admin.email, `(${admin.role})`);

  // ============== SITE SETTINGS ==============
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: 'Bosco Okema',
      tagline: 'Ugandan Musician • Cultural Educator • Performer',
      contactEmail: 'hello@boscookema.com',
      contactPhone: '+256 700 000 000',
      contactLocation: 'Kampala, Uganda',
      footerText:
        'Ugandan Musician • Cultural Educator • Performer\nExperience the music, stories and traditions of Uganda.',
      copyrightText: '© 2026 Bosco Okema. All Rights Reserved.',
    },
    update: {},
  });
  console.log('  ✅ Site settings');

  // ============== NAVIGATION ==============
  const mainNav = await prisma.navigation.upsert({
    where: { name: 'main' },
    create: {
      name: 'main',
      location: 'header',
    },
    update: {},
  });

  await prisma.navigationItem.deleteMany({ where: { navigationId: mainNav.id } });

  const navLabels: [string, string, string?][] = [
    ['HOME', '/', undefined],
    ['EVENTS', '/events', undefined],
    ['EDUCATION', '/education', undefined],
    ['LISTEN', '/listen', undefined],
    ['MEDIA', '/media', undefined],
    ['ABOUT', '/about', undefined],
    ['CONTACT', '/contact', undefined],
  ];

  let order = 0;
  for (const [label, href] of navLabels) {
    await prisma.navigationItem.create({
      data: {
        navigationId: mainNav.id,
        label,
        url: href,
        order: order++,
        isVisible: true,
      },
    });
  }
  console.log('  ✅ Navigation:', navLabels.length, 'items');

  // ============== SOCIAL LINKS ==============
  await prisma.socialLink.deleteMany({});
  const socials = [
    { platform: 'Instagram', url: '#', icon: 'instagram' },
    { platform: 'Facebook', url: '#', icon: 'facebook' },
    { platform: 'YouTube', url: '#', icon: 'youtube' },
    { platform: 'Spotify', url: '#', icon: 'spotify' },
    { platform: 'TikTok', url: '#', icon: 'tiktok' },
  ];
  for (const [i, s] of socials.entries()) {
    await prisma.socialLink.create({
      data: { ...s, order: i, label: s.platform, isVisible: true },
    });
  }
  console.log('  ✅ Social links');

  // ============== SAMPLE INSTRUMENTS ==============
  const instruments = [
    {
      name: 'Adungu',
      slug: 'adungu',
      description:
        'A traditional Ugandan bow harp with nine strings, believed to be the musical voice of ancestors. Held in the lap and played with both hands.',
      order: 0,
    },
    {
      name: 'Thumb Piano',
      slug: 'thumb-piano',
      description:
        'Also called mbira or akogo — a gentle melodic instrument played with the thumbs, used in ceremonies and storytelling.',
      order: 1,
    },
    {
      name: 'Percussion',
      slug: 'percussion',
      description:
        'Drums, shakers, bells and wood blocks that carry rhythm — the heartbeat of every Ugandan ensemble.',
      order: 2,
    },
    {
      name: 'Guitar',
      slug: 'guitar',
      description:
        'A modern addition used to blend traditional tunings with contemporary songwriting and arrangement.',
      order: 3,
    },
    {
      name: 'Voice',
      slug: 'voice',
      description:
        'Call-and-response songs, lullabies, storytelling and praise singing — carried on the human voice above every instrument.',
      order: 4,
    },
  ];
  await prisma.instrument.deleteMany({});
  for (const inst of instruments) {
    await prisma.instrument.create({ data: inst });
  }
  console.log('  ✅ Instruments');

  // ============== EVENT CATEGORIES ==============
  const catNames = ['Concert', 'Festival', 'School Residency', 'Workshop', 'Community', 'Private Event'];
  const categories: Record<string, string> = {};
  await prisma.eventCategory.deleteMany({});
  for (const name of catNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const cat = await prisma.eventCategory.create({ data: { name, slug } });
    categories[slug] = cat.id;
  }
  console.log('  ✅ Event categories');

  // ============== SAMPLE EVENTS ==============
  const now = new Date();
  const events = [
    {
      title: 'Kampala Arts Festival — Main Stage',
      slug: 'kampala-arts-festival-main-stage',
      categorySlug: 'festival',
      days: 30,
      time: '18:00',
      venue: 'National Theatre Main Stage',
      location: 'Kampala, Uganda',
      shortDescription:
        'A full-band headline set opening the 2026 Kampala Arts Festival, featuring new works alongside classic Ugandan repertoire.',
      isFeatured: true,
    },
    {
      title: 'Makerere University — Traditional Music Workshop',
      slug: 'makerere-university-traditional-music-workshop',
      categorySlug: 'workshop',
      days: 54,
      time: '10:00',
      venue: 'Makerere University — School of Performing Arts',
      location: 'Kampala, Uganda',
      shortDescription:
        'A day-long hands-on workshop for music students on Adungu technique, call-and-response, and Ugandan musical storytelling.',
      isFeatured: false,
    },
    {
      title: 'Nile Resort — End-of-Year Gala',
      slug: 'nile-resort-end-of-year-gala',
      categorySlug: 'private-event',
      days: 99,
      time: '19:30',
      venue: 'Nile Resort — Grand Ballroom',
      location: 'Jinja, Uganda',
      shortDescription:
        'An intimate acoustic evening of music and storytelling for resort guests at the annual New Year\u2019s celebration.',
      isFeatured: false,
    },
    {
      title: 'Entebbe Cultural Center — Community Day',
      slug: 'entebbe-cultural-center-community-day',
      categorySlug: 'community',
      days: 138,
      time: '14:00',
      venue: 'Entebbe Cultural Center',
      location: 'Entebbe, Uganda',
      shortDescription:
        'A free community event for the whole family with performances, instrument petting zoo, and participatory music-making.',
      isFeatured: true,
    },
  ];

  await prisma.event.deleteMany({});
  for (const ev of events) {
    const start = new Date(now);
    start.setDate(start.getDate() + ev.days);
    await prisma.event.create({
      data: {
        title: ev.title,
        slug: ev.slug,
        categoryId: categories[ev.categorySlug],
        startDate: start,
        time: ev.time,
        venue: ev.venue,
        location: ev.location,
        shortDescription: ev.shortDescription,
        description: `${ev.shortDescription}\n\nJoin Bosco and ensemble for a memorable afternoon or evening of Ugandan music and storytelling. This program features music from the Adungu, thumb piano, guitar, voice, and percussion — as well as stories from the road.`,
        isPublished: true,
        isFeatured: ev.isFeatured,
      },
    });
  }
  console.log('  ✅ Upcoming events');

  // ============== PAST EVENTS ==============
  const pastEvents = [
    {
      title: 'Gulu Cultural Heritage Festival',
      slug: 'gulu-cultural-heritage-festival',
      categorySlug: 'festival',
      days: 90,
      venue: 'Gulu City Stadium',
      location: 'Gulu, Uganda',
    },
    {
      title: 'Kampala International School — Residency Week',
      slug: 'kampala-international-school-residency-week',
      categorySlug: 'school-residency',
      days: 150,
      venue: 'Kampala International School',
      location: 'Kampala, Uganda',
    },
  ];
  for (const ev of pastEvents) {
    const start = new Date(now);
    start.setDate(start.getDate() - ev.days);
    await prisma.event.create({
      data: {
        title: ev.title,
        slug: `${ev.slug}-archive`,
        categoryId: categories[ev.categorySlug],
        startDate: start,
        venue: ev.venue,
        location: ev.location,
        shortDescription: 'An archived past event.',
        isPublished: true,
      },
    });
  }

  // ============== SAMPLE TESTIMONIALS ==============
  const testimonials = [
    {
      quote:
        'Bosco did not just perform for our school — he transformed a week of classes into something my students will remember for the rest of their lives. Every instrument, every story, every song landed.',
      name: 'Dr. Sarah Namata',
      organization: 'Kampala International School',
      role: 'Head of Arts',
      order: 0,
      isFeatured: true,
    },
    {
      quote:
        'In a room full of people who had barely spoken to each other all year, he had everyone singing, clapping, and smiling within the first five minutes. A rare gift.',
      name: 'Josephine M.',
      organization: 'Nile View Assisted Living',
      role: 'Activities Director',
      order: 1,
    },
    {
      quote:
        'We booked Bosco for our festival\u2019s headline slot, and he gave the audience everything — and more. The standing ovation lasted ten minutes.',
      name: 'David Otieno',
      organization: 'Kampala Arts Festival',
      role: 'Artistic Director',
      order: 2,
      isFeatured: true,
    },
    {
      quote:
        'Gentle, patient, generous with his time and his instrument. My mother has dementia and she sang along — aloud — for the first time in two years. I will never forget that afternoon.',
      name: 'Amina K.',
      organization: 'Private Family Booking',
      role: 'Daughter',
      order: 3,
    },
    {
      quote:
        'Bosco bridges the traditional and the contemporary in a way that feels effortless. He is a cultural treasure and exactly the kind of educator the next generation needs.',
      name: 'Professor Peter Wasswa',
      organization: 'Makerere University',
      role: 'School of Performing Arts',
      order: 4,
    },
    {
      quote:
        'Professional from the first email to the final encore, kind to every audience member, and a musician of extraordinary depth. Cannot recommend highly enough.',
      name: 'Hannah and Michael R.',
      organization: 'Private Wedding',
      role: 'The Couple',
      order: 5,
    },
  ];
  await prisma.testimonial.deleteMany({});
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log('  ✅ Testimonials');

  // ============== ARTICLE CATEGORIES & ARTICLES ==============
  const articleCats = ['Culture', 'Education', 'Community', 'Tour Diary', 'Music'];
  await prisma.articleCategory.deleteMany({});
  const acMap: Record<string, string> = {};
  for (const name of articleCats) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const c = await prisma.articleCategory.create({ data: { name, slug } });
    acMap[slug] = c.id;
  }

  const articles = [
    {
      title: 'The Story of the Adungu',
      slug: 'the-story-of-the-adungu',
      cat: 'culture',
      excerpt:
        'An instrument passed down through generations — how the bow harp carries the voices of my ancestors, and what it means to play it today.',
      days: 20,
    },
    {
      title: 'Music in the Classroom: Five Things I Learned',
      slug: 'music-in-the-classroom-five-things-i-learned',
      cat: 'education',
      excerpt:
        'From the shyest student to the room full of drummers — ten years of school residencies have taught me more than I ever expected.',
      days: 60,
    },
    {
      title: 'Why I Play for Seniors',
      slug: 'why-i-play-for-seniors',
      cat: 'community',
      excerpt:
        'The most attentive audience I have ever known. A letter from a daughter, a room in silence, and the song that opened a memory.',
      days: 130,
    },
  ];
  await prisma.article.deleteMany({});
  for (const a of articles) {
    const d = new Date(now);
    d.setDate(d.getDate() - a.days);
    await prisma.article.create({
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        categoryId: acMap[a.cat],
        authorId: admin.id,
        status: 'PUBLISHED',
        publishDate: d,
      },
    });
  }
  console.log('  ✅ Articles');

  // ============== SAMPLE PRESS ==============
  const pressItems = [
    {
      publication: 'The Kampala Post',
      title: 'Bringing Traditional Ugandan Music to the Modern Stage',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 75),
      url: '#',
      description:
        'An in-depth feature on how Bosco Okema is bridging generations through the Adungu and storytelling.',
    },
    {
      publication: 'Africa Arts Review',
      title: '10 Musicians Shaping the Future of African Folk',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 150),
      url: '#',
      description:
        'Bosco Okema is profiled among a new generation of artists honoring tradition while looking forward.',
    },
    {
      publication: 'Education Today Uganda',
      title: 'The Classroom Becomes a Stage',
      date: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 240),
      url: '#',
      description:
        'How school residency programs are transforming cultural education — with a case study from Bosco.',
    },
  ];
  await prisma.press.deleteMany({});
  for (const p of pressItems) {
    await prisma.press.create({ data: p });
  }
  console.log('  ✅ Press');

  // ============== NEWSLETTER SUBSCRIBERS ==============
  const subs = [
    'sarah@example.com',
    'michael@example.com',
    'amina@example.com',
    'josephine@example.org',
    'david@example.com',
  ];
  await prisma.newsletterSubscriber.deleteMany({});
  for (const email of subs) {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      },
    });
  }
  console.log('  ✅ Newsletter subscribers');

  // ============== SAMPLE BOOKINGS ==============
  const bookingTypes: any[] = [
    {
      type: 'LIVE_PERFORMANCE',
      status: 'NEW',
      name: 'Kampala Arts Festival Committee',
      org: 'Kampala Arts Festival',
      email: 'bookings@kampalaartsfest.ug',
      phone: '+256 700 111 000',
      venue: 'National Theatre',
      location: 'Kampala, Uganda',
      days: 45,
    },
    {
      type: 'SCHOOL_RESIDENCY',
      status: 'CONFIRMED',
      name: 'Dr. Sarah Namata',
      org: 'Kampala International School',
      email: 'sarah@kis.ac.ug',
      phone: '+256 700 222 000',
      venue: 'KIS Main Hall',
      location: 'Kampala, Uganda',
      days: 60,
    },
    {
      type: 'PRIVATE_EVENT',
      status: 'FULLY_PAID',
      name: 'Hannah & Michael R.',
      org: 'Private',
      email: 'hannah.m@example.com',
      venue: 'Nile Resort',
      location: 'Jinja, Uganda',
      days: 80,
    },
    {
      type: 'WORKSHOP',
      status: 'NEW',
      name: 'Entebbe Cultural Center',
      org: 'Entebbe Community Programs',
      email: 'programs@entebbeculture.ug',
      venue: 'Entebbe Cultural Center',
      location: 'Entebbe, Uganda',
      days: 120,
    },
  ];
  await prisma.booking.deleteMany({});
  for (const [i, b] of bookingTypes.entries()) {
    const d = new Date(now);
    d.setDate(d.getDate() + b.days);
    await prisma.booking.create({
      data: {
        reference: `BK-SEED-${1000 + i}`,
        type: b.type,
        status: b.status,
        eventDate: d,
        venue: b.venue,
        location: b.location,
        expectedAudience: 'Medium (50-200)',
        eventDescription:
          'Sample booking created from seed data — update with real event details.',
        customerName: b.name,
        organization: b.org,
        customerEmail: b.email,
        customerPhone: b.phone,
      },
    });
  }
  console.log('  ✅ Sample bookings');

  // ============== SAMPLE CONTACT MESSAGES ==============
  const messages = [
    {
      name: 'Nakato Diana',
      organization: 'Acacia Festival',
      email: 'diana@acaciafest.org',
      phone: '+256 700 333 000',
      subject: 'Headline Performance Invitation',
      message:
        'Hi Bosco — we would love to invite you to headline the main stage at this year\u2019s Acacia Festival. Please send availability and rider details — happy to follow up with a call.',
      isRead: false,
    },
    {
      name: 'Samuel Okello',
      email: 'samuel.okello@example.com',
      subject: 'Private Wedding Booking',
      message:
        'Hi — getting married on the shores of Lake Victoria in October and would love to have you and a small ensemble for the ceremony and dinner. Is this something you do?',
      isRead: false,
    },
    {
      name: 'Rainbow Senior Center',
      email: 'activities@rainbowsenior.org',
      subject: 'Quarterly Music Visit for Residents',
      message:
        'We loved the concert you did last year. We are hoping to bring you back on a more regular basis, maybe once a quarter. Please let me know about packages.',
      isRead: true,
    },
  ];
  await prisma.contactMessage.deleteMany({});
  for (const m of messages) {
    await prisma.contactMessage.create({ data: m });
  }
  console.log('  ✅ Contact messages');

  // ============== MUSIC PLATFORMS ==============
  const platforms = [
    { name: 'Spotify', icon: 'spotify', color: '#1DB954' },
    { name: 'YouTube Music', icon: 'youtube', color: '#FF0000' },
    { name: 'Apple Music', icon: 'apple', color: '#FA2D48' },
    { name: 'SoundCloud', icon: 'soundcloud', color: '#FF5500' },
  ];
  await prisma.musicPlatform.deleteMany({});
  for (const p of platforms) {
    await prisma.musicPlatform.create({ data: p });
  }
  console.log('  ✅ Music platforms');

  // ============== PAGES & PAGE SECTIONS (CMS homepage) ==============
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA-N2I3AaRVr7rcVH8j0HmR3y1rftjbiFXJ-WlsQIdf5MR5RinpR-lNebU_lP8zlO-Dh8kyQT4-RgXxvVVnLEXbRPltYTpZCP-INvfgN3Xx_1cyheFttVPlt5aXb9lWOGa7R39PXEKJcpHcqIYhYSFtQ9SaqNtDbR6Rd_8ljolku2I8Xn_mLNoz-m7tleMdQltbkEoBq-bqdyBFCnplPsLErBRt1E6U42AOUTJb-80rDFn41G8-Xlq9ZA';

  const homePage = await prisma.page.upsert({
    where: { slug: 'home' },
    create: {
      title: 'Home',
      slug: 'home',
      status: 'PUBLISHED',
      isHomepage: true,
    },
    update: {
      status: 'PUBLISHED',
      isHomepage: true,
    },
  });

  await prisma.pageSection.deleteMany({ where: { pageId: homePage.id } });

  const homeSections: { type: string; order: number; content: any }[] = [
    {
      type: 'HERO',
      order: 0,
      content: {
        headline: 'BOSCO OKEMA',
        subheadline: 'Ugandan Musician • Cultural Educator • Performer',
        description:
          'Experience the music, stories and traditions of Uganda through live performance, cultural education and meaningful community experiences.',
        image: heroImage,
        imageAlt: 'Bosco Okema performing live on stage with traditional Ugandan instruments, moody cinematic lighting',
        buttons: [
          { label: 'BOOK BOSCO', href: '/book' },
          { label: 'WATCH & LISTEN', href: '/listen', variant: 'outline' },
        ],
        socials: ['INSTAGRAM', 'SPOTIFY', 'YOUTUBE', 'FACEBOOK'],
      },
    },
    {
      type: 'IMAGE_TEXT',
      order: 1,
      content: {
        eyebrow: 'MUSIC. CULTURE. CONNECTION.',
        heading: 'Connecting people through the music, stories and traditions of Uganda.',
        body: [
          'Bosco Okema is a Ugandan musician, performer and cultural educator whose work connects people through music, storytelling and cultural experience.',
          'From classrooms and senior communities to festivals, concerts and special events, Bosco brings the sounds and stories of Uganda to diverse audiences across the globe.',
        ],
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1000&q=80',
        imageAlt: 'Bosco Okema portrait holding traditional Adungu instrument',
        buttons: [{ label: 'DISCOVER BOSCO →', href: '/about' }],
      },
    },
    {
      type: 'SERVICES',
      order: 2,
      content: {
        eyebrow: 'OFFERINGS',
        heading: 'Experiences that bring Uganda to you.',
        items: [
          {
            title: 'LIVE PERFORMANCE',
            subtitle: 'Experience the Music of Uganda',
            description:
              'Traditional instruments, vocals, rhythm, storytelling and contemporary musical expression for festivals, concerts and special events.',
            href: '/live-performance',
            image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
          },
          {
            title: 'SCHOOL RESIDENCY',
            subtitle: 'Bring African Music Into Your Classroom',
            description:
              'Interactive music, traditional instruments, storytelling, rhythm and cultural learning for students of all ages.',
            href: '/education/school-residency',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
          },
          {
            title: 'ELDERLY VISITS',
            subtitle: 'Music That Creates Connection',
            description:
              'Live musical experiences for senior communities, assisted living facilities, nursing homes and senior centers.',
            href: '/education/elderly-visits',
            image: 'https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200&q=80',
          },
        ],
      },
    },
    {
      type: 'INSTRUMENTS',
      order: 3,
      content: {
        eyebrow: 'SOUNDS OF UGANDA',
        heading: 'Traditional instruments that carry the heartbeat of a nation.',
      },
    },
    {
      type: 'EVENTS',
      order: 4,
      content: {
        eyebrow: 'UPCOMING EVENTS',
        heading: 'Where to find Bosco.',
        limit: 3,
      },
    },
    {
      type: 'TESTIMONIALS',
      order: 5,
      content: {
        eyebrow: 'WHAT PEOPLE ARE SAYING',
        heading: 'Kind words from communities.',
        limit: 4,
      },
    },
    {
      type: 'FEATURED_VIDEO',
      order: 6,
      content: {
        eyebrow: 'EXPERIENCE THE MUSIC',
        heading: 'Live performance at the Kampala National Theatre.',
        thumbnail: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
        videoUrl: '',
        ctaLabel: 'MORE PERFORMANCES',
        ctaHref: '/listen',
      },
    },
    {
      type: 'CTA',
      order: 7,
      content: {
        eyebrow: 'BRING BOSCO TO YOUR COMMUNITY',
        headline:
          'School programs • Senior communities • Festivals • Concerts • Cultural events • Private events',
        buttons: [
          { label: 'BOOK BOSCO', href: '/book' },
          { label: 'GET IN TOUCH', href: '/contact', variant: 'outline' },
        ],
      },
    },
  ];

  for (const s of homeSections) {
    await prisma.pageSection.create({
      data: {
        pageId: homePage.id,
        type: s.type as any,
        order: s.order,
        isVisible: true,
        content: s.content,
      },
    });
  }
  console.log('  ✅ Home page + sections:', homeSections.length);

  console.log('\n🎉 Seed completed successfully.');
  console.log('\n🔑 Admin credentials:');
  console.log(`   Email:    ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
