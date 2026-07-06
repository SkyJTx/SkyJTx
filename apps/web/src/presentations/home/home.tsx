import { useTheme } from "solid-styled-components";
import { SocialLinks } from "~/components/SocialLinks";
import { ScrollIndicator } from "~/components/ScrollIndicator";
import { useHomeController } from "./home.controller";
import * as S from "./styles";

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
        <ScrollIndicator label="Scroll Down" onClick={c.handleScrollDown} />
      </S.HeroSection>
    </S.HomeWrapper>
  );
}

