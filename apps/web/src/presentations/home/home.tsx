import { useTheme } from "solid-styled-components";
import { Theme } from "~/components/ThemeComponents/types";
import { Logo, BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import { Button } from "~/components/Button";
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
            <S.Greeting theme={theme}>Welcome to my space</S.Greeting>
            <BrandTitle style={{ "font-size": "clamp(2rem, 5vw, 3.2rem)", "line-height": "1.15" }}>
              Nattakarn Khumsupha
            </BrandTitle>
            <BrandSubtitle style={{ "margin-bottom": "1rem", "margin-top": "0.5rem", "font-size": "clamp(0.95rem, 2.2vw, 1.15rem)", "max-width": "100%" }}>
              Computer Engineer & Full-Stack Developer
            </BrandSubtitle>
            <S.Description theme={theme}>
              Crafting high-performance web architectures and intelligent edge AI solutions.
            </S.Description>
            <S.ButtonGroup theme={theme}>
              <Button variant="primary" onClick={c.handleExploreProjects}>
                Explore Projects
              </Button>
              <Button variant="secondary" onClick={c.handleContactMe}>
                Get In Touch
              </Button>
            </S.ButtonGroup>
            <S.SocialLinksWrapper theme={theme}>
              <SocialLinks
                githubUrl="https://github.com/SkyJTx"
                linkedinUrl="https://www.linkedin.com/in/nattakarn-khumsupha-85b871337/"
                emailAddress="mailto:nattakarn.khumsupha.user1@outlook.com"
              />
            </S.SocialLinksWrapper>
          </S.HeroLeft>
          <S.HeroRight theme={theme}>
            <S.LogoWrapper theme={theme}>
              <Logo src={c.logoSrc} alt="SkyJT Logo" size="clamp(130px, 22vw, 240px)" />
            </S.LogoWrapper>
          </S.HeroRight>
        </S.HeroContent>
        <S.ScrollIndicator theme={theme} onClick={c.handleScrollDown}>
          <span>Scroll Down</span>
          <I.ArrowDownIcon />
        </S.ScrollIndicator>
      </S.HeroSection>

      <S.FocusSection id="focus-section" theme={theme}>
        <S.SectionTitle theme={theme}>Core Focus Areas</S.SectionTitle>
        <S.FocusGrid>
          <Box>
            <S.CardContent>
              <S.CardIconWrapper theme={theme}>
                <I.CodeIcon />
              </S.CardIconWrapper>
              <S.CardTitle theme={theme}>Full-Stack Development</S.CardTitle>
              <S.CardDescription theme={theme}>
                Designing and maintaining robust frontend & backend applications, building responsive user interfaces, and designing efficient APIs.
              </S.CardDescription>
            </S.CardContent>
          </Box>
          <Box>
            <S.CardContent>
              <S.CardIconWrapper theme={theme}>
                <I.VisionIcon />
              </S.CardIconWrapper>
              <S.CardTitle theme={theme}>AI & Computer Vision</S.CardTitle>
              <S.CardDescription theme={theme}>
                Developing Multi-Agent systems, image segmentation models, and edge device deployment (YOLO, OpenCV, Tensorflow).
              </S.CardDescription>
            </S.CardContent>
          </Box>
          <Box>
            <S.CardContent>
              <S.CardIconWrapper theme={theme}>
                <I.CpuIcon />
              </S.CardIconWrapper>
              <S.CardTitle theme={theme}>Embedded Systems & IoT</S.CardTitle>
              <S.CardDescription theme={theme}>
                Integrating hardware systems, smart switches, and sensors using MQTT/Zigbee networks and real-time edge processing.
              </S.CardDescription>
            </S.CardContent>
          </Box>
        </S.FocusGrid>
      </S.FocusSection>
    </S.HomeWrapper>
  );
}
