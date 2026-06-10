import { useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
import { SocialLinks } from "~/components/SocialLinks";
import { useContactsController } from "./contacts.controller";
import * as S from "./styles";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation() {
  const c = useContactsController();
  const theme = useTheme();

  return (
    <S.SectionWrapper id="Contacts" theme={theme}>
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <S.ContentBox>
        <Box>
          <S.ContactInfoWrapper>
            <S.TextParagraph theme={theme}>
              Whether you are looking to build a reactive web system, design a custom liquid glass
              interface, or chat about audio engineering and signal flows, I would love to connect!
            </S.TextParagraph>
            <SocialLinks
              githubUrl="https://github.com/SkyJTx"
              linkedinUrl="https://www.linkedin.com/in/nattakarn-khumsupha-85b871337/"
              emailAddress="mailto:nattakarn.khumsupha.user1@outlook.com"
            />
            <Button variant="primary" onClick={c.handleSendEmail}>
              Send an Email
            </Button>
          </S.ContactInfoWrapper>
        </Box>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
