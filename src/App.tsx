import { useEffect, useRef, useState } from 'react';
import './App.css';

import { useAssetPreloader } from './hooks/useAssetPreloader';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import { HeaderLogo } from './components/HeaderLogo/HeaderLogo';
import { VanShowcase } from './components/VanShowcase/VanShowcase';
import { RoofsShowcase } from './components/RoofsShowcase/RoofsShowcase';
import { SeatsShowcase } from './components/SeatsShowcase/SeatsShowcase';
import { CameraShowcase } from './components/CameraShowcase/CameraShowcase';
import { ContactSection } from './components/ContactSection/ContactSection';

import {
  TOTAL_WHEEL_FRAMES,
  TOTAL_ASSEMBLY_FRAMES,
  TOTAL_CAMERA_FRAMES,
  PAINTS,
  getVanLayout,
  SPEAKER_COORDS,
  DEBUG_PAINT,
  DEFAULT_PAINT_OFFSETS,
  ROOFS_DATA,
  SEATS_DATA,
} from './constants';

function App() {
  const { isLoaded, loadProgress, assets } = useAssetPreloader();
  const {
    wheelImages,
    assemblyImages,
    paintImages,
    roofImages,
    seatImages,
    cameraImages,
    interiorImages,
  } = assets;

  // DOM & Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const annotationsRef = useRef<HTMLDivElement>(null);
  const roofsContainerRef = useRef<HTMLDivElement>(null);
  const roofsCanvasRef = useRef<HTMLCanvasElement>(null);
  const roofsRightColRef = useRef<HTMLDivElement>(null);
  const seatsContainerRef = useRef<HTMLDivElement>(null);
  const seatsCanvasRef = useRef<HTMLCanvasElement>(null);
  const seatsRightColRef = useRef<HTMLDivElement>(null);
  const cameraContainerRef = useRef<HTMLDivElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const contactContainerRef = useRef<HTMLDivElement>(null);

  // Header Logo references
  const logoHeaderRef = useRef<HTMLDivElement>(null);
  const logoPillRef = useRef<HTMLDivElement>(null);
  const logoHintRef = useRef<HTMLDivElement>(null);

  // Asset references for canvas rendering ticks
  const roofImagesRef = useRef<HTMLImageElement[]>([]);
  roofImagesRef.current = roofImages;
  const seatImagesRef = useRef<HTMLImageElement[]>([]);
  seatImagesRef.current = seatImages;
  const cameraImagesRef = useRef<HTMLImageElement[]>([]);
  cameraImagesRef.current = cameraImages;
  const interiorImagesRef = useRef<Record<string, HTMLImageElement>>({});
  interiorImagesRef.current = interiorImages;

  // Van animation refs & states
  const assemblyFrameRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const currentPaintIndexRef = useRef<number>(-1);
  const visualPaintPosRef = useRef<number>(-1);

  // Roofs showcase state & animation refs
  const [activeRoofIndex, setActiveRoofIndex] = useState(0);
  const activeRoofIndexRef = useRef(0);
  activeRoofIndexRef.current = activeRoofIndex;
  const activeRoofPosRef = useRef(0);

  // Seats showcase state & animation refs
  const [activeSeatIndex, setActiveSeatIndex] = useState(0);
  const activeSeatIndexRef = useRef(0);
  activeSeatIndexRef.current = activeSeatIndex;
  const activeSeatPosRef = useRef(0);

  // Camera & Interior features animation refs & states
  const cameraFrameRef = useRef(0);
  const currentInteriorAlphaRef = useRef(0);
  const currentLightingAlphaRef = useRef(0);
  const currentRingsAlphaRef = useRef(0);
  const [cameraSubtitle, setCameraSubtitle] = useState('Custom Interior');
  const cameraSubtitleRef = useRef('Custom Interior');

  // Paint Debug states (when VITE_DEBUG_PAINT=true)
  const [selectedPaint, setSelectedPaint] = useState<string | null>(null);
  const [showPaintButtons, setShowPaintButtons] = useState(false);
  const [copied, setCopied] = useState(false);
  const selectedPaintRef = useRef<string | null>(null);
  selectedPaintRef.current = selectedPaint;

  const [paintScale, setPaintScale] = useState(DEFAULT_PAINT_OFFSETS.purple.scale);
  const [paintXOffset, setPaintXOffset] = useState(DEFAULT_PAINT_OFFSETS.purple.x);
  const [paintYOffset, setPaintYOffset] = useState(DEFAULT_PAINT_OFFSETS.purple.y);

  const paintScaleRef = useRef(paintScale);
  const paintXOffsetRef = useRef(paintXOffset);
  const paintYOffsetRef = useRef(paintYOffset);
  paintScaleRef.current = paintScale;
  paintXOffsetRef.current = paintXOffset;
  paintYOffsetRef.current = paintYOffset;

  // -------------------------------------------------------------
  // CANVAS RENDER METHODS
  // -------------------------------------------------------------
  const renderVanFrame = (
    scrollFraction: number,
    assemblyFrameIndex: number,
    paintAlphas: Record<string, number> = { purple: 0, red: 0, green: 0 }
  ) => {
    if (!canvasRef.current || wheelImages.length === 0 || assemblyImages.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImageScaled = (
      img: HTMLImageElement,
      alpha = 1,
      refImg?: HTMLImageElement,
      customScale = 1,
      yOffset = 0,
      xOffset = 0,
      extraPixelXOffset = 0
    ) => {
      ctx.globalAlpha = alpha;

      const scaleRef = refImg || img;
      const layout = getVanLayout(canvas.width, canvas.height);
      const ratio = layout.ratio;
      const finalRatio = ratio * customScale;

      const destWidth = img.width * finalRatio;
      const destHeight = img.height * finalRatio;

      const centerShift_x = layout.shiftX;
      const centerShift_y = layout.shiftY;

      const adjustedX =
        centerShift_x +
        (scaleRef.width * ratio - destWidth) / 2 +
        xOffset * ratio +
        extraPixelXOffset;
      const adjustedY =
        centerShift_y +
        (scaleRef.height * ratio - destHeight) / 2 +
        yOffset * ratio;

      ctx.drawImage(img, 0, 0, img.width, img.height, adjustedX, adjustedY, destWidth, destHeight);
      ctx.globalAlpha = 1;
    };

    const baseAssemblyImg = assemblyImages[TOTAL_ASSEMBLY_FRAMES - 1];

    // Van Exit Scroll-Up effect (0.19 to 0.24)
    if (containerRef.current) {
      if (scrollFraction <= 0.19) {
        containerRef.current.style.transform = 'translateY(0vh)';
      } else if (scrollFraction <= 0.24) {
        const exitProgress = (scrollFraction - 0.19) / 0.05;
        containerRef.current.style.transform = `translateY(${-exitProgress * 100}vh)`;
      } else {
        containerRef.current.style.transform = 'translateY(-100vh)';
      }
    }

    const currentAssemblyIndex = Math.min(
      TOTAL_ASSEMBLY_FRAMES - 1,
      Math.floor(assemblyFrameIndex)
    );

    if (currentAssemblyIndex === 0 && scrollFraction <= 0.04) {
      // Stage 1: Wheel rotation & entrance from left (0.0 to 0.04)
      if (DEBUG_PAINT) setShowPaintButtons((prev) => (prev ? false : prev));

      const progress = Math.min(1, Math.max(0, scrollFraction / 0.04));
      const wheelIndex = Math.min(
        TOTAL_WHEEL_FRAMES - 1,
        Math.floor(progress * TOTAL_WHEEL_FRAMES)
      );
      const img = wheelImages[wheelIndex];
      if (img) {
        const layout = getVanLayout(canvas.width, canvas.height);
        // Wheel frames are 1920x1080 while base assembly frames are 1280x720 (1.5x resolution)
        // Normalize wheel frame scale so it matches the van assembly dimensions perfectly
        const wheelScale = baseAssemblyImg ? baseAssemblyImg.width / img.width : 1280 / img.width;
        const destWidth = img.width * layout.ratio * wheelScale;
        const extraXPixels = (1 - progress) * (-(layout.shiftX + destWidth));

        drawImageScaled(img, 1, baseAssemblyImg, wheelScale, 0, 0, extraXPixels);
      }
    } else {
      // Assembly sequence triggered by scroll
      const img = assemblyImages[currentAssemblyIndex];
      if (img) drawImageScaled(img);

      if (DEBUG_PAINT) {
        if (currentAssemblyIndex >= TOTAL_ASSEMBLY_FRAMES - 1) {
          setShowPaintButtons((prev) => (!prev ? true : prev));
        } else {
          setShowPaintButtons((prev) => (prev ? false : prev));
        }

        const currentPaint = selectedPaintRef.current;
        if (currentPaint && paintImages[currentPaint]) {
          drawImageScaled(
            paintImages[currentPaint],
            1,
            baseAssemblyImg,
            paintScaleRef.current,
            paintYOffsetRef.current,
            paintXOffsetRef.current
          );
        }
      } else {
        // Paints cross-fade seamlessly without getting skipped during trackpad scroll
        if (currentAssemblyIndex >= TOTAL_ASSEMBLY_FRAMES - 1) {
          PAINTS.forEach((color) => {
            const alpha = paintAlphas[color];
            if (alpha && alpha > 0.001) {
              const defs = DEFAULT_PAINT_OFFSETS[color];
              if (paintImages[color] && defs) {
                drawImageScaled(
                  paintImages[color],
                  alpha,
                  baseAssemblyImg,
                  defs.scale,
                  defs.y,
                  defs.x
                );
              }
            }
          });
        }
      }
    }
  };

  const renderRoofsCanvas = () => {
    if (!roofsCanvasRef.current || roofImagesRef.current.length === 0) return;
    const canvas = roofsCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentPos = Math.max(0, Math.min(ROOFS_DATA.length - 1, activeRoofPosRef.current));
    const baseIndex = Math.floor(currentPos);
    const nextIndex = Math.min(ROOFS_DATA.length - 1, baseIndex + 1);
    const fraction = currentPos - baseIndex;

    // Smoothstep blend curve
    const blendWeight = fraction * fraction * (3 - 2 * fraction);

    const drawRoofImg = (img: HTMLImageElement, alpha: number) => {
      if (alpha <= 0 || !img) return;
      ctx.globalAlpha = alpha;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;
      let renderWidth = canvas.width;
      let renderHeight = canvas.height;
      let renderX = 0;
      let renderY = 0;

      if (imgRatio > canvasRatio) {
        renderHeight = canvas.height;
        renderWidth = canvas.height * imgRatio;
        renderX = (canvas.width - renderWidth) / 2;
      } else {
        renderWidth = canvas.width;
        renderHeight = canvas.width / imgRatio;
        renderY = (canvas.height - renderHeight) / 2;
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, renderX, renderY, renderWidth, renderHeight);
      ctx.globalAlpha = 1;
    };

    if (baseIndex === nextIndex || blendWeight <= 0.001) {
      drawRoofImg(roofImagesRef.current[baseIndex], 1);
    } else if (blendWeight >= 0.999) {
      drawRoofImg(roofImagesRef.current[nextIndex], 1);
    } else {
      drawRoofImg(roofImagesRef.current[baseIndex], 1 - blendWeight);
      drawRoofImg(roofImagesRef.current[nextIndex], blendWeight);
    }
  };

  const renderSeatsCanvas = () => {
    if (!seatsCanvasRef.current || seatImagesRef.current.length === 0) return;
    const canvas = seatsCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentPos = Math.max(0, Math.min(SEATS_DATA.length - 1, activeSeatPosRef.current));
    const baseIndex = Math.floor(currentPos);
    const nextIndex = Math.min(SEATS_DATA.length - 1, baseIndex + 1);
    const fraction = currentPos - baseIndex;

    // Smoothstep blend curve
    const blendWeight = fraction * fraction * (3 - 2 * fraction);

    const drawSeatImg = (img: HTMLImageElement, alpha: number) => {
      if (alpha <= 0 || !img) return;
      ctx.globalAlpha = alpha;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const isMobile = window.innerWidth < 768;
      const ratio = Math.min(hRatio, vRatio) * (isMobile ? 0.94 : 0.88);

      const destWidth = img.width * ratio;
      const destHeight = img.height * ratio;

      const destX = (canvas.width - destWidth) / 2;
      const destY = (canvas.height - destHeight) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, destX, destY, destWidth, destHeight);
      ctx.globalAlpha = 1;
    };

    if (baseIndex === nextIndex || blendWeight <= 0.001) {
      drawSeatImg(seatImagesRef.current[baseIndex], 1);
    } else if (blendWeight >= 0.999) {
      drawSeatImg(seatImagesRef.current[nextIndex], 1);
    } else {
      drawSeatImg(seatImagesRef.current[baseIndex], 1 - blendWeight);
      drawSeatImg(seatImagesRef.current[nextIndex], blendWeight);
    }
  };

  const renderCameraCanvas = (
    frameIdx: number,
    interiorAlpha: number = 0,
    lightingAlpha: number = 0,
    ringsAlpha: number = 0,
    currentTime: number = 0
  ) => {
    if (!cameraCanvasRef.current || cameraImagesRef.current.length === 0) return;
    const canvas = cameraCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const clampedIdx = Math.max(0, Math.min(TOTAL_CAMERA_FRAMES - 1, Math.floor(frameIdx)));
    const img = cameraImagesRef.current[clampedIdx];
    if (!img) return;

    const isMobile = window.innerWidth < 768;
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    // On mobile, the 3D-rendered van occupies ~57% of the 1920x1080 canvas.
    // Scaling by 1.58 ensures the visible van occupies ~90% of the phone screen width!
    const ratio = isMobile
      ? (canvas.width / img.width) * 1.58
      : Math.min(hRatio, vRatio) * 0.78;

    const destWidth = img.width * ratio;
    const destHeight = img.height * ratio;

    const destX = (canvas.width - destWidth) / 2;
    const destY = isMobile
      ? (canvas.height - destHeight) / 2 + canvas.height * 0.018
      : (canvas.height - destHeight) / 2;

    // 1. Base Camera Frame
    ctx.drawImage(img, 0, 0, img.width, img.height, destX, destY, destWidth, destHeight);

    // 2. Overlay Custom Interior Panel Frame from /interior/interior.webp
    if (interiorAlpha > 0.001 && interiorImagesRef.current.interior) {
      const oImg = interiorImagesRef.current.interior;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, interiorAlpha));
      ctx.drawImage(oImg, 0, 0, oImg.width, oImg.height, destX, destY, destWidth, destHeight);
      ctx.restore();
    }

    // 3. Overlay Custom Interior Lighting Design Frame from /interior/lighting.webp
    if (lightingAlpha > 0.001 && interiorImagesRef.current.lighting) {
      const oImg = interiorImagesRef.current.lighting;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, lightingAlpha));
      ctx.drawImage(oImg, 0, 0, oImg.width, oImg.height, destX, destY, destWidth, destHeight);
      ctx.restore();
    }

    // 4. Overlay Glowing Concentric Audio / Infotainment Speaker Rings
    if (ringsAlpha > 0.001) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, ringsAlpha));

      const ringBaseRadii = [0.008, 0.016, 0.026, 0.036];

      SPEAKER_COORDS.forEach((speaker, sIdx) => {
        const cx = destX + speaker.x * destWidth;
        const cy = destY + speaker.y * destHeight;
        const baseUnit = destWidth;

        // Center glowing core dot (translucent)
        ctx.beginPath();
        ctx.arc(cx, cy, baseUnit * 0.0035, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 240, 255, 0.35)';
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.7)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.stroke();

        // 4 Concentric glowing acoustic ripple rings matching reference image
        ringBaseRadii.forEach((rFraction, rIdx) => {
          const wavePhase = currentTime * 3.2 - rIdx * 0.7 - sIdx * 0.15;
          const wavePulse = Math.sin(wavePhase);
          const r = baseUnit * (rFraction + wavePulse * 0.002);
          const ringOpacity = Math.max(0.2, Math.min(0.95, 0.85 + wavePulse * 0.2 - rIdx * 0.15));

          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(1, r), 0, Math.PI * 2);
          ctx.lineWidth = Math.max(1.2, 1.8 - rIdx * 0.25);
          ctx.strokeStyle = `rgba(0, 229, 255, ${ringOpacity})`;
          ctx.shadowColor = 'rgba(0, 229, 255, 0.85)';
          ctx.shadowBlur = 8;
          ctx.stroke();
        });
      });

      ctx.restore();
    }
  };

  // -------------------------------------------------------------
  // ANIMATION LOOP & SCROLL ORCHESTRATOR
  // -------------------------------------------------------------
  useEffect(() => {
    if (!isLoaded) return;

    let animationFrameId: number;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      const scrollTop = window.scrollY;
      const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

      // -------------------------------------------------------------
      // 0. FLOATING HERO LOGO TO TOP NAVBAR (0.00 to 0.04)
      // -------------------------------------------------------------
      const LOGO_SHRINK_END = 0.04;
      const logoProgress = Math.min(1, Math.max(0, scrollFraction / LOGO_SHRINK_END));
      // Smoothstep easing for liquid motion
      const logoEase = logoProgress * logoProgress * (3 - 2 * logoProgress);

      // Logo fade out when moving past Van showcase (0.19 to 0.22)
      let logoAlpha = 1;
      let logoExitY = 0;
      if (scrollFraction > 0.19) {
        const exitProgress = Math.min(1, Math.max(0, (scrollFraction - 0.19) / 0.03));
        logoAlpha = 1 - exitProgress;
        logoExitY = -exitProgress * 50;
      }

      if (logoPillRef.current) {
        const isMobile = window.innerWidth < 768;
        const targetTopOffset = isMobile ? 14 : 18;
        const maxTranslateY = -(window.innerHeight * 0.5 - targetTopOffset - (isMobile ? 22 : 28));
        const translateY = maxTranslateY * logoEase + logoExitY;
        const scale = 1.0 - logoEase * (isMobile ? 0.56 : 0.72);

        logoPillRef.current.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        logoPillRef.current.style.opacity = `${logoAlpha}`;
        logoPillRef.current.style.pointerEvents = logoAlpha > 0.05 ? 'auto' : 'none';
      }

      if (logoHintRef.current) {
        const hintOpacity = Math.max(0, 1 - logoProgress * 3.2);
        logoHintRef.current.style.opacity = `${hintOpacity}`;
        logoHintRef.current.style.transform = `translate3d(0, ${logoEase * 20}px, 0)`;
      }

      // -------------------------------------------------------------
      // 1. VAN ASSEMBLY & PAINTS (0.00 to 0.20)
      // -------------------------------------------------------------
      const TRIGGER_THRESHOLD = 0.04;
      const targetFrame = scrollFraction > TRIGGER_THRESHOLD ? TOTAL_ASSEMBLY_FRAMES - 1 : 0;

      const ASSEMBLY_FPS = 192;
      const frameDelta = deltaTime * ASSEMBLY_FPS;

      if (assemblyFrameRef.current < targetFrame) {
        assemblyFrameRef.current = Math.min(targetFrame, assemblyFrameRef.current + frameDelta);
      } else if (assemblyFrameRef.current > targetFrame) {
        assemblyFrameRef.current = Math.max(targetFrame, assemblyFrameRef.current - frameDelta);
      }

      if (scrollFraction >= 0.09) {
        assemblyFrameRef.current = TOTAL_ASSEMBLY_FRAMES - 1;
      } else if (scrollFraction > TRIGGER_THRESHOLD) {
        const scrollDrivenFrame = Math.floor(
          ((scrollFraction - TRIGGER_THRESHOLD) / (0.09 - TRIGGER_THRESHOLD)) *
            (TOTAL_ASSEMBLY_FRAMES - 1)
        );
        assemblyFrameRef.current = Math.max(assemblyFrameRef.current, scrollDrivenFrame);
      }

      // Animate Van Annotations:
      // 1. Exterior Upgrades appears animatedly while assembly frames play (0.038 to 0.19)
      // 2. Custom Paints appears when paints begin to change (0.088 to 0.19)
      if (annotationsRef.current) {
        let exteriorAlpha = 0;
        if (scrollFraction >= 0.038 && scrollFraction <= 0.19) {
          if (scrollFraction < 0.052) {
            exteriorAlpha = (scrollFraction - 0.038) / 0.014;
          } else if (scrollFraction > 0.18) {
            exteriorAlpha = (0.19 - scrollFraction) / 0.01;
          } else {
            exteriorAlpha = 1;
          }
        }

        let paintAlpha = 0;
        if (scrollFraction >= 0.088 && scrollFraction <= 0.19) {
          if (scrollFraction < 0.104) {
            paintAlpha = (scrollFraction - 0.088) / 0.016;
          } else if (scrollFraction > 0.18) {
            paintAlpha = (0.19 - scrollFraction) / 0.01;
          } else {
            paintAlpha = 1;
          }
        }

        const extVal = Math.min(1, Math.max(0, exteriorAlpha));
        const pntVal = Math.min(1, Math.max(0, paintAlpha));
        // Clean sequential cross-fade between titles so letters never overlap
        const extHeaderVal = pntVal > 0 ? Math.max(0, extVal * (1 - pntVal * 2.5)) : extVal;
        const pntHeaderVal = Math.min(1, Math.max(0, (pntVal - 0.25) * 1.33));

        annotationsRef.current.style.setProperty('--exterior-alpha', extVal.toFixed(3));
        annotationsRef.current.style.setProperty('--paint-alpha', pntVal.toFixed(3));
        annotationsRef.current.style.setProperty('--exterior-header-alpha', extHeaderVal.toFixed(3));
        annotationsRef.current.style.setProperty('--paint-header-alpha', pntHeaderVal.toFixed(3));
        annotationsRef.current.style.opacity = Math.max(extVal, pntVal) > 0.001 ? '1' : '0';
        annotationsRef.current.style.pointerEvents = Math.max(extVal, pntVal) > 0.1 ? 'auto' : 'none';
      }

      // Van Paints cross-fading based on scrollFraction (0.09 to 0.19)
      let targetIndex = -1;
      if (scrollFraction >= 0.09) {
        if (scrollFraction < 0.13) {
          targetIndex = 0; // Purple
        } else if (scrollFraction < 0.16) {
          targetIndex = 1; // Red
        } else {
          targetIndex = 2; // Green
        }
      } else {
        targetIndex = -1; // Unpainted
      }

      currentPaintIndexRef.current = targetIndex;
      const targetPos = targetIndex;
      const BLEND_SPEED = 7.0;
      visualPaintPosRef.current +=
        (targetPos - visualPaintPosRef.current) * Math.min(1, deltaTime * BLEND_SPEED);
      const v = visualPaintPosRef.current;

      let purpleAlpha = 0;
      let redAlpha = 0;
      let greenAlpha = 0;

      if (v <= -0.99) {
        purpleAlpha = 0;
        redAlpha = 0;
        greenAlpha = 0;
      } else if (v < 0.0) {
        const t = Math.max(0, Math.min(1, v + 1.0));
        purpleAlpha = t * t * (3 - 2 * t);
      } else if (v <= 1.0) {
        const t = Math.max(0, Math.min(1, v));
        const blend = t * t * (3 - 2 * t);
        purpleAlpha = 1 - blend;
        redAlpha = blend;
      } else if (v <= 2.0) {
        const t = Math.max(0, Math.min(1, v - 1.0));
        const blend = t * t * (3 - 2 * t);
        redAlpha = 1 - blend;
        greenAlpha = blend;
      } else {
        greenAlpha = 1;
      }

      renderVanFrame(scrollFraction, assemblyFrameRef.current, {
        purple: purpleAlpha,
        red: redAlpha,
        green: greenAlpha,
      });

      // -------------------------------------------------------------
      // 2. CUSTOMIZABLE ROOFS SHOWCASE (0.19 to 0.43)
      // -------------------------------------------------------------
      let targetRoofIdx = 0;
      if (scrollFraction < 0.29) {
        targetRoofIdx = 0; // Custom Lighting
      } else if (scrollFraction < 0.34) {
        targetRoofIdx = 1; // Spacious Luggage Holders
      } else {
        targetRoofIdx = 2; // Quality Sound Systems
      }

      if (activeRoofIndexRef.current !== targetRoofIdx) {
        activeRoofIndexRef.current = targetRoofIdx;
        setActiveRoofIndex(targetRoofIdx);
      }

      const ROOF_BLEND_SPEED = 7.0;
      activeRoofPosRef.current +=
        (targetRoofIdx - activeRoofPosRef.current) * Math.min(1, deltaTime * ROOF_BLEND_SPEED);

      renderRoofsCanvas();

      if (roofsContainerRef.current) {
        if (scrollFraction < 0.19) {
          roofsContainerRef.current.style.transform = 'translateY(100vh)';
          roofsContainerRef.current.style.pointerEvents = 'none';
        } else if (scrollFraction <= 0.24) {
          const progress = (scrollFraction - 0.19) / 0.05;
          roofsContainerRef.current.style.transform = `translateY(${(1 - progress) * 100}vh)`;
          roofsContainerRef.current.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
        } else if (scrollFraction <= 0.38) {
          roofsContainerRef.current.style.transform = 'translateY(0vh)';
          roofsContainerRef.current.style.pointerEvents = 'auto';
        } else if (scrollFraction <= 0.43) {
          const exitProgress = (scrollFraction - 0.38) / 0.05;
          roofsContainerRef.current.style.transform = `translateY(${-exitProgress * 100}vh)`;
          roofsContainerRef.current.style.pointerEvents = exitProgress < 0.5 ? 'auto' : 'none';
        } else {
          roofsContainerRef.current.style.transform = 'translateY(-100vh)';
          roofsContainerRef.current.style.pointerEvents = 'none';
        }
      }

      // -------------------------------------------------------------
      // 3. COMFY SEATS SHOWCASE (0.38 to 0.62)
      // -------------------------------------------------------------
      let targetSeatIdx = 0;
      if (scrollFraction < 0.48) {
        targetSeatIdx = 0; // Pearl White
      } else if (scrollFraction < 0.53) {
        targetSeatIdx = 1; // Cognac Brown
      } else {
        targetSeatIdx = 2; // Obsidian Black
      }

      if (activeSeatIndexRef.current !== targetSeatIdx) {
        activeSeatIndexRef.current = targetSeatIdx;
        setActiveSeatIndex(targetSeatIdx);
      }

      const SEAT_BLEND_SPEED = 7.0;
      activeSeatPosRef.current +=
        (targetSeatIdx - activeSeatPosRef.current) * Math.min(1, deltaTime * SEAT_BLEND_SPEED);

      renderSeatsCanvas();

      if (seatsContainerRef.current) {
        if (scrollFraction < 0.38) {
          seatsContainerRef.current.style.transform = 'translateY(100vh)';
          seatsContainerRef.current.style.pointerEvents = 'none';
        } else if (scrollFraction <= 0.43) {
          const progress = (scrollFraction - 0.38) / 0.05;
          seatsContainerRef.current.style.transform = `translateY(${(1 - progress) * 100}vh)`;
          seatsContainerRef.current.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
        } else if (scrollFraction <= 0.57) {
          seatsContainerRef.current.style.transform = 'translateY(0vh)';
          seatsContainerRef.current.style.pointerEvents = 'auto';
        } else if (scrollFraction <= 0.62) {
          const exitProgress = (scrollFraction - 0.57) / 0.05;
          seatsContainerRef.current.style.transform = `translateY(${-exitProgress * 100}vh)`;
          seatsContainerRef.current.style.pointerEvents = exitProgress < 0.5 ? 'auto' : 'none';
        } else {
          seatsContainerRef.current.style.transform = 'translateY(-100vh)';
          seatsContainerRef.current.style.pointerEvents = 'none';
        }
      }

      // -------------------------------------------------------------
      // 4. CAMERA MOTION & INTERIOR FEATURES (0.57 to 0.86)
      // -------------------------------------------------------------
      if (cameraContainerRef.current) {
        if (scrollFraction < 0.57) {
          cameraContainerRef.current.style.transform = 'translateY(100vh)';
          cameraContainerRef.current.style.pointerEvents = 'none';
        } else if (scrollFraction <= 0.62) {
          const progress = (scrollFraction - 0.57) / 0.05;
          cameraContainerRef.current.style.transform = `translateY(${(1 - progress) * 100}vh)`;
          cameraContainerRef.current.style.pointerEvents = progress > 0.5 ? 'auto' : 'none';
        } else if (scrollFraction <= 0.81) {
          cameraContainerRef.current.style.transform = 'translateY(0vh)';
          cameraContainerRef.current.style.pointerEvents = 'auto';
        } else if (scrollFraction <= 0.86) {
          const exitProgress = (scrollFraction - 0.81) / 0.05;
          cameraContainerRef.current.style.transform = `translateY(${-exitProgress * 100}vh)`;
          cameraContainerRef.current.style.pointerEvents = exitProgress < 0.5 ? 'auto' : 'none';
        } else {
          cameraContainerRef.current.style.transform = 'translateY(-100vh)';
          cameraContainerRef.current.style.pointerEvents = 'none';
        }
      }

      // Scroll-controlled camera frames & interior panel frames (0.62 to 0.81)
      const ROTATION_START = 0.62;
      const ROTATION_END = 0.71;
      const FEATURES_END = 0.81;

      if (scrollFraction >= ROTATION_START && scrollFraction <= 0.86) {
        let targetCameraFrameIndex = 0;
        let targetInteriorAlpha = 0;
        let targetLightingAlpha = 0;
        let targetRingsAlpha = 0;
        let currentText = 'Custom Interior';

        if (scrollFraction < ROTATION_END) {
          const rotationProgress = Math.min(
            1,
            Math.max(0, (scrollFraction - ROTATION_START) / (ROTATION_END - ROTATION_START))
          );
          targetCameraFrameIndex = rotationProgress * (TOTAL_CAMERA_FRAMES - 1);
          targetInteriorAlpha = 0;
          targetLightingAlpha = 0;
          targetRingsAlpha = 0;
          currentText = 'Custom Interior';
        } else {
          targetCameraFrameIndex = TOTAL_CAMERA_FRAMES - 1;

          const featureProgress = Math.min(
            1,
            Math.max(0, (scrollFraction - ROTATION_END) / (FEATURES_END - ROTATION_END))
          );

          if (featureProgress < 0.33) {
            currentText = 'Custom Interior Panels';
            targetInteriorAlpha = 1;
            targetLightingAlpha = 0;
            targetRingsAlpha = 0;
          } else if (featureProgress < 0.67) {
            currentText = 'Custom Interior Lighting';
            targetInteriorAlpha = 0;
            targetLightingAlpha = 1;
            targetRingsAlpha = 0;
          } else {
            currentText = 'Custom Infotainment System';
            targetInteriorAlpha = 0;
            targetLightingAlpha = 1; // lighting frame stays active underneath
            targetRingsAlpha = 1; // glowing sound rings active on top
          }
        }

        if (currentText !== cameraSubtitleRef.current) {
          cameraSubtitleRef.current = currentText;
          setCameraSubtitle(currentText);
        }

        const CAMERA_LERP = 14;
        cameraFrameRef.current +=
          (targetCameraFrameIndex - cameraFrameRef.current) * Math.min(1, deltaTime * CAMERA_LERP);

        const INTERIOR_LERP = 8.0;
        currentInteriorAlphaRef.current +=
          (targetInteriorAlpha - currentInteriorAlphaRef.current) *
          Math.min(1, deltaTime * INTERIOR_LERP);
        currentLightingAlphaRef.current +=
          (targetLightingAlpha - currentLightingAlphaRef.current) *
          Math.min(1, deltaTime * INTERIOR_LERP);
        currentRingsAlphaRef.current +=
          (targetRingsAlpha - currentRingsAlphaRef.current) *
          Math.min(1, deltaTime * INTERIOR_LERP);

        renderCameraCanvas(
          cameraFrameRef.current,
          currentInteriorAlphaRef.current,
          currentLightingAlphaRef.current,
          currentRingsAlphaRef.current,
          timestamp / 1000
        );
      } else if (scrollFraction < ROTATION_START) {
        cameraFrameRef.current = 0;
        currentInteriorAlphaRef.current = 0;
        currentLightingAlphaRef.current = 0;
        currentRingsAlphaRef.current = 0;
        if (cameraSubtitleRef.current !== 'Custom Interior') {
          cameraSubtitleRef.current = 'Custom Interior';
          setCameraSubtitle('Custom Interior');
        }
        renderCameraCanvas(0, 0, 0, 0, timestamp / 1000);
      }

      // -------------------------------------------------------------
      // 5. CONTACT SECTION SHOWCASE (0.81 to 1.00)
      // -------------------------------------------------------------
      if (contactContainerRef.current) {
        if (scrollFraction <= 0.81) {
          contactContainerRef.current.style.transform = 'translateY(100vh)';
          contactContainerRef.current.style.pointerEvents = 'none';
        } else if (scrollFraction <= 0.86) {
          const enterProgress = (scrollFraction - 0.81) / 0.05;
          contactContainerRef.current.style.transform = `translateY(${(1 - enterProgress) * 100}vh)`;
          contactContainerRef.current.style.pointerEvents = enterProgress > 0.5 ? 'auto' : 'none';
        } else {
          contactContainerRef.current.style.transform = 'translateY(0vh)';
          contactContainerRef.current.style.pointerEvents = 'auto';
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
      if (roofsCanvasRef.current && roofsRightColRef.current) {
        const rect = roofsRightColRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = rect.width || 680;
        const height = width * (10.5 / 16);
        roofsCanvasRef.current.width = width * dpr;
        roofsCanvasRef.current.height = height * dpr;
      }
      if (seatsCanvasRef.current && seatsRightColRef.current) {
        const rect = seatsRightColRef.current.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const isMobile = window.innerWidth < 768;
        const width = rect.width || (isMobile ? window.innerWidth * 0.9 : 680);
        const height = isMobile ? width * (10.5 / 16) : (rect.height || 600);
        seatsCanvasRef.current.width = width * dpr;
        seatsCanvasRef.current.height = height * dpr;
      }
      if (cameraCanvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        cameraCanvasRef.current.width = window.innerWidth * dpr;
        cameraCanvasRef.current.height = window.innerHeight * dpr;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [
    isLoaded,
    wheelImages,
    assemblyImages,
    paintImages,
    roofImages,
    seatImages,
    cameraImages,
    interiorImages,
  ]);

  const handleRoofSelect = (index: number) => {
    activeRoofIndexRef.current = index;
    setActiveRoofIndex(index);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetFraction = 0.24 + (index + 0.5) * (0.14 / 3);
    window.scrollTo({ top: targetFraction * maxScroll, behavior: 'smooth' });
  };

  const handleSeatSelect = (index: number) => {
    activeSeatIndexRef.current = index;
    setActiveSeatIndex(index);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetFraction = 0.43 + (index + 0.5) * (0.14 / 3);
    window.scrollTo({ top: targetFraction * maxScroll, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isLoaded) {
    return <LoadingScreen progress={loadProgress} />;
  }

  return (
    <div className="scroll-container">
      {/* Floating Hero to Top Navigation Logo */}
      <HeaderLogo
        ref={logoHeaderRef}
        pillRef={logoPillRef}
        hintRef={logoHintRef}
        onLogoClick={handleLogoClick}
      />

      {/* 1. Van Showcase (Wheel Entrance, Assembly, Paints) */}
      <VanShowcase
        ref={containerRef}
        canvasRef={canvasRef}
        annotationsRef={annotationsRef}
        showPaintButtons={showPaintButtons}
        selectedPaint={selectedPaint}
        setSelectedPaint={setSelectedPaint}
        paintScale={paintScale}
        setPaintScale={setPaintScale}
        paintXOffset={paintXOffset}
        setPaintXOffset={setPaintXOffset}
        paintYOffset={paintYOffset}
        setPaintYOffset={setPaintYOffset}
        copied={copied}
        setCopied={setCopied}
      />

      {/* 2. Customizable Roofs Showcase */}
      <RoofsShowcase
        ref={roofsContainerRef}
        activeRoofIndex={activeRoofIndex}
        onRoofSelect={handleRoofSelect}
        roofsRightColRef={roofsRightColRef}
        roofsCanvasRef={roofsCanvasRef}
      />

      {/* 3. Luxury Comfy Seats Showcase */}
      <SeatsShowcase
        ref={seatsContainerRef}
        activeSeatIndex={activeSeatIndex}
        onSeatSelect={handleSeatSelect}
        seatsRightColRef={seatsRightColRef}
        seatsCanvasRef={seatsCanvasRef}
      />

      {/* 4. 360 Camera & Interior Transformation Showcase */}
      <CameraShowcase
        ref={cameraContainerRef}
        cameraSubtitle={cameraSubtitle}
        cameraCanvasRef={cameraCanvasRef}
      />

      {/* 5. Contact Us Showcase Section */}
      <ContactSection ref={contactContainerRef} />
    </div>
  );
}

export default App;
