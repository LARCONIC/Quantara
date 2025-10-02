// Enhanced project interface
export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  status: 'live' | 'beta' | 'prototype' | 'graduated' | 'coming-soon';
  category: 'product' | 'lab' | 'future';
  tags: string[];
  graduatedFrom?: string; // For products that came from lab
  technologies: string[];
  launchDate?: string;
  image?: string;
  // New fields for Lab workflow
  developmentPhase?: 'development' | 'upgradation' | 'experimentation' | 'ready-for-graduation';
  graduationDate?: string;
  graduatedTo?: string; // Product ID it graduated to
}

export const products: Project[] = [
  {
    id: "serene-mind",
    name: "Serene Mind",
    description: "Mental wellness app with mood tracking, mindfulness tips, and community support. Built with HTML, CSS, and JavaScript.",
    url: "https://mind-serene.netlify.app/",
    status: "live",
    category: "product",
    tags: ["Mental Health", "Wellness", "Community"],
    technologies: ["HTML", "CSS", "JavaScript"],
    launchDate: "29-5-2025",
  },
  {
    id: "sonicwave-pro",
    name: "SonicWave Pro",
    description: "Music visualizer web app with multiple modes, playlist support, equalizer settings, and real-time audio effects turning sound into stunning visuals.",
    url: "https://sonicwave-pro.netlify.app/",
    status: "live",
    category: "product",
    tags: ["Music", "Visualization", "Audio"],
    graduatedFrom: "audio-lab-v1",
    technologies: ["HTML", "CSS", "JavaScript", "Web Audio API"],
    launchDate: "29-5-2025",
  },
  {
    id: "sonicwave",
    name: "SonicWave",
    description: "A streamlined version of SonicWave Pro, offering essential music visualization features with optimized performance. Perfect for users who want beautiful audio visuals without the complexity.",
    url: "https://sonicwave-light.netlify.app/",
    status: "live",
    category: "product",
    tags: ["Music", "Visualization", "Lightweight"],
    technologies: ["HTML", "CSS", "JavaScript"],
    launchDate: "29-5-2025",
  },
];
