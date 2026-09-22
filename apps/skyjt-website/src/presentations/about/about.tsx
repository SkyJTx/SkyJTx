import type { JSX } from "@solidjs/web";
import { createSignal, Loading } from "solid-js";
import { Image } from "@kobalte/core/image";
import { Icon } from "~/components/Icon";
import { useAboutController } from "./about.controller";
import { useParallax } from "./useParallax";

/**
 * Inner content reading profile details from the controller and rendering with parallax layers.
 */
function AboutContent(): JSX.Element {
  const c = useAboutController();
  const [sectionRef, setSectionRef] = createSignal<HTMLElement | null>(null);
  useParallax(sectionRef, {
    maxTilt: 2,
    enableTilt: true,
    enableCursorLight: true,
  });

  return (
    <section
      ref={setSectionRef}
      id="About"
      class="min-h-screen min-h-dvh w-full max-w-4xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 relative overflow-visible animate-fade-in"
      style={{
        "--parallax-bg": "0px",
        "--parallax-avatar": "0px",
        "--parallax-content": "0px",
        "--tilt-x": "0deg",
        "--tilt-y": "0deg",
        "--tilt-shift-x": "0px",
        "--tilt-shift-y": "0px",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
        "--cursor-light-opacity": "0",
        perspective: "1000px",
      }}
    >
      <div
        class="absolute -inset-8 sm:-inset-16 bg-radial from-primary/25 via-primary/5 to-transparent pointer-events-none -z-10 blur-3xl rounded-full will-change-transform transition-transform duration-75 ease-out"
        style={{
          transform:
            "translate3d(calc(var(--tilt-shift-x, 0px) * 1.2), calc(var(--tilt-shift-y, 0px) * 1.2 + var(--parallax-bg, 0px)), -10px)",
        }}
      />

      <div
        class="w-full flex flex-col md:flex-row items-center gap-8 md:gap-14 overflow-visible rounded-3xl p-6 sm:p-10 transition-transform duration-75 ease-out relative"
        style={{
          "transform-style": "preserve-3d",
          transform: "rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
        }}
      >
        <div
          class="absolute inset-0 rounded-3xl pointer-events-none -z-5 transition-opacity duration-500 ease-out"
          style={{
            opacity: "var(--cursor-light-opacity, 0)",
            background:
              "radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(from var(--seed) 0.85 0.15 h / 0.18), transparent 70%)",
          }}
        />

        <div
          class="shrink-0 relative will-change-transform flex flex-col items-center"
          style={{
            transform:
              "translate3d(calc(var(--tilt-shift-x, 0px) * -0.8), calc(var(--tilt-shift-y, 0px) * -0.8 + var(--parallax-avatar, 0px)), 15px)",
          }}
        >
          <div class="relative">
            <div class="absolute -inset-2 rounded-full bg-primary/20 blur-lg pointer-events-none" />
            <Image class="relative">
              <Image.Img
                src={c.avatarUrl}
                alt={c.fullName}
                class="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover shadow-2xl ring-4 ring-primary/40"
              />
              <Image.Fallback class="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold text-base-content/60 ring-4 ring-primary/40">
                NK
              </Image.Fallback>
            </Image>
          </div>

          <div class="mt-3.5 text-center">
            <h3 class="text-base sm:text-lg font-bold text-base-content tracking-tight">
              {c.fullName}
            </h3>
          </div>
        </div>

        <div
          class="flex-1 min-w-0 flex flex-col text-center md:text-left w-full will-change-transform"
          style={{
            transform: "translate3d(0, var(--parallax-content, 0px), 5px)",
          }}
        >
          <h2 class="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
            About Me
          </h2>

          <p class="text-sm sm:text-base text-base-content/80 leading-relaxed mt-4">
            I am a computer engineer, full-stack developer, and classical music composer with
            experience in software development, database architectures, and smart systems design.
            Active across various university events, I leverage collaboration, problem-solving, and
            team coordination to achieve results.
          </p>

          <div class="divider my-5" />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm text-base-content/80">
            <div class="flex items-center justify-center md:justify-start gap-2.5 min-w-0">
              <Icon name="location" size={16} class="text-primary shrink-0" />
              <span class="truncate">{c.location}</span>
            </div>

            <div class="flex items-center justify-center md:justify-start gap-2.5 min-w-0">
              <Icon name="mail" size={16} class="text-primary shrink-0" />
              <a
                href={`mailto:${c.email}`}
                class="link link-hover text-base-content hover:text-primary transition-colors break-all"
              >
                {c.email}
              </a>
            </div>

            <div class="flex items-center justify-center md:justify-start gap-2.5 min-w-0">
              <Icon name="phone" size={16} class="text-primary shrink-0" />
              <a
                href={`tel:${c.phone.replace(/\s+/g, "")}`}
                class="link link-hover text-base-content hover:text-primary transition-colors break-all"
              >
                {c.phone}
              </a>
            </div>
          </div>

          <div class="mt-6 flex justify-center md:justify-start">
            <a
              href={c.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary btn-sm gap-2 shadow-sm font-semibold"
            >
              <Icon name="resume" size={16} />
              View CV / Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * About section presentation highlighting personal background, credentials, and contact summary.
 */
export function AboutPresentation(): JSX.Element {
  return (
    <Loading
      fallback={
        <section
          id="About"
          class="min-h-screen min-h-dvh w-full max-w-4xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 relative overflow-visible"
        >
          <div class="w-full flex flex-col md:flex-row items-center gap-8 md:gap-14 overflow-visible">
            <div class="flex flex-col items-center gap-3 shrink-0">
              <div class="skeleton w-36 h-36 sm:w-48 sm:h-48 rounded-full" />
              <div class="skeleton h-5 w-32 rounded-box" />
            </div>
            <div class="flex-1 flex flex-col gap-4 w-full">
              <div class="skeleton h-10 w-48 mx-auto md:mx-0 rounded-box" />
              <div class="skeleton h-20 w-full rounded-box" />
              <div class="skeleton h-8 w-64 mx-auto md:mx-0 rounded-box" />
            </div>
          </div>
        </section>
      }
    >
      <AboutContent />
    </Loading>
  );
}
