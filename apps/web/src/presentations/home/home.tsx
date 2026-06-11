import { useTheme } from "solid-styled-components";
import { SocialLinks } from "~/components/SocialLinks";
import { useHomeController } from "./home.controller";
import * as S from "./styles";
import * as I from "./icons";

/**
 * The primary landing/home page presentation for the personal portfolio.
 */
export function HomePresentation() {
  const c = useHomeController();
  const theme = useTheme();

  return (
    <S.HomeWrapper id="Home" theme={theme}>
      <S.HeroSection theme={theme}>
        <S.HeroContent theme={theme}>
          <S.HeroLeft theme={theme}>
            <S.Title>
              Nattakarn Khumsupha
            </S.Title>
            <S.Subtitle theme={theme}>
              Computer Engineer, Full-Stack Developer & Classical Music Composer
            </S.Subtitle>
            <S.Description theme={theme}>
              Crafting high-performance web architectures and intelligent edge AI solutions.
            </S.Description>
            <S.SocialLinksWrapper theme={theme}>
              <SocialLinks
                githubUrl="https://github.com/SkyJTx"
                linkedinUrl="https://www.linkedin.com/in/nattakarn-khumsupha-85b871337/"
                emailAddress="mailto:nattakarn.khumsupha.user1@outlook.com"
              />
            </S.SocialLinksWrapper>
          </S.HeroLeft>
        </S.HeroContent>
        <S.ScrollIndicator theme={theme} onClick={c.handleScrollDown}>
          <span>Scroll Down</span>
          <I.ArrowDownIcon />
        </S.ScrollIndicator>
      </S.HeroSection>
    </S.HomeWrapper>
  );
}
