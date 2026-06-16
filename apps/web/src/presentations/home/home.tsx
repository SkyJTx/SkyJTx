import { useTheme } from "solid-styled-components";
import { SocialLinks } from "~/components/SocialLinks";
import { useHomeController } from "./home.controller";
import * as S from "./styles";
import { Icon } from "~/components/Icon";

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
              {c.personalInfo.fullName}
            </S.Title>
            <S.Subtitle theme={theme}>
              {c.personalInfo.tagline}
            </S.Subtitle>
            <S.Description theme={theme}>
              {c.personalInfo.description}
            </S.Description>
            <S.SocialLinksWrapper theme={theme}>
              <SocialLinks
                githubUrl={c.personalInfo.githubUrl}
                linkedinUrl={c.personalInfo.linkedinUrl}
                emailAddress={c.personalInfo.email}
              />
            </S.SocialLinksWrapper>
          </S.HeroLeft>
        </S.HeroContent>
        <S.ScrollIndicator theme={theme} onClick={c.handleScrollDown}>
          <span>Scroll Down</span>
          <Icon name="arrow-down" size={18} />
        </S.ScrollIndicator>
      </S.HeroSection>
    </S.HomeWrapper>
  );
}

