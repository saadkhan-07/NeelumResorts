/**
 * Page copy that has no database model.
 *
 * Rooms, tours, fares and settings all come from the database — nothing below is
 * any of those. What is left is the design's own editorial: section headings, the
 * FAQ, the guest quotes, the stats band and the "what's included" grid. PROMPT.md
 * section 4 defines no model for any of them and Phase 6 gives the owner no screen
 * to edit them, so they are part of the design rather than content, and they live
 * here as one file instead of being scattered through the components.
 *
 * Every string is verbatim from `design-reference/`.
 *
 * If a later phase adds an admin screen for the FAQ or the reviews, this is the
 * file that empties out.
 */

export const SECTIONS = {
  story: {
    eyebrow: "Our story",
    title: "The last stop on the Neelum road.",
    lede: "Taobat is where the valley runs out of road. Past Kel, past Arang Kel, the track narrows, the pine closes in, and the river gets loud. That is where we built.",
    body: [
      "Neelum Resort is a small, family-run property on the riverbank — cedar rooms, a kitchen that cooks what the valley grows, and a courtyard where guests end up sitting long after dinner. There are no lobbies, lifts or buffet queues here. There is a river, a fire, and mountains on every side.",
      "Most of our guests arrive tired from the drive and leave saying it was worth it. That is the whole idea.",
    ],
    link: "See where you'll stay",
  },
  stays: {
    eyebrow: "Where you'll stay",
    title: "Four rooms, all facing the water",
    lede: "Every room is timber-lined and heated, with an attached bathroom and hot water round the clock. Message us with your dates and we'll confirm what's free.",
    cta: "View all stays",
  },
  experiences: {
    eyebrow: "What's included",
    title: "Everything the valley does well, and nothing it doesn't.",
  },
  tours: {
    eyebrow: "Jeep tours",
    title: "We'll take you the rest of the way",
    lede: "Our own 4x4s and drivers run the length of Neelum Valley. Pick a destination, tell us where you are, and we'll sort the jeep.",
    cta: "See all jeep tours",
  },
  dining: {
    eyebrow: "The kitchen",
    title: "Trout from the river, roti from the tandoor.",
    lede: "Three meals a day, cooked to order. No buffet, no menu card the length of your arm — just what is fresh that morning.",
    body: [
      "Breakfast is parathas, omelette, honey and endless chai on the balcony. Lunch travels with you if you're heading up to Arang Kel. Dinner is trout or desi chicken by the fire, finished with saffron kahwa.",
      "Tell us what you can and can't eat when you book and the kitchen will plan around it.",
    ],
    link: "Ask about meals",
    wa: "Assalam o Alaikum! I'd like to ask about meals at Neelum Resort Taobat.",
  },
  gallery: {
    eyebrow: "Gallery",
    title: "Taobat, as our guests find it",
    cta: "Open full gallery",
  },
  reviews: {
    eyebrow: "Guest reviews",
    // The numbers are filled in from Settings at render time.
    title: "{score} out of 5, from {count} guests",
  },
  location: {
    eyebrow: "Finding us",
    title: "Neelum Valley Road, Taobat",
    lede: "The drive is long and the last stretch is rough — but every guest tells us the same thing when they arrive.",
  },
  faq: {
    eyebrow: "Before you come",
    title: "Questions guests ask us",
  },
} as const;

/* The score and count come from Settings — the real listing already reads 704,
   and it moves every week. Only the button label is fixed copy. */
export const RATING = {
  readOn: "Read on Google",
} as const;

export const STATS = [
  { value: "7,500", label: "feet above sea" },
  { value: "12°C", label: "average summer night" },
  { value: "4", label: "room types" },
  { value: "4.9", label: "Google rating" },
] as const;

/** The eight-card grid on the homepage. `icon` keys into `components/icons.tsx`. */
export const EXPERIENCES = [
  {
    icon: "flame",
    title: "Bonfire nights",
    body: "Wood is lit on the riverbank after dinner, weather permitting — chairs, chai and a sky full of stars.",
  },
  {
    icon: "teapot",
    title: "Kashmiri kahwa",
    body: "Saffron kahwa served through the day, on the balcony or down by the water.",
  },
  {
    icon: "leaf",
    title: "Trout & local kitchen",
    body: "Fresh river trout, desi chicken, saag and tandoori roti — cooked to order, not from a buffet.",
  },
  {
    icon: "mountain",
    title: "Jeep tours",
    body: "Our own 4x4s and drivers to Arang Kel, Ratti Gali, Baboon Valley and Taobat — from anywhere in the valley.",
  },
  {
    icon: "moon",
    title: "Stargazing",
    body: "No streetlights for miles. On a clear night you can see the Milky Way from the courtyard.",
  },
  {
    icon: "jeep",
    title: "Parking & jeep transfer",
    body: "Secure parking on site, and 4x4 transfer from Kel arranged on request.",
  },
  {
    icon: "signal",
    title: "Power & connectivity",
    body: "Backup power through the evening. Mobile signal is limited — that is rather the point.",
  },
  {
    icon: "star",
    // No number here on purpose: it would be a fourth place to keep in step.
    title: "Rated 4.9 on Google",
    body: "Hundreds of reviews from guests who made it to the last village in the valley.",
  },
] as const;

/** The four-card grid on /stays. */
export const ROOM_INCLUDES = {
  eyebrow: "In every room",
  title: "The things we don't charge extra for",
  items: [
    {
      icon: "flame",
      title: "Hot water, always",
      body: "Round-the-clock hot water in every attached bathroom, even on the coldest nights.",
    },
    {
      icon: "leaf",
      title: "Heating & quilts",
      body: "A heater in every room and as many quilts as you ask for.",
    },
    {
      icon: "teapot",
      title: "Chai and kahwa",
      body: "Served through the day wherever you're sitting — balcony, courtyard or riverbank.",
    },
    {
      icon: "jeep",
      title: "Parking",
      body: "Secure on-site parking, and a 4x4 transfer from Kel if your car can't make the last stretch.",
    },
  ],
} as const;

/** The three-step strip on /tours and the homepage tours section — PROMPT.md § 5c. */
export const TOUR_STEPS = [
  {
    n: "1",
    title: "Pick where you want to go",
    body: "Lakes, meadows and side valleys across Neelum — from a half day to two days out.",
  },
  {
    n: "2",
    title: "Tell us where you are",
    body: "We run jeeps the length of the valley, from Muzaffarabad up to Taobat. You don't have to start at the resort.",
  },
  {
    n: "3",
    title: "We confirm on WhatsApp",
    body: "Published fares for the routes we run every week, and a same-day quote for anywhere else.",
  },
] as const;

/** The "Our jeeps" split on /tours. */
export const JEEP_FLEET = {
  eyebrow: "Our jeeps",
  title: "Local drivers who know the road",
  lede: "Every trip runs in our own 4x4s with a driver who has driven this valley for years.",
  link: "Ask us anything",
  wa: "Assalam o Alaikum! I'd like to ask about your jeep tours.",
} as const;

/* QUOTES removed 20 Sep 2026. It held three invented testimonials with invented
   names and cities, shown on a live commercial site as real guest reviews.
   Real reviews now live in the `Review` table and are edited at /admin/reviews. */

export const FAQ = [
  {
    q: "How do I reach Taobat?",
    a: "Taobat is the last village in Neelum Valley, about 250 km from Muzaffarabad. Most guests drive to Kel and continue the final stretch by 4x4 — the road is unpaved in places. We can arrange a jeep transfer from Kel if you tell us your arrival time in advance.",
  },
  {
    q: "When is the best time to visit?",
    a: "May to early October. The valley is green from June, the river is at its fullest in July and August, and September brings clear skies and cooler nights. The road is usually closed by snow from late November.",
  },
  {
    q: "Is there mobile signal and internet?",
    a: "Signal is limited and depends on your network — expect patches rather than coverage. We have backup power in the evenings. Please tell family you may be offline for a day or two.",
  },
  {
    q: "What food is served?",
    a: "A home kitchen rather than a menu card. Breakfast, lunch and dinner are cooked fresh — river trout, desi chicken, saag, daal and tandoori roti. Tell us about any dietary needs when you book.",
  },
  {
    q: "What are the check-in and check-out times?",
    a: "Check-in from 1:00 pm, check-out by 11:00 am. If you are arriving late after a long drive, message us on WhatsApp and we will keep dinner ready.",
  },
  {
    q: "How do I confirm a booking?",
    a: "Message us on WhatsApp with your dates and the number of guests. We will confirm availability, share current rates and take an advance to hold the room.",
  },
] as const;

/** The homepage "Finding us" list. */
export const LOCATION_FACTS = [
  {
    icon: "pin",
    label: "Address",
    // `address` and the plus code come from Settings; the plus code is appended by
    // the page so the owner can change the address without losing it.
    plusCode: "Plus code PPF5+VR",
  },
  {
    icon: "jeep",
    label: "Getting here",
    body: "Muzaffarabad → Kel is roughly 8–10 hours. Kel → Taobat is 2–3 hours by 4x4. We can arrange the jeep from Kel.",
  },
  {
    icon: "clock",
    label: "Season",
    body: "Open May to late October, weather permitting. Check-in 1:00 pm · Check-out 11:00 am.",
  },
] as const;

/** /contact — the direct-contact list beside the form. */
export const CONTACT_FACTS = {
  formEyebrow: "Send an enquiry",
  formTitle: "Tell us your dates",
  formIntro:
    "Fill this in and it opens WhatsApp with your details ready to send — no email, no waiting.",
  listEyebrow: "Direct contact",
  listTitle: "Reach us",
  hours: "8:00 am – 11:00 pm, daily through the season",
  drive:
    "Muzaffarabad → Kel: 8–10 hrs. Kel → Taobat: 2–3 hrs by 4x4. Jeep transfer from Kel on request.",
  plusCode: "Azad Jammu & Kashmir · Plus code PPF5+VR",
  geo: "34.7247°N, 74.7096°E · PPF5+VR",
  mapEmbed: "https://maps.google.com/maps?q=34.7247131,74.7096112&z=13&output=embed",
} as const;

/** Page headers — the `.page-head` band on every inner route. */
export const PAGE_HEADS = {
  stays: {
    image: "hero-2.jpg",
    crumb: "Stays",
    title: "Where you'll stay",
    lede: "Four rooms, all timber-lined, all heated, all within earshot of the river. Message us with your dates and we'll confirm what's free.",
  },
  tours: {
    image: "tours-header.jpg",
    crumb: "Jeep Tours",
    title: "Jeep tours across the valley",
    lede: "Our own 4x4s and drivers. Pick a destination, tell us where you're starting from, and we'll sort the rest.",
  },
  gallery: {
    image: "g4.jpg",
    crumb: "Gallery",
    title: "The valley, all year",
    lede: "Taobat changes completely between May and October. These are the rooms, the river and the light our guests come back for.",
  },
  contact: {
    image: "hero-1.jpg",
    crumb: "Contact",
    title: "Get in touch",
    lede: "The fastest way to reach us is WhatsApp. We answer between 8:00 am and 11:00 pm, and usually within the hour.",
  },
} as const;

/** The dark band at the foot of every page. */
export const CTA_BANDS = {
  home: {
    eyebrow: "Ready when you are",
    title: "Rooms go quickly in July and August.",
    body: "Send us your dates on WhatsApp and we'll come back with availability and today's rate — usually within the hour.",
  },
  stays: {
    title: "Tell us your dates.",
    body: "We'll confirm what's free and share the current rate — usually within the hour.",
  },
  tours: {
    title: "Where are you starting from?",
    body: "Send us your location and dates. We'll tell you what the jeep costs from there, usually within the hour.",
    wa: "Assalam o Alaikum! I'd like to ask about a jeep tour. I'll be starting from:",
    cta: "Get a fare",
  },
  gallery: {
    title: "See it for yourself.",
    body: "Send us your dates and we'll tell you what's free.",
  },
  contact: {
    title: "Still deciding?",
    body: "Message us anyway. We'll tell you honestly whether the road is open and what the weather is doing.",
    wa: "Assalam o Alaikum! I have a question about visiting Neelum Resort Taobat.",
    cta: "Ask us anything",
  },
} as const;

/* The Phase 3 image maps (HERO_SLIDES, HOME_GALLERY, FULL_GALLERY, SLOT_IMAGES,
   SLUG_IMAGES) are gone: every photograph now comes from a `Media` row, and the
   `/ref-images` route that served them off disk was deleted with them. */
