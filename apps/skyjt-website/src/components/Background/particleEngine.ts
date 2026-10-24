import { type RGB, parseRgbColor } from "./colorUtils";

export function initParticleEngine(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let animationFrameId: number;
  let width = 0;
  let height = 0;
  let time = 0;

  let primaryRgb: RGB = { r: 79, g: 70, b: 229 };
  let secondaryRgb: RGB = { r: 109, g: 120, b: 189 };

  const updateColors = () => {
    if (typeof document === "undefined") return;
    const style = getComputedStyle(document.documentElement);
    const primaryHex = style.getPropertyValue("--seed").trim() || "#4f46e5";
    primaryRgb = parseRgbColor(primaryHex);
    secondaryRgb = {
      r: Math.min(255, primaryRgb.r + 30),
      g: Math.min(255, primaryRgb.g + 50),
      b: Math.max(0, primaryRgb.b - 40),
    };
  };

  updateColors();

  const mutationObserver = new MutationObserver(() => {
    updateColors();
  });
  mutationObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style", "data-theme"],
  });

  const updateDimensions = (newWidth: number, newHeight: number) => {
    if (newWidth <= 0 || newHeight <= 0) return;
    if (width === newWidth && height === newHeight) return;
    const dpr = window.devicePixelRatio || 1;
    width = newWidth;
    height = newHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  };

  const initialWidth = window.innerWidth || 300;
  const initialHeight = window.innerHeight || 150;
  updateDimensions(initialWidth, initialHeight);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const entryWidth = entry.contentRect.width || entry.target.clientWidth;
      const entryHeight = entry.contentRect.height || entry.target.clientHeight;
      if (entryWidth > 0 && entryHeight > 0) {
        updateDimensions(entryWidth, entryHeight);
      }
    }
  });
  resizeObserver.observe(canvas);

  const handleResize = () => {
    updateDimensions(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", handleResize);

  const cols = 50;
  const rows = 45;
  const spacing = 32;

  const draw = () => {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, width, height);

    time += 0.015;

    const centerX = width / 2;
    const centerY = height * 0.65;

    const cameraAngle = 0.9;
    const cosAngle = Math.cos(cameraAngle);
    const sinAngle = Math.sin(cameraAngle);
    const fov = 350;

    for (let r = 0; r < rows; r++) {
      const zOffset = (r - rows / 2) * spacing;
      const wavePhase = time * 1.5 + r * 0.12;

      for (let c = 0; c < cols; c++) {
        const xOffset = (c - cols / 2) * spacing;
        const distFromCenter = Math.sqrt(xOffset * xOffset + zOffset * zOffset);

        const y =
          Math.sin(wavePhase + c * 0.1) * 35 +
          Math.sin(distFromCenter * 0.015 - time * 2) * 20;

        const rotY = y * cosAngle - zOffset * sinAngle;
        const rotZ = y * sinAngle + zOffset * cosAngle + 800;

        if (rotZ <= 50) continue;

        const scale = fov / rotZ;
        const projX = centerX + xOffset * scale;
        const projY = centerY + rotY * scale;

        const size = Math.max(0.6, (1.8 + Math.sin(wavePhase + c * 0.05) * 0.8) * scale);
        const depthRatio = Math.max(0, Math.min(1, (rotZ - 200) / 1200));
        const alpha = Math.max(0.04, Math.min(0.7, (1 - depthRatio * 0.75) * (size / 2.5)));

        const isSecondary = (r + c) % 4 === 0;
        const color = isSecondary ? secondaryRgb : primaryRgb;

        ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(projX, projY, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animationFrameId = requestAnimationFrame(draw);
  };

  animationFrameId = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(animationFrameId);
    mutationObserver.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("resize", handleResize);
  };
}
