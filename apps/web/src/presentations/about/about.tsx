import { useTheme } from "solid-styled-components";
import { Logo } from "~/components/Brand";
import { useAboutController } from "./about.controller";
import * as S from "./styles";

/**
 * About section presentation.
 */
export function AboutPresentation() {
  const c = useAboutController();
  const theme = useTheme();

  return (
    <S.SectionWrapper id="About" theme={theme}>
      <S.ContentBox>
        <S.AboutBox>
          <S.AboutContainer>
            <S.AvatarWrapper>
              <S.CircleAvatar theme={theme}>
                <Logo src={c.logoSrc} alt="SkyJT Logo" size="80px" />
              </S.CircleAvatar>
            </S.AvatarWrapper>
            <S.TextContent>
              <S.AboutTitle theme={theme}>About Me</S.AboutTitle>
              <S.BioParagraph theme={theme}>
                I am a computer engineer, full-stack developer, and classical music composer with experience in software development, database architectures, and smart systems design.
              </S.BioParagraph>
            </S.TextContent>
          </S.AboutContainer>
        </S.AboutBox>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
