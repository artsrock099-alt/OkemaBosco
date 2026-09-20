/**
 * Registry of the built-in public pages.
 *
 * Every route in this list ships with a designed layout in code. An admin can
 * turn any of them into an editable page: we create a Page record with the
 * same slug plus a starter set of sections that mirror the current design, and
 * from then on the public route renders those sections instead (only while the
 * page is PUBLISHED, so nothing changes until someone hits publish).
 */

export type TemplateSection = {
  type: string;
  content: Record<string, any>;
};

export type SitePageTemplate = {
  slug: string;
  path: string;
  title: string;
  summary: string;
  /** Background the coded layout ships with, shown in Admin -> Hero backgrounds. */
  defaultHeroImage?: string;
  sections: TemplateSection[];
};

const BOOK_BUTTONS = [
  { label: 'BOOK BOSCO', href: '/book' },
  { label: 'GET IN TOUCH', href: '/contact', variant: 'outline' },
];

export const SITE_PAGES: SitePageTemplate[] = [
  {
    slug: 'about',
    path: '/about',
    title: 'About Bosco',
    summary: 'Story, beliefs and the work',
    defaultHeroImage: '/OKema/pic2.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          headline: 'I am Bosco.',
          subheadline: 'Musician, cultural educator and performer from Uganda.',
          description:
            'I travel with an Adungu in hand and a story to tell, and I have spent years taking the music of home into rooms that had never heard it.',
          image: '/OKema/pic2.jpeg',
          imageAlt: 'Bosco Okema holding a traditional Adungu instrument',
          buttons: [
            { label: 'BOOK BOSCO', href: '/book' },
            { label: 'SAY HELLO', href: '/contact', variant: 'outline' },
          ],
        },
      },
      {
        type: 'IMAGE_TEXT',
        content: {
          eyebrow: 'The story',
          heading: 'Music was my first language.',
          body: [
            'I grew up in a home where music was not something you turned on. It was something you did.',
            'As I grew older I realised that the music of my own home was something many people had never heard. I started playing in schools, then community centres, then festivals, then stages far from Uganda.',
            'That is when I understood what my job really is. It is not only to perform. It is to make a space where culture becomes a conversation.',
          ],
          image: '/OKema/AboutOkema.jpg',
          imageAlt: 'Bosco Okema performing on stage',
          buttons: [{ label: 'DISCOVER THE WORK', href: '/live-performance' }],
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'What I believe',
          heading: 'A few things I hold on to.',
          body: [
            'Music belongs to everyone. You do not need talent to enjoy it, training to play it, or permission to love it.',
            'Culture is living. It grows, it changes, it travels, and that is how it stays alive.',
            'The audience is half the band. Every performance is made with the room, never at it.',
          ],
        },
      },
      {
        type: 'QUOTE',
        content: {
          quote: 'The song is never finished. It is only waiting for the next person to sing it.',
          attribution: 'A saying from my grandfather',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'WORK WITH ME',
          headline: 'Schools, festivals, community events and private celebrations.',
          buttons: BOOK_BUTTONS,
        },
      },
    ],
  },
  {
    slug: 'contact',
    path: '/contact',
    title: 'Contact',
    summary: 'Email, phone and message form',
    sections: [
      {
        type: 'HERO',
        content: {
          headline: 'Get in touch.',
          description:
            'Bookings, press questions, collaborations, or you just want to say hello. I read every message myself.',
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'DIRECT LINES',
          heading: 'Where to find me.',
          body: [
            'Email: okemabosco18@gmail.com',
            'Phone and WhatsApp: +1 (240) 926-0614',
            'Based in Kampala, Uganda, and available to travel across East Africa and beyond.',
          ],
        },
      },
      {
        type: 'CONTACT_FORM',
        content: {
          eyebrow: 'SEND A MESSAGE',
          heading: 'Tell me what you need.',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'BOOKING INQUIRIES',
          headline: 'Looking to book a performance or a program?',
          buttons: [{ label: 'GO TO BOOKING FORM', href: '/book' }],
        },
      },
    ],
  },
  {
    slug: 'book',
    path: '/book',
    title: 'Book Bosco',
    summary: 'Booking request form',
    sections: [
      {
        type: 'HERO',
        content: {
          headline: 'Book Bosco.',
          description:
            'Tell me about your event and I will come back with availability, suggested formats and pricing within two or three business days.',
        },
      },
      {
        type: 'BOOKING_FORM',
        content: {
          eyebrow: 'BOOKING REQUEST',
          heading: 'Start the conversation.',
        },
      },
      {
        type: 'FAQ',
        content: {
          eyebrow: 'GOOD TO KNOW',
          heading: 'Questions people ask before booking.',
          items: [
            {
              question: 'How far in advance should I book?',
              answer:
                'Three months is comfortable for festivals and larger events. Shorter notice is often possible, so it is always worth asking.',
            },
            {
              question: 'Do you travel outside Uganda?',
              answer:
                'Yes. Travel across East Africa and internationally is part of the work, and costs are quoted with the engagement.',
            },
            {
              question: 'Can you adapt to a specific theme?',
              answer:
                'Yes. School programs, cultural days, weddings and corporate events are all shaped around the occasion.',
            },
          ],
        },
      },
    ],
  },
  {
    slug: 'book/live-performance',
    path: '/book/live-performance',
    title: 'Book a Live Performance',
    summary: 'Shortcut into the booking form',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'BOOK • LIVE PERFORMANCE',
          headline: 'Book a live performance.',
          description:
            'Use the booking form and choose “Live Performance”, or browse the formats first.',
          buttons: [
            { label: 'GO TO BOOKING FORM', href: '/book' },
            { label: 'SEE THE FORMATS', href: '/live-performance', variant: 'outline' },
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'FORMATS',
          headline: 'Solo, small ensemble or full band, matched to your venue.',
          buttons: [{ label: 'VIEW LIVE PERFORMANCE', href: '/live-performance' }],
        },
      },
    ],
  },
  {
    slug: 'education',
    path: '/education',
    title: 'Education',
    summary: 'School residencies and elderly visits',
    defaultHeroImage: '/OKema/schoolresidency5.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          headline: 'Music as a way of learning.',
          description:
            'Interactive programs that bring Ugandan culture into classrooms, senior communities and organisations.',
        },
      },
      {
        type: 'SERVICES',
        content: {
          eyebrow: 'PROGRAMS',
          heading: 'Two programs, one idea: music that connects people.',
          items: [
            {
              title: 'SCHOOL RESIDENCY',
              subtitle: 'Bring Uganda into your classroom',
              description:
                'Hands-on sessions with traditional instruments, rhythm, storytelling and cultural learning for students of all ages.',
              href: '/education/school-residency',
              image: '/OKema/schoolresidency6.jpeg',
            },
            {
              title: 'ELDERLY VISITS',
              subtitle: 'Music that connects generations',
              description:
                'Gentle live performances for senior communities, assisted living, memory care and senior centres.',
              href: '/education/elderly-visits',
              image: '/OKema/PrimRoseElders9.jpeg',
            },
            {
              title: 'CUSTOM PROGRAMS',
              subtitle: 'Workshops and cultural days',
              description:
                'Festivals, corporate events and community days built around what your group wants to explore.',
              href: '/contact',
              image: '/OKema/culturePerformance.JPG',
            },
          ],
        },
      },
      {
        type: 'TESTIMONIALS',
        content: {
          eyebrow: 'In their words',
          heading: 'What teachers and carers say.',
          limit: 6,
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'CUSTOM PROGRAMS',
          headline: 'Looking for something specific?',
          buttons: [
            { label: 'START THE CONVERSATION', href: '/book' },
            { label: 'CONTACT BOSCO', href: '/contact', variant: 'outline' },
          ],
        },
      },
    ],
  },
  {
    slug: 'education/school-residency',
    path: '/education/school-residency',
    title: 'School Residency',
    summary: 'Classroom programs',
    defaultHeroImage: '/OKema/schoolresidency1.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'EDUCATION • SCHOOL RESIDENCY',
          headline: 'Bring Uganda into your classroom.',
          description:
            'Students meet the instruments, the music, the rhythms and the stories of Uganda up close.',
          image: '/OKema/schoolresidency1.jpeg',
          imageAlt: 'Students taking part in a music session',
          buttons: [{ label: 'REQUEST A SCHOOL PROGRAM', href: '/book' }],
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'WHAT STUDENTS EXPERIENCE',
          heading: 'Every session is built to be handled, not just watched.',
          body: [
            'Traditional instruments: hands-on time with the Adungu, thumb piano, percussion, guitar and voice.',
            'Music and rhythm: call-and-response songs, polyrhythms and group percussion that gets the room moving.',
            'Storytelling: folktales and personal narratives that connect the music to the culture.',
            'Participation: students sing, play, dance and ask questions throughout.',
          ],
        },
      },
      {
        type: 'FAQ',
        content: {
          eyebrow: 'PROGRAM FORMATS',
          heading: 'Choose the shape that fits your timetable.',
          items: [
            {
              question: 'Single workshop | 1-2 hours, ideal for a cultural day or a music class.',
              answer:
                'A focused visit that fits inside a normal school day. All instruments are provided.',
            },
            {
              question: 'Multi-day residency | 2-5 days, building across sessions.',
              answer:
                'Deeper learning that ends with a short student performance for the school or for parents.',
            },
            {
              question: 'School-wide assembly | 45-60 minutes.',
              answer:
                'A high-energy introduction to Ugandan music for the whole school in one sitting.',
            },
            {
              question: 'Grade-level presentations | 30-60 minutes each.',
              answer: 'Age-appropriate sessions from Early Years through to High School.',
            },
          ],
        },
      },
      {
        type: 'TESTIMONIALS',
        content: {
          eyebrow: 'In their words',
          heading: 'What teachers say.',
          limit: 6,
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'NEXT STEP',
          headline: 'Ready to bring Ugandan music to your students?',
          buttons: [
            { label: 'REQUEST A SCHOOL PROGRAM', href: '/book' },
            { label: 'ASK A QUESTION', href: '/contact', variant: 'outline' },
          ],
        },
      },
    ],
  },
  {
    slug: 'education/elderly-visits',
    path: '/education/elderly-visits',
    title: 'Elderly Visits',
    summary: 'Live music for senior communities',
    defaultHeroImage: '/OKema/PrimRoseElders6.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'EDUCATION • ELDERLY VISITS',
          headline: 'Music that connects generations.',
          description:
            'Gentle, joyful visits to senior communities, designed to spark memories and brighten the day.',
          image: '/OKema/PrimRoseElders6.jpeg',
          imageAlt: 'Residents enjoying a live music session',
          buttons: [{ label: 'SCHEDULE A PERFORMANCE', href: '/book' }],
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'WHY IT MATTERS',
          heading: 'Live music does something a recording cannot.',
          body: [
            'Music has a way of waking up memories, sparking smiles and lifting spirits, which matters most for people living with isolation or cognitive decline.',
            'Live music in the room creates shared moments between residents, staff, family and the musician.',
            'Songs and stories from Uganda also open a window to another culture, which keeps conversations going long after the visit.',
          ],
        },
      },
      {
        type: 'FAQ',
        content: {
          eyebrow: 'WHERE I VISIT',
          heading: 'Programs for every kind of senior community.',
          items: [
            {
              question: 'Assisted living and independent living | group sessions of any size.',
              answer: 'Flexible in length, from thirty minutes to a full afternoon.',
            },
            {
              question: 'Memory care and dementia care | gentle, familiar repertoire.',
              answer: 'Sessions are shaped around the room and what it responds to.',
            },
            {
              question: 'Senior centres and adult day programs | interactive music making.',
              answer: 'Call-and-response songs and instruments the group can try.',
            },
            {
              question: 'Hospice, palliative care and church groups | quiet instrumental visits.',
              answer: 'Shorter, calmer sets for smaller rooms and one-to-one moments.',
            },
          ],
        },
      },
      {
        type: 'TESTIMONIALS',
        content: {
          eyebrow: 'In their words',
          heading: 'What families and activity directors share.',
          limit: 6,
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'NEXT STEP',
          headline: 'Ready to bring music to your community?',
          buttons: [
            { label: 'SCHEDULE A PERFORMANCE', href: '/book' },
            { label: 'ASK A QUESTION', href: '/contact', variant: 'outline' },
          ],
        },
      },
    ],
  },
  {
    slug: 'events',
    path: '/events',
    title: 'Events',
    summary: 'Upcoming and past performances',
    defaultHeroImage: '/OKema/pic3.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          headline: 'Performances and engagements.',
          description:
            'From intimate community gatherings to festival stages, here is where I am playing next.',
        },
      },
      {
        type: 'EVENTS',
        content: {
          eyebrow: 'DATES',
          heading: 'Upcoming events.',
          limit: 20,
          viewAllHref: '/events',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'BRING ME TO YOUR TOWN',
          headline: 'Want Bosco at your next event?',
          buttons: [{ label: 'BOOK BOSCO', href: '/book' }],
        },
      },
    ],
  },
  {
    slug: 'listen',
    path: '/listen',
    title: 'Listen',
    summary: 'Recordings, releases and video',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'LISTEN',
          headline: 'The sounds of Uganda, wherever you are.',
          description:
            'Studio recordings, live performances and new releases. Listen here, or follow on your usual platform.',
        },
      },
      {
        type: 'MUSIC',
        content: {
          eyebrow: 'FEATURED MUSIC',
          heading: 'New and notable.',
          limit: 9,
        },
      },
      {
        type: 'FEATURED_VIDEO',
        content: {
          eyebrow: 'VIDEOS',
          heading: 'Watch the performances.',
          videoUrl: '',
          thumbnail: '/OKema/IMG_4864.JPG',
          ctaLabel: 'MORE PERFORMANCES',
          ctaHref: '/media/videos',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'FOLLOW ALONG',
          headline: 'Stream Bosco on your favorite platform.',
          buttons: [
            { label: 'BOOK BOSCO', href: '/book' },
            { label: 'CONTACT', href: '/contact', variant: 'outline' },
          ],
        },
      },
    ],
  },
  {
    slug: 'live-performance',
    path: '/live-performance',
    title: 'Live Performance',
    summary: 'Formats and what is included',
    defaultHeroImage: '/OKema/pic3.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'LIVE PERFORMANCE',
          headline: 'Live music, real connection.',
          description:
            'From the traditional Adungu harp to new original songs, this is the sound of Uganda played live. Solo, small ensemble or full band.',
          image: '/OKema/pic3.jpeg',
          imageAlt: 'Bosco Okema performing with a full ensemble',
          buttons: [{ label: 'REQUEST A PERFORMANCE', href: '/book' }],
        },
      },
      {
        type: 'FAQ',
        content: {
          eyebrow: 'PERFORMANCE FORMATS',
          heading: 'Choose the sound that fits your event.',
          items: [
            {
              question: 'Solo performance | Adungu, thumb piano, percussion and voice.',
              answer: 'Perfect for smaller venues, house concerts, intimate ceremonies and warm-up sets.',
            },
            {
              question: 'Small ensemble | two to four performers.',
              answer: 'A richer sound with extra percussion, vocals and melodic instruments.',
            },
            {
              question: 'Full band | five or more performers.',
              answer: 'Traditional and modern instrumentation, harmonies and a rhythm section for festivals and large halls.',
            },
          ],
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'IDEAL FOR',
          heading: 'Where this works best.',
          body: [
            'Concerts and recitals, festivals and cultural days, weddings and ceremonies.',
            'Fundraisers and galas, churches and places of worship, community events.',
            'Private celebrations, corporate events and organisational gatherings.',
          ],
        },
      },
      {
        type: 'FEATURED_VIDEO',
        content: {
          eyebrow: 'SEE IT LIVE',
          heading: 'A look at a recent performance.',
          videoUrl: '',
          thumbnail: '/OKema/IMG_4864.JPG',
          ctaLabel: 'MORE LIVE FOOTAGE',
          ctaHref: '/media/videos',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'BOOKING',
          headline: 'Tell me about your event and I will suggest a format.',
          buttons: BOOK_BUTTONS,
        },
      },
    ],
  },
  {
    slug: 'media',
    path: '/media',
    title: 'Media',
    summary: 'Photos, videos, press and stories',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA',
          headline: 'Images, stories and sounds.',
          description:
            'A visual archive of performances, cultural moments and stories, from the stage to the classroom.',
        },
      },
      {
        type: 'GALLERY',
        content: {
          eyebrow: 'GALLERY',
          heading: 'Moments from the road.',
          images: [
            '/OKema/AboutOkema.jpg',
            '/OKema/culturePerformance.JPG',
            '/OKema/liveperformance1.JPG',
            '/OKema/schoolresidency2.jpg',
            '/OKema/schoolresidency4.jpeg',
            '/OKema/PrimRoseElders4.jpeg',
            '/OKema/pic7.png',
            '/OKema/pic5.png',
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'PRESS AND STORIES',
          headline: 'Working on a feature or need press material?',
          buttons: [{ label: 'GET IN TOUCH', href: '/contact' }],
        },
      },
    ],
  },
  {
    slug: 'media/photos',
    path: '/media/photos',
    title: 'Photos',
    summary: 'Photo gallery',
    defaultHeroImage: '/OKema/schoolresidency15.jpeg',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA • GALLERY',
          headline: 'Photos.',
          description: 'On stage, in the classroom and behind the scenes.',
        },
      },
      {
        type: 'GALLERY',
        content: {
          heading: 'The collection',
          images: [
            '/OKema/AboutOkema.jpg',
            '/OKema/pic4.jpeg',
            '/OKema/IMG_4864.JPG',
            '/OKema/culturePerformance.JPG',
            '/OKema/liveperformance1.JPG',
            '/OKema/schoolresidency3.jpg',
            '/OKema/PrimRoseElders6.jpeg',
          ],
        },
      },
    ],
  },
  {
    slug: 'media/videos',
    path: '/media/videos',
    title: 'Videos',
    summary: 'Live and in-studio video',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA • VIDEOS',
          headline: 'Videos.',
          description: 'Live recordings and studio sessions, filmed as they happened.',
        },
      },
      {
        type: 'VIDEO',
        content: {
          eyebrow: 'FEATURED',
          heading: 'Live at the Kampala National Theatre',
          videoUrl: '/OKema/video.mp4',
          description: 'Bosco in full flow, with the adungu and the ensemble on stage.',
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'MORE',
          headline: 'Looking for a specific performance?',
          buttons: [{ label: 'GET IN TOUCH', href: '/contact' }],
        },
      },
    ],
  },
  {
    slug: 'media/instruments',
    path: '/media/instruments',
    title: 'Instrument Gallery',
    summary: 'Handmade instruments',
    defaultHeroImage: '/OKema/pic8.png',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA • INSTRUMENT GALLERY',
          headline: 'The instruments.',
          description:
            'Bosco builds and plays his own traditional Ugandan instruments from wood, gourds and animal skins. Each one is a one-off piece of work.',
        },
      },
      {
        type: 'INSTRUMENTS',
        content: {
          eyebrow: 'SOUNDS OF UGANDA',
          heading: 'Handmade tools of sound.',
        },
      },
      {
        type: 'VIDEO',
        content: {
          eyebrow: 'THE MUSIC IN MOTION',
          heading: 'Hear them played.',
          videoUrl: '/OKema/video.mp4',
        },
      },
    ],
  },
  {
    slug: 'media/press',
    path: '/media/press',
    title: 'Press',
    summary: 'Press features',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA • PRESS',
          headline: 'In the press.',
          description: 'Interviews, features and coverage from Uganda and beyond.',
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'COVERAGE',
          heading: 'Selected features.',
          body: [
            'Featured in national and international outlets covering traditional music, cultural education and touring.',
            'For interviews, images or quotes, write to okemabosco18@gmail.com and I will respond personally.',
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'PRESS ENQUIRIES',
          headline: 'Need images, biography or a quote?',
          buttons: [{ label: 'CONTACT', href: '/contact' }],
        },
      },
    ],
  },
  {
    slug: 'media/articles',
    path: '/media/articles',
    title: 'Articles',
    summary: 'Journal and writing',
    sections: [
      {
        type: 'HERO',
        content: {
          eyebrow: 'MEDIA • ARTICLES',
          headline: 'From the journal.',
          description: 'Writing about the music, the culture and the work.',
        },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'STORIES',
          heading: 'Recent pieces.',
          body: [
            'The Story of the Adungu: how the bow harp carries the voices of my ancestors, and what it means to play it today.',
            'Music in the Classroom: five things I learned across ten years of school residencies.',
            'Why I Play for Seniors: a letter from a daughter, a room in silence, and the song that opened a memory.',
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'MORE STORIES',
          headline: 'New writing is published regularly.',
          buttons: [{ label: 'GET IN TOUCH', href: '/contact' }],
        },
      },
    ],
  },
  {
    slug: 'privacy',
    path: '/privacy',
    title: 'Privacy Policy',
    summary: 'How personal data is handled',
    sections: [
      {
        type: 'HERO',
        content: { eyebrow: 'LEGAL', headline: 'Privacy Policy' },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'YOUR DATA',
          heading: 'What we collect and why.',
          body: [
            'Bosco Okema is committed to protecting your privacy. This policy explains how we collect, use and safeguard your information when you visit this website or use our services.',
            'We collect contact details you provide through booking, contact or newsletter forms, along with the event details you submit.',
            'We use that information to respond to inquiries, manage bookings, send occasional newsletters and improve the website.',
            'We never sell or rent personal information. We share it only with service providers essential to delivering our services, or where the law requires it.',
            'You can request access, correction or deletion of your information at any time by writing to okemabosco18@gmail.com.',
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'QUESTIONS',
          headline: 'Something in this policy you want clarified?',
          buttons: [{ label: 'CONTACT', href: '/contact' }],
        },
      },
    ],
  },
  {
    slug: 'terms',
    path: '/terms',
    title: 'Terms of Service',
    summary: 'Terms for bookings and use of the site',
    sections: [
      {
        type: 'HERO',
        content: { eyebrow: 'LEGAL', headline: 'Terms of Service' },
      },
      {
        type: 'RICH_TEXT',
        content: {
          eyebrow: 'THE DETAILS',
          heading: 'How engagements work.',
          body: [
            'These terms govern your use of this website and the services described on it. By accessing the site or engaging our services you agree to them.',
            'Services include live performances, educational programs, workshops and appearances. Each engagement is confirmed in writing with scope, dates, fees and responsibilities.',
            'A booking is confirmed once a deposit is received or a written agreement is signed. Cancellation terms are agreed for each engagement.',
            'Payment terms are set out in the confirmation for each engagement, and invoices are due in full before the performance date unless agreed otherwise.',
            'All content on this website, including music, recordings, photographs, text and the Bosco Okema name and brand, remains the property of Bosco Okema and is protected by copyright and trademark law.',
            'The website and services are provided on an “as is” basis, and our total liability under any engagement is limited to the fees already paid for it.',
          ],
        },
      },
      {
        type: 'CTA',
        content: {
          eyebrow: 'CONTACT',
          headline: 'Questions about these terms?',
          buttons: [{ label: 'GET IN TOUCH', href: '/contact' }],
        },
      },
    ],
  },
];

export function getSitePageTemplate(slug: string): SitePageTemplate | undefined {
  return SITE_PAGES.find((p) => p.slug === slug);
}
