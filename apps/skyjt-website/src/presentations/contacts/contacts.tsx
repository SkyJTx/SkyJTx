import type { JSX } from "@solidjs/web";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Icon } from "~/components/Icon";
import { useContactsController } from "./contacts.controller";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation(): JSX.Element {
  useContactsController();

  return (
    <section
      id="Contacts"
      class="min-h-screen min-h-dvh w-full max-w-2xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 animate-fade-in text-center"
    >
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <div class="mt-8 w-full max-w-md mx-auto p-8 rounded-2xl border border-dashed border-base-300/80 bg-base-200/20 backdrop-blur-xs flex flex-col items-center gap-3 text-center">
        <div class="p-3.5 rounded-full bg-primary/10 text-primary">
          <Icon name="mail" size={24} />
        </div>
        <h3 class="text-lg font-bold text-base-content tracking-tight">Coming Soon</h3>
        <p class="text-sm text-base-content/70 leading-relaxed">
          The contact section is currently being updated. Please check back later.
        </p>
      </div>
    </section>
  );
}
