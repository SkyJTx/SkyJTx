import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { useWorksController } from "./works.controller";
import * as S from "./styles";
import { useTheme } from "solid-styled-components";

/**
 * Works presentation highlighting recent engineering and acoustic projects.
 */
export function WorksPresentation() {
  const c = useWorksController();
  const theme = useTheme();

  return (
    <S.SectionWrapper theme={theme} id="Works">
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <S.WorksBoxContainer theme={theme}>
        <Box>
          <S.PlaceholderWrapper>
            <S.PlaceholderTitle theme={theme}>Coming Soon</S.PlaceholderTitle>
            <S.PlaceholderDescription theme={theme}>
              I am currently preparing selected engineering and development projects. Check back soon for updates.
            </S.PlaceholderDescription>
          </S.PlaceholderWrapper>
        </Box>
      </S.WorksBoxContainer>
    </S.SectionWrapper>
  );
}
