export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  name: string
  year: string
  type: string
  icon: string
  description: string
  tags: string[]
  links: ProjectLink[]
}

export const GAME_PROJECTS: Project[] = [
  {
    id: 'damned-ape',
    name: 'DAMNED APE',
    year: '2024',
    type: 'Unreal Engine · AI · Cinematics',
    icon: '📁',
    description: 'Developed advanced player movement (wall-running, curved surfaces) for fluid traversal. Implemented AI-driven enemies with stamina/mana systems and telemetry for tunable difficulty. Designed levels and cinematic sequences to deliver a cohesive, narrative-driven demo.',
    tags: ['Unreal Engine', 'AI', 'Cinematics', 'C++'],
    links: [
      { label: 'Watch Video', url: 'https://www.youtube.com/watch?v=jXx2chViNVM&list=PL8pigdE7Oeb3couSwPXJSrcNjad9NlDSR&index=7' },
    ],
  },
  {
    id: 'chronobreak',
    name: 'CHRONOBREAK',
    year: '2023',
    type: 'Unreal Engine · C++ · Game Dev',
    icon: '📁',
    description: 'Prototyped and iterated on core combat mechanics during the early incubation phase. Produced high-quality real-time cinematics and trailers to strengthen storytelling and player engagement.',
    tags: ['Unreal Engine', 'C++', 'Cinematics', 'Game Development'],
    links: [
      { label: 'Steam Page', url: 'https://store.steampowered.com/app/2408740/dgd_Chronobreak/' },
      { label: 'Watch Cinematic', url: 'https://drive.google.com/file/d/1xL5qI-jqCTmLKcYju3eunqMI3opknEpB/view' },
    ],
  },
  {
    id: 'daa-retro-fps',
    name: 'DAA — RETRO FPS',
    year: '2023',
    type: 'Unreal Engine · C++ · Game Design',
    icon: '📁',
    description: 'Built a retro FPS tech demo with 2D enemies in 3D levels. Implemented enemy AI, eight weapon and eleven enemy flipbook animations, and a three-level demo map. Produced an intro cinematic and storyline beats to deliver a complete vertical slice.',
    tags: ['Unreal Engine', 'C++', 'Game Design', 'AI'],
    links: [
      { label: 'Watch Video', url: 'https://www.youtube.com/watch?v=5CH33vElWk0&list=PL8pigdE7Oeb3couSwPXJSrcNjad9NlDSR&index=2' },
    ],
  },
]

export const FILM_PROJECTS: Project[] = [
  {
    id: 'chronobreak-cinematic',
    name: 'CHRONOBREAK — CINEMATIC',
    year: '2024',
    type: 'Cinematics · Unreal Engine',
    icon: '📁',
    description: 'Cinematics Artist on Unreal Engine. Created game cinematics with focus on camera work, lighting, and storytelling.',
    tags: ['Cinematics', 'Unreal Engine', 'Lighting', 'Camera'],
    links: [
      { label: 'Watch Cinematic', url: 'https://drive.google.com/file/d/1xL5qI-jqCTmLKcYju3eunqMI3opknEpB/view' },
    ],
  },
  {
    id: 'cember',
    name: 'ÇEMBER — SHORT FILM',
    year: '2023',
    type: "Short Film · Director's Assistant",
    icon: '📁',
    description: "Assisted the director during shooting and production preparation.",
    tags: ['Short Film', "Director's Assistant", 'Production'],
    links: [
      { label: 'IMDB', url: 'https://www.imdb.com/title/tt31691075/' },
    ],
  },
  {
    id: 'mcdonalds',
    name: "McDONALD'S COMMERCIAL",
    year: '2020',
    type: 'Commercial · Production Assistant',
    icon: '📁',
    description: 'National McDonald\'s Commercial. Production Assistant at LAB34 Production, Director: Caner Çetiner. Provided on-set production support and assisted with shooting-day coordination.',
    tags: ['Commercial', 'Production Assistant', 'LAB34'],
    links: [
      { label: 'Watch', url: 'https://youtu.be/1l2pwD7vRu4' },
    ],
  },
  {
    id: 'kaya-giray',
    name: 'KAYA GIRAY — YARININ YOK',
    year: '2020',
    type: 'Music Video · Assistant Director',
    icon: '📁',
    description: 'Assistant Director Support / Cast at Milk Jack. Supported assistant director and on-set coordination during shooting.',
    tags: ['Music Video', 'Assistant Director', 'Milk Jack'],
    links: [
      { label: 'Watch', url: 'https://youtu.be/2uTurap3YU' },
    ],
  },
  {
    id: 'light',
    name: 'LIGHT — SHORT FILM',
    year: '2023',
    type: 'Short Film · Director / Writer',
    icon: '📁',
    description: 'Director and Writer. European Union–supported project addressing the Hatay earthquake.',
    tags: ['Short Film', 'Director', 'Writer', 'EU Project'],
    links: [],
  },
  {
    id: 'blood',
    name: 'BLOOD — SHORT FILM',
    year: '2021',
    type: 'Short Film · Director / Writer',
    icon: '📁',
    description: 'Director and Writer. Selected by multiple international festivals. Semi-Finalist & Honorable Mention.',
    tags: ['Short Film', 'Director', 'Writer', 'Festival Selection'],
    links: [],
  },
  {
    id: 'kronos',
    name: 'KRONOS — SHORT FILM',
    year: '2020',
    type: 'Short Film · Director / Writer',
    icon: '📁',
    description: 'Director and Writer. Official selection at international film festivals.',
    tags: ['Short Film', 'Director', 'Writer', 'Festival'],
    links: [],
  },
]

export const SOFTWARE_PROJECTS: Project[] = [
  {
    id: 'neural-sys',
    name: 'NEURAL.SYS',
    year: '2025',
    type: 'React · Web',
    icon: '📁',
    description: 'AI-powered web application built with React and modern tooling.',
    tags: ['React', 'TypeScript', 'AI', 'Web'],
    links: [],
  },
  {
    id: 'rt-render',
    name: 'RT.RENDER',
    year: '2024',
    type: 'Rust · Native',
    icon: '📁',
    description: 'Real-time renderer built in Rust for high-performance native applications.',
    tags: ['Rust', 'Rendering', 'Native'],
    links: [],
  },
  {
    id: 'term-game',
    name: 'TERM.GAME',
    year: '2024',
    type: 'Go · CLI',
    icon: '📁',
    description: 'Terminal-based game written in Go.',
    tags: ['Go', 'CLI', 'Game'],
    links: [],
  },
  {
    id: 'dev-tools',
    name: 'DEV.TOOLS',
    year: '2024',
    type: 'TypeScript',
    icon: '📁',
    description: 'Developer tooling utilities built with TypeScript.',
    tags: ['TypeScript', 'Tooling'],
    links: [],
  },
]

export const DEVFILES_PROJECTS: Project[] = [
  {
    id: 'deux',
    name: 'DEUX',
    year: '2025',
    type: 'Creative Intelligence · Pre-Production Platform',
    icon: '📁',
    description: 'DEUX is a creative intelligence platform built for the pre-production phase. Designed for directors, producers, and creative teams — it streamlines concept visualization, project planning, and early-stage production workflows. DEUX bridges the gap between raw creative vision and structured execution, giving teams a shared space to think before they shoot.',
    tags: ['Platform', 'Web', 'Creative', 'Pre-Production', 'TypeScript'],
    links: [
      { label: 'Visit deuxstud.io', url: 'https://deuxstud.io' },
    ],
  },
  {
    id: 'rezinn',
    name: 'REZINN',
    year: '2024',
    type: 'Venue Discovery · Mobile App · Istanbul',
    icon: '📁',
    description: 'Rezinn is a venue discovery and reservation platform operating in Istanbul. Users explore restaurants and venues with real-time availability, pricing, reviews, and occupancy data — then book instantly, no phone calls required. Zero commission model: guests pay only the venue\'s standard rates. Built by Rezinn Teknoloji ve Ticaret A.Ş., available on Android with iOS coming soon.',
    tags: ['Platform', 'Mobile', 'Startup', 'Istanbul', 'Venue Discovery'],
    links: [
      { label: 'Visit rezinn.com', url: 'https://rezinn.com' },
    ],
  },
]

export const CINEMA_PROJECTS: Project[] = [...FILM_PROJECTS]
export const ARCADE_PROJECTS: Project[] = [...GAME_PROJECTS]
