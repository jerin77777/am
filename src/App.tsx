import { useEffect, useRef, useState } from 'react'
import './App.css'

const TOTAL_WHEEL_FRAMES = 96;
const TOTAL_ASSEMBLY_FRAMES = 144;
const PAINTS = ['purple', 'red', 'green'];
const VAN_SCALE = 0.7; // 70% of screen size

const DEBUG_PAINT = import.meta.env.VITE_DEBUG_PAINT === 'true';

const DEFAULT_PAINT_OFFSETS: Record<string, { scale: number; x: number; y: number }> = {
  purple: { scale: 0.475, x: -56, y: 31 },
  red: { scale: 0.495, x: -56, y: -13 },
  green: { scale: 0.550, x: -5, y: 46 },
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [wheelImages, setWheelImages] = useState<HTMLImageElement[]>([]);
  const [assemblyImages, setAssemblyImages] = useState<HTMLImageElement[]>([]);
  const [paintImages, setPaintImages] = useState<Record<string, HTMLImageElement>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

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

  useEffect(() => {
    const preloadAssets = async () => {
      const loadedWheel: HTMLImageElement[] = [];
      const loadedAssembly: HTMLImageElement[] = [];
      const loadedPaints: Record<string, HTMLImageElement> = {};

      const totalToLoad = TOTAL_WHEEL_FRAMES + TOTAL_ASSEMBLY_FRAMES + PAINTS.length;
      let completedCount = 0;

      const updateProgress = () => {
        completedCount++;
        setLoadProgress(Math.floor((completedCount / totalToLoad) * 100));
      };

      const promises: Promise<void>[] = [];

      // Preload wheel frames (96 frames)
      for (let i = 1; i <= TOTAL_WHEEL_FRAMES; i++) {
        const img = new Image();
        img.src = `/wheel_frames/frame_${String(i).padStart(4, '0')}.png`;
        promises.push(new Promise((resolve) => {
          img.onload = () => { updateProgress(); resolve(); };
          img.onerror = () => {
            console.error(`Failed to load wheel frame: ${img.src}`);
            updateProgress();
            resolve();
          };
        }));
        loadedWheel.push(img);
      }

      // Preload assembly frames (144 frames)
      for (let i = 1; i <= TOTAL_ASSEMBLY_FRAMES; i++) {
        const img = new Image();
        img.src = `/assembly_frames/frame_${String(i).padStart(4, '0')}.png`;
        promises.push(new Promise((resolve) => {
          img.onload = () => { updateProgress(); resolve(); };
          img.onerror = () => {
            console.error(`Failed to load assembly frame: ${img.src}`);
            updateProgress();
            resolve();
          };
        }));
        loadedAssembly.push(img);
      }

      // Preload paints
      PAINTS.forEach(color => {
        const img = new Image();
        img.src = `/paints/${color}paint.png`;
        promises.push(new Promise((resolve) => {
          img.onload = () => {
            loadedPaints[color] = img;
            updateProgress();
            resolve();
          };
          img.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.src = `/paints/${color}.png`;
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
        }));
      });

      await Promise.all(promises);
      setWheelImages(loadedWheel);
      setAssemblyImages(loadedAssembly);
      setPaintImages(loadedPaints);
      setIsLoaded(true);
    };

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    preloadAssets();
  }, []);

  const assemblyFrameRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const renderFrame = (scrollFraction: number, assemblyFrameIndex: number) => {
    if (!canvasRef.current || wheelImages.length === 0 || assemblyImages.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawImageScaled = (
      img: HTMLImageElement,
      alpha = 1,
      refImg?: HTMLImageElement,
      paintScale = 1,
      yOffset = 0,
      xOffset = 0,
      extraPixelXOffset = 0
    ) => {
      ctx.globalAlpha = alpha;

      const scaleRef = refImg || img;
      const hRatio = canvas.width / scaleRef.width;
      const vRatio = canvas.height / scaleRef.height;
      const ratio = Math.min(hRatio, vRatio) * VAN_SCALE;

      const finalRatio = ratio * paintScale;

      const destWidth = img.width * finalRatio;
      const destHeight = img.height * finalRatio;

      const centerShift_x = (canvas.width - scaleRef.width * ratio) / 2;
      const centerShift_y = (canvas.height - scaleRef.height * ratio) / 2;

      const adjustedX = centerShift_x + (scaleRef.width * ratio - destWidth) / 2 + (xOffset * ratio) + extraPixelXOffset;
      const adjustedY = centerShift_y + (scaleRef.height * ratio - destHeight) / 2 + (yOffset * ratio);

      ctx.drawImage(img, 0, 0, img.width, img.height,
        adjustedX, adjustedY, destWidth, destHeight);

      ctx.globalAlpha = 1;
    };

    const baseAssemblyImg = assemblyImages[TOTAL_ASSEMBLY_FRAMES - 1];

    // Stage 4 Exit Scroll-Up effect (0.85 to 1.00)
    if (containerRef.current) {
      if (scrollFraction <= 0.85) {
        containerRef.current.style.transform = 'translateY(0vh)';
      } else {
        const exitProgress = Math.min(1, Math.max(0, (scrollFraction - 0.85) / 0.15));
        containerRef.current.style.transform = `translateY(${-exitProgress * 110}vh)`;
      }
    }

    const currentAssemblyIndex = Math.min(
      TOTAL_ASSEMBLY_FRAMES - 1,
      Math.floor(assemblyFrameIndex)
    );

    if (currentAssemblyIndex === 0 && scrollFraction <= 0.25) {
      // Stage 1: Wheel rotation & entrance from left (0.0 to 0.25) - scroll controlled
      if (DEBUG_PAINT) setShowPaintButtons((prev) => (prev ? false : prev));

      const progress = Math.min(1, Math.max(0, scrollFraction / 0.25));
      const wheelIndex = Math.min(
        TOTAL_WHEEL_FRAMES - 1,
        Math.floor(progress * TOTAL_WHEEL_FRAMES)
      );
      const img = wheelImages[wheelIndex];
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio) * VAN_SCALE;
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const destWidth = img.width * ratio;

        const extraXPixels = (1 - progress) * (-(centerShift_x + destWidth));

        drawImageScaled(img, 1, undefined, 1, 0, 0, extraXPixels);
      }
    } else {
      // Assembly sequence triggered by scroll - plays smoothly in both directions
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
        // Paints fade in/out when assembly is fully finished (frame 143) and scrollFraction > 0.60
        if (currentAssemblyIndex >= TOTAL_ASSEMBLY_FRAMES - 1 && scrollFraction > 0.60) {
          const paintProgress = Math.min(1, Math.max(0, (scrollFraction - 0.60) / 0.25));
          const scaledPos = paintProgress * 3; // 0.0 to 3.0

          let purpleAlpha = 0;
          let redAlpha = 0;
          let greenAlpha = 0;

          if (scaledPos <= 0.2) {
            purpleAlpha = scaledPos / 0.2;
          } else if (scaledPos <= 0.7) {
            purpleAlpha = 1;
          } else if (scaledPos <= 1.0) {
            const t = (scaledPos - 0.7) / 0.3;
            purpleAlpha = 1 - t;
            redAlpha = t;
          } else if (scaledPos <= 1.7) {
            redAlpha = 1;
          } else if (scaledPos <= 2.0) {
            const t = (scaledPos - 1.7) / 0.3;
            redAlpha = 1 - t;
            greenAlpha = t;
          } else {
            greenAlpha = 1;
          }

          const drawPaintWithAlpha = (color: string, alpha: number) => {
            if (alpha <= 0) return;
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
          };

          drawPaintWithAlpha('purple', purpleAlpha);
          drawPaintWithAlpha('red', redAlpha);
          drawPaintWithAlpha('green', greenAlpha);
        }
      }
    }
  };

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

      // Scroll threshold: > 0.25 triggers assembly forward, <= 0.25 triggers assembly backward (de-assemble)
      const TRIGGER_THRESHOLD = 0.25;
      const targetFrame = scrollFraction > TRIGGER_THRESHOLD ? TOTAL_ASSEMBLY_FRAMES - 1 : 0;

      // Speed of assembly animation (frames per second) - 2x speed (96 FPS)
      const ASSEMBLY_FPS = 96;
      const frameDelta = deltaTime * ASSEMBLY_FPS;

      if (assemblyFrameRef.current < targetFrame) {
        assemblyFrameRef.current = Math.min(targetFrame, assemblyFrameRef.current + frameDelta);
      } else if (assemblyFrameRef.current > targetFrame) {
        assemblyFrameRef.current = Math.max(targetFrame, assemblyFrameRef.current - frameDelta);
      }

      renderFrame(scrollFraction, assemblyFrameRef.current);

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isLoaded, wheelImages, assemblyImages, paintImages]);

  if (!isLoaded) {
    return (
      <div style={{ color: '#333', backgroundColor: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem', fontFamily: 'sans-serif' }}>
        <div>Loading assets... {loadProgress}%</div>
        <div style={{ width: '200px', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${loadProgress}%`, height: '100%', backgroundColor: '#007acc', transition: 'width 0.2s ease' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-container">
      <div ref={containerRef} className="canvas-container">
        <canvas ref={canvasRef} />
      </div>

      {DEBUG_PAINT && showPaintButtons && (
        <div className="paint-buttons-container">
          {PAINTS.map((color) => {
            const colorHex = color === 'purple' ? '#8e44ad' : color === 'red' ? '#e74c3c' : '#2ecc71';
            const isActive = selectedPaint === color;
            return (
              <button
                key={color}
                className={`color-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (isActive) {
                    setSelectedPaint(null);
                  } else {
                    setSelectedPaint(color);
                    const defs = DEFAULT_PAINT_OFFSETS[color] || DEFAULT_PAINT_OFFSETS.purple;
                    setPaintScale(defs.scale);
                    setPaintXOffset(defs.x);
                    setPaintYOffset(defs.y);
                  }
                }}
              >
                <span className="color-swatch" style={{ backgroundColor: colorHex }} />
                <span className="color-name">{color.charAt(0).toUpperCase() + color.slice(1)}</span>
              </button>
            );
          })}

          {selectedPaint && (
            <div className="paint-controls-card">
              <div className="controls-header">Adjust Position</div>

              <div className="control-group">
                <div className="control-label">
                  <span>Scale</span>
                  <span>{paintScale.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.005"
                  value={paintScale}
                  onChange={(e) => setPaintScale(parseFloat(e.target.value))}
                  className="control-slider"
                />
              </div>

              <div className="control-group">
                <div className="control-label">
                  <span>Offset X</span>
                  <span>{Math.round(paintXOffset)}px</span>
                </div>
                <input
                  type="range"
                  min="-600"
                  max="600"
                  step="1"
                  value={paintXOffset}
                  onChange={(e) => setPaintXOffset(parseFloat(e.target.value))}
                  className="control-slider"
                />
              </div>

              <div className="control-group">
                <div className="control-label">
                  <span>Offset Y</span>
                  <span>{Math.round(paintYOffset)}px</span>
                </div>
                <input
                  type="range"
                  min="-600"
                  max="600"
                  step="1"
                  value={paintYOffset}
                  onChange={(e) => setPaintYOffset(parseFloat(e.target.value))}
                  className="control-slider"
                />
              </div>

              <div className="button-row">
                <button
                  className="copy-btn"
                  onClick={() => {
                    const textToCopy = `Scale: ${paintScale.toFixed(3)}, X Offset: ${Math.round(paintXOffset)}px, Y Offset: ${Math.round(paintYOffset)}px`;
                    navigator.clipboard.writeText(textToCopy);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? 'Copied! ✓' : 'Copy Values'}
                </button>

                <button
                  className="reset-btn"
                  onClick={() => {
                    const defs = (selectedPaint && DEFAULT_PAINT_OFFSETS[selectedPaint]) || DEFAULT_PAINT_OFFSETS.purple;
                    setPaintScale(defs.scale);
                    setPaintXOffset(defs.x);
                    setPaintYOffset(defs.y);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App

