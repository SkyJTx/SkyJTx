import { styled, useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
import { SocialLinks } from "~/components/SocialLinks";
import { Theme } from "~/components/ThemeComponents/types";

const SectionWrapper = styled("section")<{ theme: Theme }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  min-height: 100vh;
  padding: 8rem 2rem 4rem 2rem;
  box-sizing: border-box;
`;

const ContentBox = styled("div")`
  width: 100%;
  margin-top: 2rem;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TextParagraph = styled("p")<{ theme: Theme }>`
  font-size: 1rem;
  line-height: 1.7;
  color: ${(p) => p.theme.colors.text};
  margin-bottom: 2rem;
  font-family: ${(p) => p.theme.typography.fontFamily};
`;

const ContactInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

/**
 * Contacts section presentation.
 */
export function ContactsPresentation() {
  const theme = useTheme() as Theme;

  return (
    <SectionWrapper id="Contacts" theme={theme}>
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <ContentBox>
        <Box>
          <ContactInfoWrapper>
            <TextParagraph theme={theme}>
              Whether you are looking to build a reactive web system, design a custom liquid glass
              interface, or chat about audio engineering and signal flows, I would love to connect!
            </TextParagraph>
            <SocialLinks />
            <Button variant="primary" onClick={() => window.open("mailto:hello@example.com")}>
              Send an Email
            </Button>
          </ContactInfoWrapper>
        </Box>
      </ContentBox>
    </SectionWrapper>
  );
}
