import { JSX, onMount, onCleanup } from "solid-js";
import { styled, useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";

const BackgroundContainer = styled("div")<{ theme: Theme }>`
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const CanvasElement = styled("canvas")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const ChildrenContainer = styled("div")`
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface BackgroundProps {
  children?: JSX.Element;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function Background(props: BackgroundProps) {
  const theme = useTheme() as Theme;
  let canvasRef: HTMLCanvasElement | undefined;

  onMount(() => {
    if (!canvasRef) return;

    const ctx = canvasRef.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    const resizeCanvas = () => {
      if (!canvasRef) return;
      const rect = canvasRef.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvasRef.width = width * dpr;
      canvasRef.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const cols = 50;
    const rows = 45;
    const spacing = 32;

    const draw = () => {
      if (!ctx || !canvasRef) return;
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

      const primaryRgb = hexToRgb(theme.colors.primary) || { r: 56, g: 189, b: 248 };
      const secondaryRgb = hexToRgb(theme.colors.secondary) || { r: 14, g: 165, b: 233 };

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

    onCleanup(() => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    });
  });

  return (
    <BackgroundContainer theme={theme}>
      <CanvasElement ref={canvasRef} />
      <ChildrenContainer>{props.children}</ChildrenContainer>
    </BackgroundContainer>
  );
}
