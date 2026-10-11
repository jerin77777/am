import { useState, useEffect } from 'react';
import type { LoadedAssets } from '../types';
import {
  TOTAL_WHEEL_FRAMES,
  TOTAL_ASSEMBLY_FRAMES,
  TOTAL_CAMERA_FRAMES,
  PAINTS,
  ROOFS_DATA,
  SEATS_DATA,
  INTERIOR_FRAMES,
} from '../constants';

export function useAssetPreloader() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [assets, setAssets] = useState<LoadedAssets>({
    wheelImages: [],
    assemblyImages: [],
    paintImages: {},
    roofImages: [],
    seatImages: [],
    cameraImages: [],
    interiorImages: {},
  });

  useEffect(() => {
    const preloadAssets = async () => {
      const loadedWheel: HTMLImageElement[] = [];
      const loadedAssembly: HTMLImageElement[] = [];
      const loadedPaints: Record<string, HTMLImageElement> = {};
      const loadedRoofs: HTMLImageElement[] = [];
      const loadedSeats: HTMLImageElement[] = [];
      const loadedCamera: HTMLImageElement[] = [];
      const loadedInterior: Record<string, HTMLImageElement> = {};

      const totalToLoad =
        TOTAL_WHEEL_FRAMES +
        TOTAL_ASSEMBLY_FRAMES +
        TOTAL_CAMERA_FRAMES +
        PAINTS.length +
        ROOFS_DATA.length +
        SEATS_DATA.length +
        INTERIOR_FRAMES.length;

      let completedCount = 0;

      const updateProgress = () => {
        completedCount++;
        setLoadProgress(Math.floor((completedCount / totalToLoad) * 100));
      };

      const promises: Promise<void>[] = [];

      // Preload interior frames from /interior folder
      INTERIOR_FRAMES.forEach((frame) => {
        const img = new Image();
        img.src = frame.file;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              loadedInterior[frame.id] = img;
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load interior frame: ${frame.file}`);
              updateProgress();
              resolve();
            };
          })
        );
      });

      // Preload wheel frames (96 frames)
      for (let i = 1; i <= TOTAL_WHEEL_FRAMES; i++) {
        const img = new Image();
        img.src = `/wheel_frames/frame_${String(i).padStart(4, '0')}.webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load wheel frame: ${img.src}`);
              updateProgress();
              resolve();
            };
          })
        );
        loadedWheel.push(img);
      }

      // Preload assembly frames (144 frames)
      for (let i = 1; i <= TOTAL_ASSEMBLY_FRAMES; i++) {
        const img = new Image();
        img.src = `/assembly_frames/frame_${String(i).padStart(4, '0')}.webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load assembly frame: ${img.src}`);
              updateProgress();
              resolve();
            };
          })
        );
        loadedAssembly.push(img);
      }

      // Preload camera frames (96 frames)
      for (let i = 1; i <= TOTAL_CAMERA_FRAMES; i++) {
        const img = new Image();
        img.src = `/camera_frames/frame_${String(i).padStart(4, '0')}.webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load camera frame: ${img.src}`);
              updateProgress();
              resolve();
            };
          })
        );
        loadedCamera.push(img);
      }

      // Preload paints
      PAINTS.forEach((color) => {
        const img = new Image();
        img.src = `/paints/${color}paint.webp`;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              loadedPaints[color] = img;
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              const fallbackImg = new Image();
              fallbackImg.src = `/paints/${color}.webp`;
              fallbackImg.onload = () => {
                loadedPaints[color] = fallbackImg;
                updateProgress();
                resolve();
              };
              fallbackImg.onerror = () => {
                console.error(`Failed to load paint: ${color}`);
                updateProgress();
                resolve();
              };
            };
          })
        );
      });

      // Preload roof images (roof1, roof2, roof3)
      ROOFS_DATA.forEach((roof) => {
        const img = new Image();
        img.src = roof.image;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load roof image: ${roof.image}`);
              updateProgress();
              resolve();
            };
          })
        );
        loadedRoofs.push(img);
      });

      // Preload seat images (white, brown, black)
      SEATS_DATA.forEach((seat) => {
        const img = new Image();
        img.src = seat.image;
        promises.push(
          new Promise((resolve) => {
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              console.error(`Failed to load seat: ${seat.image}`);
              updateProgress();
              resolve();
            };
          })
        );
        loadedSeats.push(img);
      });

      await Promise.all(promises);
      setAssets({
        wheelImages: loadedWheel,
        assemblyImages: loadedAssembly,
        paintImages: loadedPaints,
        roofImages: loadedRoofs,
        seatImages: loadedSeats,
        cameraImages: loadedCamera,
        interiorImages: loadedInterior,
      });
      setIsLoaded(true);
    };

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    preloadAssets();
  }, []);

  return { isLoaded, loadProgress, assets };
}
