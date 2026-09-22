import type { JSX } from "@solidjs/web";
import { Loading } from "solid-js";
import { Image } from "@kobalte/core/image";
import { Icon } from "~/components/Icon";
import { useAboutController } from "./about.controller";
import { useParallax } from "./useParallax";

/**
 * Inner content reading profile details from the controller and rendering with parallax layers.
 */
function AboutContent(): JSX.Element {
  const c = useAboutController();
  let sectionRef: HTMLElement | null = null;
  const parallax = useParallax(() => sectionRef);

  return (
    <section
      ref={(el) => {
        sectionRef = el;
      }}
      id="About"
      class="min-h-screen min-h-dvh w-full max-w-4xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 relative overflow-visible animate-fade-in"
    >
      <div
        class="absolute -inset-4 sm:-inset-10 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-2xl rounded-full transition-transform duration-75 will-change-transform"
        style={{ transform: `translate3d(0, ${parallax.bgOffset()}px, 0)` }}
      />

      <div class="w-full flex flex-col md:flex-row items-center gap-8 md:gap-14 overflow-visible">
        <div
          class="shrink-0 relative transition-transform duration-75 will-change-transform"
          style={{ transform: `translate3d(0, ${parallax.avatarOffset()}px, 0)` }}
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
        </div>

        <div
          class="flex-1 min-w-0 flex flex-col text-center md:text-left w-full transition-transform duration-75 will-change-transform"
          style={{ transform: `translate3d(0, ${parallax.contentOffset()}px, 0)` }}
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
            <div class="skeleton w-36 h-36 sm:w-48 sm:h-48 rounded-full shrink-0" />
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
