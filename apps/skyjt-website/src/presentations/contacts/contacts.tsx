import type { JSX } from "@solidjs/web";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Card } from "~/components/Card";
import { useContactsController } from "./contacts.controller";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation(): JSX.Element {
  useContactsController();

  return (
    <section id="Contacts" class="w-full max-w-2xl mx-auto px-4 sm:px-8 py-20 animate-fade-in text-center">
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <div class="mt-6">
        <Card
          title="Coming Soon"
          description="The contact section is currently being updated. Please check back later."
        />
      </div>
    </section>
  );
}
