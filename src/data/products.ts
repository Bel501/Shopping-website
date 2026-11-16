import { BRAND_CONFIG } from '../config/brandConfig';

export interface ProductVariant {
  id: string;
  name: string;
  hex: string;
  accentHex: string;
  roughness: number;
  metalness: number;
  gltfVariantName?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  series: string;
  badgeText: string;
  price: number;
  weight: string;
  description: string;
  imageUrl: string;
  modelUrl: string;
  modelScale: number;
  sizes: string[];
  specs: { label: string; value: string }[];
  variants: ProductVariant[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'vx-01',
    slug: 'velox-aero-01',
    name: 'VÉLOX Aero 01',
    series: 'Series 01 · Monocoque',
    badgeText: 'Flagship',
    price: 420,
    weight: '218 g',
    description:
      'Carbon-plated road runner engineered with seamless Bio-Dyneema knit and nitrogen-infused Pebax midsole geometry.',
    imageUrl: '/src/assets/images/velox_aero_studio_1794823735661.jpg',
    modelUrl: BRAND_CONFIG.defaultModelUrl,
    modelScale: 10.5,
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    specs: [
      { label: 'Chassis', value: 'Split Toray T1100 Carbon' },
      { label: 'Upper', value: '3D-Knitted Bio-Dyneema' },
      { label: 'Drop', value: '6.5mm Kinetic Cantilever' },
      { label: 'Traction', value: 'Micro-Lug Vibram Megagrip' },
    ],
    variants: [
      {
        id: 'obsidian-volt',
        name: 'Obsidian / Volt',
        hex: '#1c1d21',
        accentHex: '#D4FF00',
        roughness: 0.45,
        metalness: 0.25,
        gltfVariantName: 'midnight',
      },
      {
        id: 'titanium-bone',
        name: 'Titanium Bone',
        hex: '#e4e4e7',
        accentHex: '#a1a1aa',
        roughness: 0.35,
        metalness: 0.3,
        gltfVariantName: 'beach',
      },
      {
        id: 'crimson-oxide',
        name: 'Crimson Oxide',
        hex: '#991b1b',
        accentHex: '#f87171',
        roughness: 0.4,
        metalness: 0.2,
        gltfVariantName: 'street',
      },
      {
        id: 'cobalt-stealth',
        name: 'Cobalt Stealth',
        hex: '#1e3a8a',
        accentHex: '#60a5fa',
        roughness: 0.32,
        metalness: 0.45,
      },
    ],
  },
  {
    id: 'vx-02',
    slug: 'velox-terra-x',
    name: 'VÉLOX Terra X',
    series: 'Series 02 · All-Terrain',
    badgeText: 'Weather-Sealed',
    price: 460,
    weight: '264 g',
    description:
      'Hydro-sealed ripstop membrane fused onto an articulated exo-cage for alpine ascents and demanding urban terrain.',
    imageUrl: '/src/assets/images/velox_terra_studio_1794823736135.jpg',
    modelUrl: BRAND_CONFIG.defaultModelUrl,
    modelScale: 10.5,
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    specs: [
      { label: 'Shell', value: 'Hydro-Sealed Ripstop Matrix' },
      { label: 'Lacing', value: 'Kevlar Quick-Lock Tension' },
      { label: 'Cushion', value: 'Dual-Density Nitrogen Foam' },
      { label: 'Protection', value: '360° TPU Mudguard' },
    ],
    variants: [
      {
        id: 'dune-sand',
        name: 'Dune Ceramic',
        hex: '#d6cbb8',
        accentHex: '#D4FF00',
        roughness: 0.65,
        metalness: 0.1,
      },
      {
        id: 'graphite-black',
        name: 'Graphite Matte',
        hex: '#141416',
        accentHex: '#71717a',
        roughness: 0.7,
        metalness: 0.15,
      },
      {
        id: 'acid-moss',
        name: 'Acid Moss',
        hex: '#3f6212',
        accentHex: '#D4FF00',
        roughness: 0.55,
        metalness: 0.2,
      },
    ],
  },
  {
    id: 'vx-03',
    slug: 'velox-proto-zero',
    name: 'VÉLOX Proto 00',
    series: 'Lab Edition · Limited',
    badgeText: '500 Pairs',
    price: 540,
    weight: '192 g',
    description:
      'Numbered studio prototype stripping away every non-essential gram. Exposed lattice midsole tuned for peak energy return.',
    imageUrl: '/src/assets/images/velox_proto_studio_1794823736220.jpg',
    modelUrl: BRAND_CONFIG.defaultModelUrl,
    modelScale: 10.5,
    sizes: ['US 8', 'US 9', 'US 10', 'US 11'],
    specs: [
      { label: 'Lattice', value: 'SLS 3D-Printed Elastomer' },
      { label: 'Weight', value: '192g (Sample US 9)' },
      { label: 'Edition', value: '500 Pairs Worldwide' },
      { label: 'Finish', value: 'Raw Anodized Hardware' },
    ],
    variants: [
      {
        id: 'mercury-chrome',
        name: 'Mercury Alloy',
        hex: '#9ca3af',
        accentHex: '#D4FF00',
        roughness: 0.18,
        metalness: 0.85,
      },
      {
        id: 'volt-hyper',
        name: 'Volt Hyper',
        hex: '#b5d900',
        accentHex: '#ffffff',
        roughness: 0.25,
        metalness: 0.55,
      },
      {
        id: 'void-black',
        name: 'Void Carbon',
        hex: '#09090b',
        accentHex: '#D4FF00',
        roughness: 0.35,
        metalness: 0.4,
      },
    ],
  },
];
