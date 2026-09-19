import type { JSX } from "@solidjs/web";
import { Image } from "@kobalte/core/image";
import { Icon } from "~/components/Icon";
import { useAboutController } from "./about.controller";

/**
 * About section presentation highlighting personal background, credentials, and contact summary.
 */
export function AboutPresentation(): JSX.Element {
  const c = useAboutController();

  return (
    <section id="About" class="w-full max-w-4xl mx-auto px-4 sm:px-8 py-20 animate-fade-in">
      <div class="card bg-base-200/50 backdrop-blur-md border border-base-300 shadow-xl rounded-box p-6 sm:p-10">
        <div class="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Avatar with Kobalte Image */}
          <div class="shrink-0">
            <Image class="relative">
              <Image.Img
                src={c.avatarUrl}
                alt={c.fullName}
                class="w-36 h-36 sm:w-44 sm:h-44 rounded-full object-cover shadow-2xl ring-4 ring-primary/30"
              />
              <Image.Fallback class="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-base-300 flex items-center justify-center text-2xl font-bold text-base-content/60 ring-4 ring-primary/30">
                NK
              </Image.Fallback>
            </Image>
          </div>

          {/* Text Content */}
          <div class="flex-1 flex flex-col text-center md:text-left">
            <h2 class="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
              About Me
            </h2>

            <p class="text-sm sm:text-base text-base-content/80 leading-relaxed mt-3">
              I am a computer engineer, full-stack developer, and classical music composer with
              experience in software development, database architectures, and smart systems design.
              Active across various university events, I leverage collaboration, problem-solving, and
              team coordination to achieve results.
            </p>

            <div class="divider my-4" />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-base-content/80">
              <div class="flex items-center justify-center md:justify-start gap-2.5">
                <Icon name="location" size={16} class="text-primary shrink-0" />
                <span>{c.location}</span>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2.5">
                <Icon name="mail" size={16} class="text-primary shrink-0" />
                <a
                  href={`mailto:${c.email}`}
                  class="link link-hover text-base-content hover:text-primary transition-colors"
                >
                  {c.email}
                </a>
              </div>

              <div class="flex items-center justify-center md:justify-start gap-2.5">
                <Icon name="phone" size={16} class="text-primary shrink-0" />
                <a
                  href={`tel:${c.phone.replace(/\s+/g, "")}`}
                  class="link link-hover text-base-content hover:text-primary transition-colors"
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
      </div>
    </section>
  );
}
