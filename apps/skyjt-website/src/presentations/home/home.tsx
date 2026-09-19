import type { JSX } from "@solidjs/web";
import { SocialLinks } from "~/components/SocialLinks";
import { ScrollIndicator } from "~/components/ScrollIndicator";
import { useHomeController } from "./home.controller";

/**
 * The primary landing hero presentation for the portfolio.
 */
export function HomePresentation(): JSX.Element {
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
