import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { useContactsController } from "./contacts.controller";
import * as S from "./styles";
import { useTheme } from "solid-styled-components";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation() {
  const c = useContactsController();
  const theme = useTheme();

  return (
    <S.SectionWrapper theme={theme} id="Contacts">
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <S.ContentBox>
        <Box>
          <S.PlaceholderWrapper>
            <S.PlaceholderTitle theme={theme}>Coming Soon</S.PlaceholderTitle>
            <S.PlaceholderDescription theme={theme}>
              The contact section is currently being updated. Please check back later.
            </S.PlaceholderDescription>
          </S.PlaceholderWrapper>
        </Box>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
