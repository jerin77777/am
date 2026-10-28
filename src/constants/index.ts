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

    const iconRadius = 21; // 42px icon circle diameter
    const bottomIconCenterX = Math.round(width * 0.558);

    // Target 1: Exterior Upgrades (Shifted 40px left along the roof rail)
    const roofTarget = {
      x: Math.round(shiftX + destWidth * 0.725) - 40,
      y: Math.round(shiftY + destHeight * 0.125),
    };

    // Target 2: Custom Paints (Lower door sill / rocker trim behind front wheel: ~78.5% width, ~86.5% height)
    const exteriorTarget = {
      x: Math.round(shiftX + destWidth * 0.785),
      y: Math.round(shiftY + destHeight * 0.865),
    };

    // Top Callout Card: Exterior Upgrades (Moved to the left: text on left, car icon on right)
    const textWidth = 145;
    const gap = 10;
    const leftCardLeft = Math.max(14, Math.round(width * 0.04));
    const leftCardTop = Math.max(90, Math.round(shiftY - 76));
    const leftIconCenterY = leftCardTop + 21;
    const topIconCenterX = leftCardLeft + textWidth + gap + iconRadius - 10;

    // Bottom Callout Card: Custom Paints (Below the van: spray gun icon on left, text on right)
    const rightCardLeft = Math.max(16, bottomIconCenterX - iconRadius);
    const rightCardTop = Math.min(height - 75, Math.round(shiftY + destHeight + Math.max(18, height * 0.065)));

    // Top Leader Line (Exterior Upgrades): Starts directly from icon perimeter,
    // goes diagonally down-right to the bend, then vertical down into roof target (only one bend)
    const leftTurn2Y = Math.round(shiftY - 12);
    const leftAngle = Math.atan2(leftTurn2Y - leftIconCenterY, roofTarget.x - topIconCenterX);
    const leftStartX = topIconCenterX + Math.round(iconRadius * Math.cos(leftAngle));
    const leftStartY = leftIconCenterY + Math.round(iconRadius * Math.sin(leftAngle));
    const leftPath = `M ${leftStartX} ${leftStartY} L ${roofTarget.x} ${leftTurn2Y} L ${roofTarget.x} ${roofTarget.y}`;

    // Bottom Leader Line (Custom Paints): Starts at top-right of spray gun icon,
    // goes diagonally up-right, then vertical up into paint target on body / rocker trim
    const rightStartX = bottomIconCenterX + 15;
    const rightStartY = rightCardTop + 2;
    const rightTurnY = Math.round(shiftY + destHeight + Math.max(8, height * 0.024));
    const rightPath = `M ${rightStartX} ${rightStartY} L ${exteriorTarget.x} ${rightTurnY} L ${exteriorTarget.x} ${exteriorTarget.y}`;

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
