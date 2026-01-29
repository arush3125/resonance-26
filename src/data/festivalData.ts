// RESONANCE - Festival Data
// All event and configuration data - easy to edit

export const festivalInfo = {
  name: "RESONANCE",
  tagline: "Celebrating Creativity, Innovation & Talent",
  dates: {
    start: "2025-02-27",
    end: "2025-02-28",
  },
  venue: {
    name: "Central University Campus",
    address: "University Road, New Delhi - 110001",
    mapUrl: "https://maps.google.com/?q=Central+University+Delhi",
  },
  contact: {
    email: "resonance26@university.edu",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
  },
  social: {
    instagram: "https://instagram.com/resonance26",
    youtube: "https://youtube.com/@resonance26",
    twitter: "https://twitter.com/resonance26",
  },
};

export interface Event {
  id: string;
  name: string;
  category: "music" | "dance" | "tech" | "fun" | "culture" | "gaming";
  description: string;
  rules: string[];
  entryFee: number;
  teamSize: { min: number; max: number };
  prizePool: number;
  date: string;
  time: string;
  venue: string;
  image: string;
}

export interface AuditionEvent {
  id: string;
  name: string;
  category: "dance" | "singing" | "instrument" | "fashion";
  description: string;
  rules: string[];
  formUrl: string;
  date: string;
  time: string;
  venue: string;
  image: string;
}

export const events: Event[] = [
  {
    id: "treasure-hunt",
    name: "Treasure Hunt",
    category: "fun",
    description: "Solve clues, race against time, find the treasure! The ultimate campus adventure.",
    rules: [
      "Team of 3-4 members",
      "2-hour time limit",
      "No vehicles allowed",
      "Smartphones required for clues",
    ],
    entryFee: 100,
    teamSize: { min: 3, max: 4 },
    prizePool: 25000,
    date: "2025-02-27",
    time: "1:30 PM",
    venue: "Starting: Main Gate",
    image: "/events/treasure-hunt.jpg",
  },
  {
    id: "pot-painting",
    name: "Pot Painting",
    category: "culture",
    description: "Unleash your creativity on canvas. Paint beautiful designs on terracotta pots.",
    rules: [
      "Solo participation",
      "2-hour time limit",
      "Materials provided",
      "Theme announced on spot",
    ],
    entryFee: 100,
    teamSize: { min: 1, max: 1 },
    prizePool: 10000,
    date: "2025-02-28",
    time: "1:00 PM",
    venue: "Art Room",
    image: "/events/pot-painting.jpg",
  },
  {
    id: "rangoli",
    name: "Rangoli",
    category: "culture",
    description: "Create stunning colorful patterns. Traditional art form meets modern creativity.",
    rules: [
      "Solo or team of 2-4 members",
      "3-hour time limit",
      "Colors provided",
      "Theme: Traditional Indian Culture",
    ],
    entryFee: 100,
    teamSize: { min: 1, max: 4 },
    prizePool: 15000,
    date: "2025-02-28",
    time: "1:00 PM",
    venue: "Open Ground",
    image: "/events/rangoli.jpg",
  },
  {
    id: "debate",
    name: "Debate Competition",
    category: "culture",
    description: "Battle of wits and words. Argue, persuade, and win with your logical reasoning.",
    rules: [
      "Team of 2 members",
      "Topics given on spot",
      "5-minute speaking time per member",
      "No personal attacks",
    ],
    entryFee: 100,
    teamSize: { min: 2, max: 2 },
    prizePool: 12000,
    date: "2025-02-28",
    time: "1:00 PM",
    venue: "Seminar Hall",
    image: "/events/debate.jpg",
  },
  {
    id: "standup-comedy",
    name: "Stand-up Comedy",
    category: "fun",
    description: "Make them laugh! Comedy competition for the wittiest performers.",
    rules: [
      "Solo participation",
      "5-minute set",
      "No offensive content",
      "Original material preferred",
    ],
    entryFee: 100,
    teamSize: { min: 1, max: 1 },
    prizePool: 15000,
    date: "2025-02-28",
    time: "4:00 PM",
    venue: "Auditorium",
    image: "/events/standup.jpg",
  },
  {
    id: "rap-beatboxing",
    name: "Rap/Beatboxing",
    category: "music",
    description: "Urban beats and rhymes. Rap and beatboxing competition for street artists.",
    rules: [
      "Solo participation",
      "4-minute performance",
      "Original content encouraged",
      "No explicit lyrics",
    ],
    entryFee: 100,
    teamSize: { min: 1, max: 1 },
    prizePool: 18000,
    date: "2025-02-27",
    time: "6:00 PM",
    venue: "Open Mic Stage",
    image: "/events/rap-beatbox.jpg",
  },
];

export const schedule = [
  {
    day: 1,
    date: "2025-02-27",
    title: "TRADITIONAL DAY",
    events: [
      { time: "12:30 PM", name: "Flash Mob", venue: "Campus Ground" },
      { time: "1:30 PM", name: "Treasure Hunt", venue: "Main Gate" },
      { time: "4:00 PM", name: "Stage Events", venue: "Main Stage" },
    ],
  },
  {
    day: 2,
    date: "2025-02-28",
    title: "WESTERN DAY",
    events: [
      { time: "1:00 PM", name: "Pot Painting", venue: "Art Room" },
      { time: "1:00 PM", name: "Rangoli", venue: "Open Ground" },
      { time: "1:00 PM", name: "Debate", venue: "Seminar Hall" },
      { time: "3:30 PM", name: "On Stage Event", venue: "Main Stage" },
    ],
  },
];

export const auditionEvents: AuditionEvent[] = [
  {
    id: "dance-audition",
    name: "Dance Competition",
    category: "dance",
    description: "Express yourself through movement. Show your dancing skills and compete with the best performers.",
    rules: [
      "Solo or group participation",
      "3-minute performance limit",
      "Any dance style allowed",
      "Music submission required",
      "Costumes and props allowed",
    ],
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSe520vOiAUKrOl0OLbPAgWEU6YqcoA7V0pEQ1Wk1RVsY9cGWQ/viewform?usp=dialog",
    date: "2025-02-27",
    time: "3:00 PM",
    venue: "Dance Hall",
    image: "/events/dance.jpg",
  },
  {
    id: "singing-audition",
    name: "Singing Competition",
    category: "singing",
    description: "Showcase your vocal talent. Solo singing competition across all genres.",
    rules: [
      "Solo participation only",
      "3-minute performance",
      "Karaoke track allowed",
      "No vulgar lyrics",
      "Original compositions welcome",
    ],
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf6XaVy-I7SVjSu1gF_nG9jkxDgKrMZ_uVzNvLMohaLTHDAmg/viewform?usp=dialog",
    date: "2025-02-27",
    time: "5:00 PM",
    venue: "Music Room",
    image: "/events/singing-solo.jpg",
  },
  {
    id: "instrument-audition",
    name: "Musical Instruments",
    category: "instrument",
    description: "Instrumental mastery competition. Showcase your skills on any instrument.",
    rules: [
      "Solo or group participation (1-10 members)",
      "5-minute performance",
      "Any instrument allowed",
      "Bring your own instrument",
      "Both classical and modern welcome",
    ],
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf9IVmhbfoQkOsF6-HxRj5Z9b6f7ixFY4l6eTN8aVGmaIRGQw/viewform?usp=dialog",
    date: "2025-02-27",
    time: "2:00 PM",
    venue: "Music Room",
    image: "/events/instruments.jpg",
  },
  {
    id: "fashion-audition",
    name: "Fashion Show",
    category: "fashion",
    description: "Showcase your style and creativity. Runway competition for fashion enthusiasts.",
    rules: [
      "Solo participation only",
      "5-minute runway presentation",
      "Original designs preferred",
      "Props and accessories allowed",
      "Theme-based presentations welcome",
    ],
    formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf9RkBEPeADIyX4rf0Zk1tnFKT3lYq-vus4s1Za9SauChG87g/viewform?usp=publish-editor",
    date: "2025-02-28",
    time: "5:00 PM",
    venue: "Main Stage",
    image: "/events/fashion-show.jpg",
  },
];

export const sponsors = {
  title: [
    { name: "TechCorp", logo: "/sponsors/techcorp.png" },
  ],
  coSponsors: [
    { name: "MusicBox", logo: "/sponsors/musicbox.png" },
    { name: "GameZone", logo: "/sponsors/gamezone.png" },
    { name: "EduFirst", logo: "/sponsors/edufirst.png" },
  ],
  mediaPartners: [
    { name: "Campus Times", logo: "/sponsors/campustimes.png" },
    { name: "Youth FM", logo: "/sponsors/youthfm.png" },
    { name: "Student TV", logo: "/sponsors/studenttv.png" },
  ],
};

export const highlights = [
  { icon: "🎶", title: "Music", description: "Live bands, DJ nights, and musical battles" },
  { icon: "💃", title: "Dance", description: "From classical to street, every style celebrated" },
  { icon: "🎯", title: "Fun", description: "Treasure hunts, comedy shows, and surprises" },
  { icon: "🎭", title: "Culture", description: "Drama, fashion, photography, and more" },
];

export const categories = [
  { id: "all", name: "All Events", icon: "🎉" },
  { id: "music", name: "Music", icon: "🎶" },
  { id: "dance", name: "Dance", icon: "💃" },
  { id: "fun", name: "Fun", icon: "🎯" },
  { id: "culture", name: "Culture", icon: "🎭" },
];

export const galleryImages = [
  { id: 1, src: "/gallery/img1.jpg", alt: "DJ Night 2025" },
  { id: 2, src: "/gallery/img2.jpg", alt: "Dance Championship" },
  { id: 3, src: "/gallery/img3.jpg", alt: "Crowd Energy" },
  { id: 4, src: "/gallery/img4.jpg", alt: "Band Performance" },
  { id: 5, src: "/gallery/img5.jpg", alt: "Tech Zone" },
  { id: 6, src: "/gallery/img6.jpg", alt: "Fashion Show" },
];
