import { useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { useWorksController } from "./works.controller";
import * as S from "./styles";

/**
 * Works presentation highlighting recent engineering and acoustic projects.
 */
export function WorksPresentation() {
  const c = useWorksController();
  const theme = useTheme();

  return (
    <S.SectionWrapper id="Works" theme={theme}>
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <div style={{ width: "100%", "margin-top": "3rem" }}>
        <Box>
          <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", "justify-content": "center", padding: "4rem 2rem", "text-align": "center" }}>
            <div style={{ "font-size": "1.5rem", "font-weight": theme.typography.fontWeight.bold, color: theme.colors.primary, "margin-bottom": "0.5rem" }}>
              Coming Soon
            </div>
            <p style={{ margin: 0, color: theme.colors.muted, "font-size": "0.95rem", "max-width": "400px", "line-height": "1.6" }}>
              I am currently preparing selected engineering and development projects. Check back soon for updates.
            </p>
          </div>
        </Box>
      </div>
    </S.SectionWrapper>
  );
}
