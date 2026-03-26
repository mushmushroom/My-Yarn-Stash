export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export const brandLogos: Record<string, string> = {
  Alize: '/yarn-logos/alize.png',
  Drops: '/yarn-logos/drops.png',
  Gazzal: '/yarn-logos/gazzal.jpeg',
  'Lana Gatto': '/yarn-logos/lana-gatto.png',
  'Laines Du Nord': '/yarn-logos/laines-du-nord.png',
  'Madame Tricote': '/yarn-logos/madame-tricote.png',
  Nako: '/yarn-logos/nako.png',
  'Sandnes Garn': '/yarn-logos/sandnes-garn.png',
  Trikolino: '/yarn-logos/trikolino.jpeg',
  Yarna: '/yarn-logos/yarna.jpg',
  YarnArt: '/yarn-logos/yarnart.png',
  Ярослав: '/yarn-logos/yaroslav.webp',
};

export const COLOR_MAP: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  gray: '#808080',
  red: '#ff0000',
  orange: '#ffa500',
  yellow: '#ffff00',
  green: '#008000',
  teal: '#008080',
  blue: '#0000ff',
  navy: '#000080',
  purple: '#800080',
  pink: '#ffc0cb',
  brown: '#a52a2a',
  beige: '#f5f5dc',
  gold: '#ffd700',
  coral: '#ff7f50',
  lavender: '#e6e6fa',
};

export const API_ENDPOINTS = {
  SKEINS: '/skeins',
  PROJECTS: '/projects',
  BRANDS: '/brands',
  YARDAGE_UNITS: '/yardage-units',
  CATEGORIES: '/categories',
  FIBERS: '/fibers'
}
