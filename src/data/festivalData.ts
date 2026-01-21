// VIBRANCE 2026 - Festival Data
// All event and configuration data - easy to edit

export const festivalInfo = {
  name: "VIBRANCE 2026",
  tagline: "Where Music, Madness & Memories Collide",
  dates: {
    start: "2026-03-15",
    end: "2026-03-17",
  },
  venue: {
    name: "Central University Campus",
    address: "University Road, New Delhi - 110001",
    mapUrl: "https://maps.google.com/?q=Central+University+Delhi",
  },
  contact: {
    email: "vibrance2026@university.edu",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
  },
  social: {
    instagram: "https://instagram.com/vibrance2026",
    youtube: "https://youtube.com/@vibrance2026",
    twitter: "https://twitter.com/vibrance2026",
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

export const events: Event[] = [
  {
    id: "dj-battle",
    name: "DJ Battle Royale",
    category: "music",
    description: "Show off your mixing skills in the ultimate DJ showdown. Battle against the best DJs from colleges across the nation.",
    rules: [
      "Solo participation only",
      "Bring your own equipment",
      "15-minute set per round",
      "No pre-recorded sets allowed",
    ],
    entryFee: 500,
    teamSize: { min: 1, max: 1 },
    prizePool: 50000,
    date: "2026-03-15",
    time: "6:00 PM",
    venue: "Main Stage",
    image: "/events/dj-battle.jpg",
  },
  {
    id: "band-wars",
    name: "Band Wars",
    category: "music",
    description: "Unleash your band's energy! Rock, metal, indie, fusion - bring your A-game and own the stage.",
    rules: [
      "Team of 3-8 members",
      "25-minute performance time",
      "Original compositions get bonus points",
      "Instruments provided on request",
    ],
    entryFee: 1500,
    teamSize: { min: 3, max: 8 },
    prizePool: 100000,
    date: "2026-03-16",
    time: "4:00 PM",
    venue: "Main Stage",
    image: "/events/band-wars.jpg",
  },
  {
    id: "street-dance",
    name: "Street Dance Championship",
    category: "dance",
    description: "Hip-hop, breaking, popping, locking - the streets come alive! Solo and crew battles await.",
    rules: [
      "Solo or crew (2-8 members)",
      "4-minute performance limit",
      "Props allowed",
      "Music to be submitted 48 hours prior",
    ],
    entryFee: 800,
    teamSize: { min: 1, max: 8 },
    prizePool: 75000,
    date: "2026-03-15",
    time: "2:00 PM",
    venue: "Dance Arena",
    image: "/events/street-dance.jpg",
  },
  {
    id: "classical-fusion",
    name: "Classical Fusion",
    category: "dance",
    description: "Where tradition meets innovation. Blend classical forms with contemporary styles.",
    rules: [
      "Solo or duet",
      "6-minute performance limit",
      "Original choreography required",
      "Traditional attire mandatory",
    ],
    entryFee: 400,
    teamSize: { min: 1, max: 2 },
    prizePool: 40000,
    date: "2026-03-16",
    time: "11:00 AM",
    venue: "Cultural Center",
    image: "/events/classical-fusion.jpg",
  },
  {
    id: "hackathon",
    name: "Code Surge Hackathon",
    category: "tech",
    description: "24-hour coding marathon. Build, innovate, disrupt. The best hacks win big!",
    rules: [
      "Team of 2-4 members",
      "Problem statements revealed at event start",
      "All tech stacks allowed",
      "Working prototype required for judging",
    ],
    entryFee: 1000,
    teamSize: { min: 2, max: 4 },
    prizePool: 150000,
    date: "2026-03-15",
    time: "9:00 AM",
    venue: "Tech Hub",
    image: "/events/hackathon.jpg",
  },
  {
    id: "robo-wars",
    name: "Robo Wars",
    category: "tech",
    description: "Build battle bots and compete in the arena. Last robot standing wins!",
    rules: [
      "Team of 2-5 members",
      "Weight limit: 15kg",
      "No flammable materials",
      "Remote control required",
    ],
    entryFee: 2000,
    teamSize: { min: 2, max: 5 },
    prizePool: 80000,
    date: "2026-03-17",
    time: "10:00 AM",
    venue: "Robo Arena",
    image: "/events/robo-wars.jpg",
  },
  {
    id: "gaming-valorant",
    name: "Valorant Championship",
    category: "gaming",
    description: "Tactical shooter showdown. Assemble your squad and claim victory!",
    rules: [
      "Team of 5 players",
      "Standard competitive rules apply",
      "PCs provided at venue",
      "Bring your own peripherals",
    ],
    entryFee: 1500,
    teamSize: { min: 5, max: 5 },
    prizePool: 100000,
    date: "2026-03-16",
    time: "9:00 AM",
    venue: "Esports Arena",
    image: "/events/valorant.jpg",
  },
  {
    id: "treasure-hunt",
    name: "Campus Treasure Hunt",
    category: "fun",
    description: "Solve clues, race against time, find the treasure! The ultimate campus adventure.",
    rules: [
      "Team of 3-4 members",
      "3-hour time limit",
      "No vehicles allowed",
      "Smartphones required for clues",
    ],
    entryFee: 300,
    teamSize: { min: 3, max: 4 },
    prizePool: 25000,
    date: "2026-03-15",
    time: "10:00 AM",
    venue: "Starting: Main Gate",
    image: "/events/treasure-hunt.jpg",
  },
  {
    id: "standup-comedy",
    name: "Stand-Up Showdown",
    category: "fun",
    description: "Got jokes? Make the crowd roar with laughter and become the comedy king/queen!",
    rules: [
      "Solo participation",
      "10-minute set",
      "No vulgarity or offensive content",
      "Original material preferred",
    ],
    entryFee: 200,
    teamSize: { min: 1, max: 1 },
    prizePool: 30000,
    date: "2026-03-16",
    time: "7:00 PM",
    venue: "Auditorium",
    image: "/events/standup.jpg",
  },
  {
    id: "drama-fest",
    name: "Natya Utsav",
    category: "culture",
    description: "Stage plays, street plays, nukkad natak - theatre at its finest!",
    rules: [
      "Team of 8-15 members",
      "30-minute performance limit",
      "Props and costumes allowed",
      "Script approval required",
    ],
    entryFee: 1200,
    teamSize: { min: 8, max: 15 },
    prizePool: 60000,
    date: "2026-03-17",
    time: "2:00 PM",
    venue: "Open Air Theatre",
    image: "/events/drama.jpg",
  },
  {
    id: "fashion-show",
    name: "Runway Revolution",
    category: "culture",
    description: "Walk the ramp, set trends, make statements. Fashion meets expression!",
    rules: [
      "Team of 10-20 members",
      "12-minute performance",
      "Theme-based round included",
      "No inappropriate attire",
    ],
    entryFee: 2500,
    teamSize: { min: 10, max: 20 },
    prizePool: 75000,
    date: "2026-03-17",
    time: "6:00 PM",
    venue: "Main Stage",
    image: "/events/fashion.jpg",
  },
  {
    id: "photography",
    name: "Frame It!",
    category: "culture",
    description: "Capture the fest through your lens. Best shots win amazing prizes!",
    rules: [
      "Solo participation",
      "DSLR or mirrorless cameras only",
      "Submit up to 5 edited photos",
      "No stock photos",
    ],
    entryFee: 150,
    teamSize: { min: 1, max: 1 },
    prizePool: 20000,
    date: "2026-03-15",
    time: "All Day",
    venue: "Entire Campus",
    image: "/events/photography.jpg",
  },
];

export const schedule = [
  {
    day: 1,
    date: "2026-03-15",
    title: "Day 1 - The Awakening",
    events: [
      { time: "9:00 AM", name: "Opening Ceremony", venue: "Main Stage" },
      { time: "10:00 AM", name: "Code Surge Hackathon Begins", venue: "Tech Hub" },
      { time: "10:00 AM", name: "Campus Treasure Hunt", venue: "Main Gate" },
      { time: "2:00 PM", name: "Street Dance Championship", venue: "Dance Arena" },
      { time: "6:00 PM", name: "DJ Battle Royale - Qualifiers", venue: "Main Stage" },
      { time: "9:00 PM", name: "Celebrity DJ Night", venue: "Main Stage" },
    ],
  },
  {
    day: 2,
    date: "2026-03-16",
    title: "Day 2 - The Surge",
    events: [
      { time: "9:00 AM", name: "Valorant Championship", venue: "Esports Arena" },
      { time: "11:00 AM", name: "Classical Fusion", venue: "Cultural Center" },
      { time: "4:00 PM", name: "Band Wars", venue: "Main Stage" },
      { time: "7:00 PM", name: "Stand-Up Showdown", venue: "Auditorium" },
      { time: "9:00 PM", name: "EDM Night ft. Guest Artist", venue: "Main Stage" },
    ],
  },
  {
    day: 3,
    date: "2026-03-17",
    title: "Day 3 - The Grand Finale",
    events: [
      { time: "10:00 AM", name: "Robo Wars Finals", venue: "Robo Arena" },
      { time: "12:00 PM", name: "Prize Distribution - Tech Events", venue: "Tech Hub" },
      { time: "2:00 PM", name: "Natya Utsav", venue: "Open Air Theatre" },
      { time: "6:00 PM", name: "Runway Revolution", venue: "Main Stage" },
      { time: "8:00 PM", name: "Celebrity Performance", venue: "Main Stage" },
      { time: "10:00 PM", name: "Closing Ceremony & Grand DJ Night", venue: "Main Stage" },
    ],
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
  { icon: "💻", title: "Tech", description: "Hackathons, robotics, and gaming tournaments" },
  { icon: "🎯", title: "Fun", description: "Treasure hunts, comedy shows, and surprises" },
  { icon: "🎭", title: "Culture", description: "Drama, fashion, photography, and more" },
];

export const categories = [
  { id: "all", name: "All Events", icon: "🎉" },
  { id: "music", name: "Music", icon: "🎶" },
  { id: "dance", name: "Dance", icon: "💃" },
  { id: "tech", name: "Tech", icon: "💻" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
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
