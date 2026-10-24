import type { JSX } from "@solidjs/web";
import { onSettled, type ParentProps } from "solid-js";
import { initParticleEngine } from "./particleEngine";

/**
 * 3D perspective sine-wave particle canvas background.
 */
export function Background(props: ParentProps): JSX.Element {
  let canvasRef: HTMLCanvasElement | null = null;

  onSettled(() => {
    if (!canvasRef) return;
    return initParticleEngine(canvasRef);
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
