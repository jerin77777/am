export interface SeatData {
  id: string;
  name: string;
  badge: string;
  colorName: string;
  colorHex: string;
  featureTitle: string;
  featureDesc: string;
  image: string;
}

export interface InteriorFrame {
  id: string;
  title: string;
  file: string;
}

export interface SpeakerCoord {
  x: number;
  y: number;
}

export interface PaintOffset {
  scale: number;
  x: number;
  y: number;
}

export interface RoofData {
  id: string;
  title: string;
  badge?: string;
  featureTitle: string;
  featureDesc: string;
  image: string;
}

export interface LoadedAssets {
  wheelImages: HTMLImageElement[];
  assemblyImages: HTMLImageElement[];
  paintImages: Record<string, HTMLImageElement>;
  roofImages: HTMLImageElement[];
  seatImages: HTMLImageElement[];
  cameraImages: HTMLImageElement[];
  interiorImages: Record<string, HTMLImageElement>;
}
