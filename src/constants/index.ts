import type { SeatData, RoofData, InteriorFrame, SpeakerCoord, PaintOffset } from '../types';

export const TOTAL_WHEEL_FRAMES = 96;
export const TOTAL_ASSEMBLY_FRAMES = 144;
export const TOTAL_CAMERA_FRAMES = 96;
export const PAINTS = ['purple', 'red', 'green'] as const;
export const VAN_SCALE = 0.5; // 50% of screen size
export const VAN_Y_OFFSET = 0.05; // 5% vertical shift down

export interface VanLayout {
  isMobile: boolean;
  ratio: number;
  destWidth: number;
  destHeight: number;
  shiftX: number;
  shiftY: number;
  roofTarget: { x: number; y: number };
  exteriorTarget: { x: number; y: number };
  leftCardPos: { left: number; top: number };
  rightCardPos: { left: number; top: number };
  leftPath: string;
  rightPath: string;
}

export function getVanLayout(width: number, height: number): VanLayout {
  const isMobile = width < 768;
  const imgW = 1280;
  const imgH = 720;

  if (isMobile) {
    // Phone layout: van fills ~91% of screen width with elegant margins
    const targetWidthRatio = (width / imgW) * 0.91;
    const maxHeightRatio = (height / imgH) * 0.44;
    const ratio = Math.min(targetWidthRatio, maxHeightRatio);

    const destWidth = imgW * ratio;
    const destHeight = imgH * ratio;
    const shiftX = (width - destWidth) / 2;
    // Position van slightly below vertical center (around 54% screen height)
    const shiftY = (height - destHeight) / 2 + height * 0.035;

    // Target 1: Custom Paints (Moved UP and towards the LEFT along the top roof rail)
    const roofTarget = {
      x: shiftX + destWidth * 0.24,
      y: shiftY + destHeight * 0.128,
    };

    // Target 2: Exterior Upgrades (Moved DOWN and towards the LEFT along the lower rocker trim)
    const exteriorTarget = {
      x: shiftX + destWidth * 0.42,
      y: shiftY + destHeight * 0.835,
    };

    // Top Callout Card: Custom Paints (Above the van on the left, clear of header text)
    const leftCardLeft = Math.max(16, width * 0.05);
    const leftCardTop = Math.max(115, shiftY - 95);

    // Bottom Callout Card: Exterior Upgrades (Below the van, clear of wheels)
    const rightCardLeft = Math.max(16, Math.min(width - 235, exteriorTarget.x - 110));
    const rightCardTop = Math.min(height - 82, shiftY + destHeight * 0.92);

    // Top Leader Line (Custom Paints): bent dogleg leader line into top silver roof rail
    const leftStartX = leftCardLeft + 36;
    const leftStartY = leftCardTop + 36;
    const leftTurnX = roofTarget.x - 24;
    const leftPath = `M ${leftStartX} ${leftStartY} L ${leftTurnX} ${roofTarget.y} L ${roofTarget.x} ${roofTarget.y}`;

    // Bottom Leader Line (Exterior Upgrades): bent dogleg leader line into lower rocker trim
    const rightStartX = rightCardLeft + 20;
    const rightStartY = rightCardTop + 4;
    const rightTurnX = exteriorTarget.x - 24;
    const rightPath = `M ${rightStartX} ${rightStartY} L ${rightTurnX} ${exteriorTarget.y} L ${exteriorTarget.x} ${exteriorTarget.y}`;

    return {
      isMobile: true,
      ratio,
      destWidth,
      destHeight,
      shiftX,
      shiftY,
      roofTarget,
      exteriorTarget,
      leftCardPos: { left: leftCardLeft, top: leftCardTop },
      rightCardPos: { left: rightCardLeft, top: rightCardTop },
      leftPath,
      rightPath,
    };
  } else {
    // Desktop layout (Preserves desktop design)
    const hRatio = width / imgW;
    const vRatio = height / imgH;
    const ratio = Math.min(hRatio, vRatio) * VAN_SCALE;

    const destWidth = imgW * ratio;
    const destHeight = imgH * ratio;
    const shiftX = (width - destWidth) / 2;
    const shiftY = (height - destHeight) / 2 + height * VAN_Y_OFFSET;

    const roofTarget = {
      x: shiftX + destWidth * 0.275,
      y: shiftY + destHeight * 0.24,
    };

    const exteriorTarget = {
      x: shiftX + destWidth * 0.755,
      y: shiftY + destHeight * 0.425,
    };

    const leftCardLeft = Math.max(24, roofTarget.x - 340);
    const leftCardTop = Math.max(40, roofTarget.y - 110);

    const rightCardLeft = Math.min(width - 280, exteriorTarget.x + 120);
    const rightCardTop = Math.max(60, exteriorTarget.y - 65);

    const leftCardRightEdge = leftCardLeft + 235;
    const leftCardCenterY = leftCardTop + 24;
    const leftTurnX = roofTarget.x - 24;
    const leftPath = `M ${leftCardRightEdge} ${leftCardCenterY} L ${leftTurnX} ${leftCardCenterY} L ${roofTarget.x} ${roofTarget.y}`;

    const rightCardLeftEdge = rightCardLeft;
    const rightCardCenterY = rightCardTop + 24;
    const rightTurnX = rightCardLeftEdge - 32;
    const rightPath = `M ${rightCardLeftEdge} ${rightCardCenterY} L ${rightTurnX} ${rightCardCenterY} L ${exteriorTarget.x} ${exteriorTarget.y}`;

    return {
      isMobile: false,
      ratio,
      destWidth,
      destHeight,
      shiftX,
      shiftY,
      roofTarget,
      exteriorTarget,
      leftCardPos: { left: leftCardLeft, top: leftCardTop },
      rightCardPos: { left: rightCardLeft, top: rightCardTop },
      leftPath,
      rightPath,
    };
  }
}


export const ROOFS_DATA: RoofData[] = [
  {
    id: 'lighting',
    title: 'Custom Lighting',
    badge: 'ATMOSPHERE & AMBIENCE',
    featureTitle: 'Custom Lighting',
    featureDesc:
      'Custom ambient LED mood lighting and illuminated ceiling panels create an exquisite, relaxing cabin atmosphere for long journeys.',
    image: '/roofs/roof1.webp',
  },
  {
    id: 'luggage',
    title: 'Spacious Luggage Holders',
    badge: 'SMART STORAGE',
    featureTitle: 'Spacious Luggage Holders',
    featureDesc:
      'Engineered overhead luggage racks offering spacious, secure storage while maintaining open interior headroom and sleek integrated styling.',
    image: '/roofs/roof2.webp',
  },
  {
    id: 'sound',
    title: 'Quality Sound Systems',
    badge: 'IMMERSIVE AUDIO',
    featureTitle: 'Quality Sound Systems',
    featureDesc:
      'Acoustically tuned surround sound integration with premium ceiling-mounted speakers delivering crystal-clear audio throughout the cabin.',
    image: '/roofs/roof3.webp',
  },
];

export const INTERIOR_FRAMES: InteriorFrame[] = [
  { id: 'interior', title: 'Custom Interior Panels', file: '/interior/interior.webp' },
  { id: 'lighting', title: 'Custom Interior Lighting', file: '/interior/lighting.webp' },
];

export const SPEAKER_COORDS: SpeakerCoord[] = [
  { x: 0.455, y: 0.335 }, // Front Left
  { x: 0.545, y: 0.335 }, // Front Right
  { x: 0.455, y: 0.555 }, // Middle Left
  { x: 0.545, y: 0.555 }, // Middle Right
  { x: 0.455, y: 0.775 }, // Rear Left
  { x: 0.545, y: 0.775 }, // Rear Right
];

export const DEBUG_PAINT = import.meta.env.VITE_DEBUG_PAINT === 'true';

export const DEFAULT_PAINT_OFFSETS: Record<string, PaintOffset> = {
  purple: { scale: 0.475, x: -56, y: 31 },
  red: { scale: 0.495, x: -56, y: -13 },
  green: { scale: 0.550, x: -5, y: 46 },
};

export const SEATS_DATA: SeatData[] = [
  {
    id: 'white',
    name: 'Pearl White Leather',
    badge: 'LUXURY SEATING',
    colorName: 'Pure Pearl',
    colorHex: '#e2e8f0',
    featureTitle: 'Ergonomic Comfort',
    featureDesc:
      'Designed with contoured cushioning and ergonomic support to keep passengers comfortable throughout long journeys.',
    image: '/seats/white.webp',
  },
  {
    id: 'brown',
    name: 'Cognac Brown Leather',
    badge: 'ROYAL COMFORT',
    colorName: 'Cognac Royal',
    colorHex: '#92400e',
    featureTitle: 'Premium Upholstery',
    featureDesc:
      'High-quality, durable upholstery with soft-touch cushioning for a refined feel and a comfortable seating experience.',
    image: '/seats/brown.webp',
  },
  {
    id: 'black',
    name: 'Obsidian Black Leather',
    badge: 'EXECUTIVE SUITE',
    colorName: 'Obsidian Black',
    colorHex: '#1e293b',
    featureTitle: 'Adjustable Recline & Support',
    featureDesc:
      'Adjustable backrest, armrests, and head support let passengers find their preferred seating position with ease.',
    image: '/seats/black.webp',
  },
];
