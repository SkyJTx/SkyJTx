import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { useWorksController } from "./works.controller";
import * as S from "./styles";

/**
 * Works presentation highlighting recent engineering and acoustic projects.
 */
export function WorksPresentation() {
  const c = useWorksController();

  return (
    <S.SectionWrapper id="Works">
      <BrandTitle>My Works</BrandTitle>
      <BrandSubtitle>Selected projects and experiments</BrandSubtitle>

      <S.WorksBoxContainer>
        <Box>
          <S.PlaceholderWrapper>
            <S.PlaceholderTitle>Coming Soon</S.PlaceholderTitle>
            <S.PlaceholderDescription>
              I am currently preparing selected engineering and development projects. Check back soon for updates.
            </S.PlaceholderDescription>
          </S.PlaceholderWrapper>
        </Box>
      </S.WorksBoxContainer>
    </S.SectionWrapper>
  );
}
