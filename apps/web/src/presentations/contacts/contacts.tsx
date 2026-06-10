import { useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
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
          <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", padding: "4rem 2rem", "text-align": "center" }}>
            <div style={{ "font-size": "1.5rem", "font-weight": theme.typography.fontWeight.bold, color: theme.colors.primary, "margin-bottom": "0.5rem" }}>
              Coming Soon
            </div>
            <p style={{ margin: 0, color: theme.colors.muted, "font-size": "0.95rem", "max-width": "400px", "line-height": "1.6" }}>
              The contact section is currently being updated. Please check back later.
            </p>
          </div>
        </Box>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
