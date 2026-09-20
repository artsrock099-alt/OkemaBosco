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
      contactEmail: 'okemabosco18@gmail.com',
      contactPhone: '+1 (240) 926-0614',
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

  const navTree: { label: string; url: string; children?: { label: string; url: string }[] }[] = [
    { label: 'HOME', url: '/' },
    { label: 'EVENTS', url: '/events' },
    {
      label: 'EDUCATION',
      url: '/education',
      children: [
        { label: 'School Residency', url: '/education/school-residency' },
        { label: 'Elderly Visits', url: '/education/elderly-visits' },
        { label: 'Live Performance', url: '/live-performance' },
      ],
    },
    { label: 'LISTEN', url: '/listen' },
    { label: 'MEDIA', url: '/media' },
    { label: 'ABOUT', url: '/about' },
    { label: 'CONTACT', url: '/contact' },
  ];

  let order = 0;
  for (const item of navTree) {
    const parent = await prisma.navigationItem.create({
      data: {
        navigationId: mainNav.id,
        label: item.label,
        url: item.url,
        order: order++,
        isVisible: true,
      },
    });

    let childOrder = 0;
    for (const child of item.children || []) {
      await prisma.navigationItem.create({
        data: {
          navigationId: mainNav.id,
          label: child.label,
          url: child.url,
          order: childOrder++,
          isVisible: true,
          parentId: parent.id,
        },
      });
    }
  }
  console.log('  ✅ Navigation:', navTree.length, 'items');

  // ============== SOCIAL LINKS (real profiles) ==============
  await prisma.socialLink.deleteMany({});
  const socials = [
    { platform: 'Instagram', url: 'https://www.instagram.com/okemabosco18/', icon: 'instagram' },
    { platform: 'Facebook', url: 'https://www.facebook.com/okema.bosco.9/', icon: 'facebook' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@okemabosco6009', icon: 'youtube' },
    { platform: 'TikTok', url: 'https://www.tiktok.com/@okemabosco7', icon: 'tiktok' },
    { platform: 'WhatsApp', url: 'https://wa.me/12409260614', icon: 'whatsapp' },
  ];
  for (const [i, s] of socials.entries()) {
    await prisma.socialLink.create({
      data: { ...s, order: i, label: s.platform, isVisible: true },
    });
  }
  console.log('  ✅ Social links');

  // ============== INSTRUMENT PHOTOS (registered as reusable media) ==============
  const instrumentPhotos = [
    { filename: 'pic5.png', url: '/OKema/pic5.png', alt: 'Adungu bow harp with a gourd resonator' },
    { filename: 'pic7.png', url: '/OKema/pic7.png', alt: 'Thumb piano with metal tines on a wooden board' },
    { filename: 'pic9.png', url: '/OKema/pic9.png', alt: 'Dried gourd shells used for percussion' },
    { filename: 'pic6.png', url: '/OKema/pic6.png', alt: 'Handmade stringed instrument built by Bosco Okema' },
    { filename: 'IMG_4864.JPG', url: '/OKema/IMG_4864.JPG', alt: 'Bosco Okema singing during a live performance' },
  ];

  // ============== PHOTO LIBRARY (every photo Bosco supplied) ==============
  // These are real Media records, so they appear in Admin -> Media -> Photos
  // and can be dropped into any section from the Page Builder. The gallery on
  // /media/photos reads this list, so adding or removing a photo here (or in
  // the admin) changes that page.
  const libraryPhotos: { filename: string; alt: string }[] = [
    { filename: 'AboutOkema.jpg', alt: 'Portrait of Bosco Okema with his instrument' },
    { filename: 'pic4.jpeg', alt: 'Bosco Okema with his instruments' },
    { filename: 'Pic1.jpeg', alt: 'Bosco Okema performing live' },
    { filename: 'pic2.jpeg', alt: 'Bosco Okema holding a traditional Adungu instrument' },
    { filename: 'pic3.jpeg', alt: 'Bosco Okema on stage' },
    { filename: 'culturePerformance.JPG', alt: 'Bosco Okema in cultural performance' },
    { filename: 'liveperformance1.JPG', alt: 'Bosco Okema performing live' },
    { filename: 'liveperformance2.JPG', alt: 'Bosco Okema performing with his band' },
    { filename: 'schoolresidency2.jpg', alt: 'Children learning traditional music' },
    { filename: 'schoolresidency3.jpg', alt: 'Students learning the instruments' },
    { filename: 'schoolresidency1.jpeg', alt: 'Music session in a school hall' },
    { filename: 'schoolresidency4.jpeg', alt: 'Classroom music workshop' },
    { filename: 'schoolresidency6.jpeg', alt: 'Hands-on instrument session with students' },
    { filename: 'schoolresidency8.jpeg', alt: 'Students gathered around traditional instruments' },
    { filename: 'schoolresidency9.jpeg', alt: 'Students joining in with percussion' },
    { filename: 'schoolresidency10.jpeg', alt: 'A whole class taking part' },
    { filename: 'schoolresidency12.jpeg', alt: 'A student trying a traditional instrument' },
    { filename: 'schoolresidency13.jpeg', alt: 'Classroom music session in progress' },
    { filename: 'schoolresidency14.jpeg', alt: 'Students singing together during a residency' },
    { filename: 'schoolresidency15.jpeg', alt: 'Residency workshop in a school' },
    { filename: 'schoolresidency7.jpeg', alt: 'Bosco Okema leading a school workshop' },
    { filename: 'schoolresidency5.jpeg', alt: 'Students taking part in a music workshop' },
    { filename: 'PrimRoseElders6.jpeg', alt: 'Residents enjoying a live music visit' },
    { filename: 'PrimRoseElders4.jpeg', alt: 'Residents sharing a musical moment' },
    { filename: 'PrimRoseElders9.jpeg', alt: 'Elderly residents clapping along' },
    { filename: 'ElderFlower1.jpeg', alt: 'Bosco Okema playing music for residents' },
  ];

  const mimeFor = (filename: string) =>
    filename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

  const photoIds: Record<string, string> = {};
  for (const photo of instrumentPhotos) {
    const existing = await prisma.media.findFirst({ where: { url: photo.url } });
    const media =
      existing ??
      (await prisma.media.create({
        data: {
          type: 'IMAGE',
          title: photo.alt,
          filename: photo.filename,
          url: photo.url,
          mimeType: mimeFor(photo.filename),
          size: 0,
          altText: photo.alt,
        },
      }));
    photoIds[photo.url] = media.id;
  }

  for (const photo of libraryPhotos) {
    const url = `/OKema/${photo.filename}`;
    const existing = await prisma.media.findFirst({ where: { url } });
    if (existing) continue;
    await prisma.media.create({
      data: {
        type: 'IMAGE',
        title: photo.alt,
        filename: photo.filename,
        url,
        mimeType: mimeFor(photo.filename),
        size: 0,
        altText: photo.alt,
      },
    });
  }

  // ============== SAMPLE INSTRUMENTS ==============
  const instruments = [
    {
      name: 'Adungu',
      slug: 'adungu',
      description:
        'A nine-string bow harp and the instrument Bosco grew up with. The gourd body is wrapped in animal skin and the harp is held in the lap, with one hand plucking the melody while the other adds the bass line.',
      imageId: photoIds['/OKema/pic5.png'],
      order: 0,
    },
    {
      name: 'Thumb Piano',
      slug: 'thumb-piano',
      description:
        'Also called mbira or akogo. Metal tines are fixed to a wooden board and pressed with the thumbs to make a soft, repeating melody that sits under the voice. It is often played at ceremonies and while telling stories.',
      imageId: photoIds['/OKema/pic7.png'],
      order: 1,
    },
    {
      name: 'Percussion',
      slug: 'percussion',
      description:
        'Drums, shakers, bells, gourds and wooden blocks. Percussion holds the pulse of every ensemble and is usually what gets a room up on its feet, from a school hall to a festival stage.',
      imageId: photoIds['/OKema/pic9.png'],
      order: 2,
    },
    {
      name: 'Guitar',
      slug: 'guitar',
      description:
        'A modern addition to a traditional line-up. Bosco uses the guitar to blend Ugandan tunings with contemporary songwriting, and it carries many of the songs he writes today.',
      imageId: photoIds['/OKema/pic6.png'],
      order: 3,
    },
    {
      name: 'Voice',
      slug: 'voice',
      description:
        'Call-and-response songs, lullabies, praise singing and storytelling, all carried by the human voice above the instruments. In most performances the audience ends up singing the responses back.',
      imageId: photoIds['/OKema/IMG_4864.JPG'],
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
      title: 'Kampala Arts Festival, Main Stage',
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
      title: 'Makerere University Traditional Music Workshop',
      slug: 'makerere-university-traditional-music-workshop',
      categorySlug: 'workshop',
      days: 54,
      time: '10:00',
      venue: 'Makerere University, School of Performing Arts',
      location: 'Kampala, Uganda',
      shortDescription:
        'A day-long hands-on workshop for music students on Adungu technique, call-and-response, and Ugandan musical storytelling.',
      isFeatured: false,
    },
    {
      title: 'Nile Resort End-of-Year Gala',
      slug: 'nile-resort-end-of-year-gala',
      categorySlug: 'private-event',
      days: 99,
      time: '19:30',
      venue: 'Nile Resort, Grand Ballroom',
      location: 'Jinja, Uganda',
      shortDescription:
        'An intimate acoustic evening of music and storytelling for resort guests at the annual New Year\u2019s celebration.',
      isFeatured: false,
    },
    {
      title: 'Entebbe Cultural Center Community Day',
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
        description: `${ev.shortDescription}\n\nJoin Bosco and the ensemble for an afternoon or evening of Ugandan music and storytelling, with music from the Adungu, thumb piano, guitar, voice and percussion, plus a few stories from the road.`,
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
      title: 'Kampala International School Residency Week',
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

  // ============== TESTIMONIALS (from okemabosco.com) ==============
  const testimonials = [
    {
      quote:
        'Having Okema as a visiting artist was an awesome experience for both me and my students. He kept everything fresh and engaging, and was fully present from start to finish. Every class participated in hands-on exercises, and the level of involvement was incredible. The students absolutely loved it.',
      name: 'Mr. Gilberto',
      role: 'Music Teacher',
      organization: 'A.C. Reynolds Middle School',
      order: 0,
      isFeatured: true,
    },
    {
      quote:
        'I am often brought to tears by how beautiful the experience has been for our elders. Okema\u2019s music is unbelievably beautiful, and he makes everything fun and engaging. He is an inspiration to be around, bringing joy, community and healing through his music.',
      name: 'Annie Spindler',
      role: 'Founder & Executive Director',
      organization: 'Elderflower Community',
      order: 1,
      isFeatured: true,
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
        'An instrument passed down through generations, and what it means to play it today.',
      days: 20,
    },
    {
      title: 'Music in the Classroom: Five Things I Learned',
      slug: 'music-in-the-classroom-five-things-i-learned',
      cat: 'education',
      excerpt:
        'From the shyest student to a room full of drummers, ten years of school residencies have taught me more than I ever expected.',
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
        'How school residency programs are transforming cultural education, with a case study from Bosco.',
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
          'Sample booking created from seed data. Update with real event details.',
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
        'Hi Bosco, we would love to invite you to headline the main stage at this year\u2019s Acacia Festival. Please send availability and rider details, and I am happy to follow up with a call.',
      isRead: false,
    },
    {
      name: 'Samuel Okello',
      email: 'samuel.okello@example.com',
      subject: 'Private Wedding Booking',
      message:
        'Hi, we are getting married on the shores of Lake Victoria in October and would love to have you and a small ensemble for the ceremony and dinner. Is this something you do?',
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
  const heroImage = '/OKema/Pic1.jpeg';

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
        image: '/OKema/pic4.jpeg',
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
            image: '/OKema/pic3.jpeg',
          },
          {
            title: 'SCHOOL RESIDENCY',
            subtitle: 'Bring African Music Into Your Classroom',
            description:
              'Interactive music, traditional instruments, storytelling, rhythm and cultural learning for students of all ages.',
            href: '/education/school-residency',
            image: '/OKema/schoolresidency3.jpg',
          },
          {
            title: 'ELDERLY VISITS',
            subtitle: 'Music That Creates Connection',
            description:
              'Live musical experiences for senior communities, assisted living facilities, nursing homes and senior centers.',
            href: '/education/elderly-visits',
            image: '/OKema/ElderFlower1.jpeg',
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
        eyebrow: 'In their words',
        heading: 'What people tell me afterwards.',
        limit: 4,
      },
    },
    {
      type: 'FEATURED_VIDEO',
      order: 6,
      content: {
        eyebrow: 'EXPERIENCE THE MUSIC',
        heading: 'Live performance at the Kampala National Theatre.',
        thumbnail: '/OKema/IMG_4864.JPG',
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
