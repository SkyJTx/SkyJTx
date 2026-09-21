import type { JSX } from "@solidjs/web";
import { Loading } from "solid-js";
import { SocialLinks } from "~/components/SocialLinks";
import { ScrollIndicator } from "~/components/ScrollIndicator";
import { useHomeController } from "./home.controller";

/**
 * Inner content reading dynamic personal info from the controller.
 */
function HomeContent(): JSX.Element {
  const c = useHomeController();

  return (
    <section
      id="Home"
      class="min-h-screen min-h-dvh w-full flex flex-col justify-between items-center px-4 sm:px-8 py-16 text-center scroll-mt-16"
    >
      <div class="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto gap-6 animate-fade-in">
        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-base-content">
          {c.personalInfo.fullName}
        </h1>

        <p class="text-lg sm:text-xl font-medium text-primary max-w-xl leading-relaxed">
          {c.personalInfo.tagline}
        </p>

        <p class="text-base text-base-content/70 max-w-lg leading-relaxed">
          {c.personalInfo.description}
        </p>

        <div class="mt-4">
          <SocialLinks
            githubUrl={c.personalInfo.githubUrl}
            linkedinUrl={c.personalInfo.linkedinUrl}
            emailAddress={c.personalInfo.email}
          />
        </div>
      </div>

      <div class="pt-8">
        <ScrollIndicator label="Scroll Down" onClick={c.handleScrollDown} />
      </div>
    </section>
  );
}

/**
 * The primary landing hero presentation for the portfolio wrapped in a Loading boundary.
 */
export function HomePresentation(): JSX.Element {
  return (
    <Loading
      fallback={
        <section
          id="Home"
          class="min-h-screen min-h-dvh w-full flex flex-col justify-center items-center px-4 sm:px-8 py-16 text-center scroll-mt-16"
        >
          <div class="flex flex-col items-center gap-4 max-w-3xl mx-auto w-full">
            <div class="skeleton h-12 w-64 rounded-box" />
            <div class="skeleton h-6 w-96 rounded-box" />
            <div class="skeleton h-4 w-80 rounded-box" />
          </div>
        </section>
      }
    >
      <HomeContent />
    </Loading>
  );
}
