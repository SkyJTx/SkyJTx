import type { JSX } from "@solidjs/web";
import { onSettled, type ParentProps } from "solid-js";

interface RGB {
  r: number;
  g: number;
  b: number;
}

function parseRgbColor(str: string): RGB {
  if (str.startsWith("#")) {
    const hex = str.replace("#", "");
    if (hex.length === 6) {
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16),
      };
    }
  }
  const match = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match && match[1] && match[2] && match[3]) {
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  }
  return { r: 99, g: 102, b: 241 };
}

/**
 * 3D perspective sine-wave particle canvas background.
 */
export function Background(props: ParentProps): JSX.Element {
  let canvasRef: HTMLCanvasElement | null = null;

  onSettled(() => {
    if (!canvasRef) return;
    const canvas = canvasRef;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

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

      const fov = 500;
      const viewerDistance = 450;

      interface ProjectedPoint {
        x: number;
        y: number;
        z: number;
        scale: number;
        height: number;
      }

      const projectedPoints: ProjectedPoint[] = [];

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const gx = (c - cols / 2) * spacing;
          const gz = (r - rows / 2) * spacing;

          const distance = Math.sqrt(gx * gx + gz * gz);
          const gy =
            Math.sin(c * 0.15 + time) * 15 +
            Math.cos(r * 0.15 + time * 0.8) * 15 +
            Math.sin(distance * 0.012 - time * 1.2) * 10;

          const ry = gy * cosAngle - gz * sinAngle;
          const rz = gy * sinAngle + gz * cosAngle;

          const transZ = rz + viewerDistance;
          if (transZ <= 0) continue;

          const scale = fov / transZ;
          const px = centerX + gx * scale;
          const py = centerY + ry * scale;

          projectedPoints.push({
            x: px,
            y: py,
            z: transZ,
            scale,
            height: gy,
          });
        }
      }

      projectedPoints.sort((a, b) => b.z - a.z);

      const style = getComputedStyle(document.documentElement);
      const primaryHex = style.getPropertyValue("--seed").trim() || "#4f46e5";
      const primaryRgb = parseRgbColor(primaryHex);
      const secondaryRgb: RGB = {
        r: Math.min(255, primaryRgb.r + 30),
        g: Math.min(255, primaryRgb.g + 50),
        b: Math.max(0, primaryRgb.b - 40),
      };

      const minZ = viewerDistance - (rows / 2) * spacing;
      const maxZ = viewerDistance + (rows / 2) * spacing;

      for (const pt of projectedPoints) {
        if (pt.x < 0 || pt.x > width || pt.y < 0 || pt.y > height) continue;

        const size = Math.max(0.4, pt.scale * 1.6);
        let alpha = 1 - (pt.z - minZ) / (maxZ - minZ);
        alpha = Math.max(0.05, Math.min(0.75, alpha));

        const factor = Math.max(0, Math.min(1, (pt.height + 40) / 80));
        const r = Math.round(primaryRgb.r + factor * (secondaryRgb.r - primaryRgb.r));
        const g = Math.round(primaryRgb.g + factor * (secondaryRgb.g - primaryRgb.g));
        const b = Math.round(primaryRgb.b + factor * (secondaryRgb.b - primaryRgb.b));

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  });

  return (
    <div class="relative min-h-screen w-full bg-base-100 flex flex-col items-center justify-start overflow-visible">
      <canvas
        ref={(el) => {
          canvasRef = el;
        }}
        class="fixed inset-0 w-full h-screen pointer-events-none z-0"
      />
      <div class="relative z-10 w-full flex flex-col items-center justify-center">
        {props.children}
      </div>
    </div>
  );
}
