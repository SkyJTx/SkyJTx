import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Section } from "~/components/Section";
import { ContentFadeIn } from "~/components/ContentFadeIn";
import { Placeholder } from "~/components/Placeholder";
import { useContactsController } from "./contacts.controller";
import * as S from "./styles";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation() {
  const c = useContactsController();

  return (
    <div id="Contacts">
      <Section maxWidth="800px">
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <ContentFadeIn>
        <Box>
          <Placeholder 
            title="Coming Soon"
            description="The contact section is currently being updated. Please check back later."
          />
        </Box>
      </ContentFadeIn>
      </Section>
    </div>
  );
}
