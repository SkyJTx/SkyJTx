import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { useContactsController } from "./contacts.controller";
import * as S from "./styles";

/**
 * Contacts section presentation.
 */
export function ContactsPresentation() {
  const c = useContactsController();

  return (
    <S.SectionWrapper id="Contacts">
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>Let's build something beautiful together</BrandSubtitle>

      <S.ContentBox>
        <Box>
          <S.PlaceholderWrapper>
            <S.PlaceholderTitle>Coming Soon</S.PlaceholderTitle>
            <S.PlaceholderDescription>
              The contact section is currently being updated. Please check back later.
            </S.PlaceholderDescription>
          </S.PlaceholderWrapper>
        </Box>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
