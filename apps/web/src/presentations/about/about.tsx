import { useTheme } from "solid-styled-components";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Box } from "~/components/Box";
import * as S from "./styles";

/**
 * About section presentation.
 */
export function AboutPresentation() {
  const theme = useTheme();

  return (
    <S.SectionWrapper id="About" theme={theme}>
      <BrandTitle>About Me</BrandTitle>
      <BrandSubtitle>My journey, education, and technical toolkit</BrandSubtitle>

      <S.ContentBox>
        <S.AboutGrid>
          <Box>
            <S.BioParagraph theme={theme}>
              I am a computer engineer graduated from King Mongkut’s University of Technology North Bangkok (KMUTNB) with ready-to-perform experience in full-stack software development, database architectures, and smart systems design.
            </S.BioParagraph>
            <S.BioParagraph theme={theme}>
              My background includes completing a 10-month cooperative internship at SCG, where I contributed to large-scale enterprise platforms for Agentic AI applications and value extraction systems using advanced computer vision models. I thrive in collaborative, high-energy engineering environments, translating complex requirements into reliable technical solutions.
            </S.BioParagraph>

            <S.SectionSubTitle theme={theme}>Education</S.SectionSubTitle>
            <S.Timeline>
              <S.TimelineItem theme={theme}>
                <S.TimelineDate theme={theme}>2022 — 2026</S.TimelineDate>
                <S.TimelineTitle theme={theme}>Bachelor of Computer Engineering</S.TimelineTitle>
                <S.TimelineSub theme={theme}>
                  King Mongkut's University of Technology North Bangkok
                  <S.TimelineGpax theme={theme}>GPAX: 3.52</S.TimelineGpax>
                </S.TimelineSub>
              </S.TimelineItem>
              <S.TimelineItem theme={theme}>
                <S.TimelineDate theme={theme}>2019 — 2022</S.TimelineDate>
                <S.TimelineTitle theme={theme}>Science, Mathematics, Technology, and Environment (SMTE)</S.TimelineTitle>
                <S.TimelineSub theme={theme}>
                  Singburi School
                  <S.TimelineGpax theme={theme}>GPAX: 3.57</S.TimelineGpax>
                </S.TimelineSub>
              </S.TimelineItem>
            </S.Timeline>
          </Box>

          <Box>
            <S.SectionSubTitle theme={theme} style={{ "margin-top": "0" }}>Technical Toolkit</S.SectionSubTitle>
            
            <S.SkillGroup>
              <S.SkillGroupTitle theme={theme}>Programming Languages</S.SkillGroupTitle>
              <S.TagContainer>
                <S.Tag theme={theme}>TypeScript</S.Tag>
                <S.Tag theme={theme}>JavaScript</S.Tag>
                <S.Tag theme={theme}>Python</S.Tag>
                <S.Tag theme={theme}>Rust</S.Tag>
                <S.Tag theme={theme}>Go</S.Tag>
                <S.Tag theme={theme}>Dart</S.Tag>
                <S.Tag theme={theme}>SQL</S.Tag>
              </S.TagContainer>
            </S.SkillGroup>

            <S.SkillGroup>
              <S.SkillGroupTitle theme={theme}>Frameworks & Runtimes</S.SkillGroupTitle>
              <S.TagContainer>
                <S.Tag theme={theme}>React / Next.js</S.Tag>
                <S.Tag theme={theme}>SolidJS / SolidStart</S.Tag>
                <S.Tag theme={theme}>Vue / Nuxt.js</S.Tag>
                <S.Tag theme={theme}>Flutter</S.Tag>
                <S.Tag theme={theme}>FastAPI</S.Tag>
                <S.Tag theme={theme}>Django</S.Tag>
                <S.Tag theme={theme}>Express.js</S.Tag>
                <S.Tag theme={theme}>Elysia</S.Tag>
                <S.Tag theme={theme}>Hono</S.Tag>
                <S.Tag theme={theme}>Tokio (Rust)</S.Tag>
                <S.Tag theme={theme}>Actix Web</S.Tag>
                <S.Tag theme={theme}>Ratatui</S.Tag>
              </S.TagContainer>
            </S.SkillGroup>

            <S.SkillGroup>
              <S.SkillGroupTitle theme={theme}>Databases & Storage</S.SkillGroupTitle>
              <S.TagContainer>
                <S.Tag theme={theme}>PostgreSQL</S.Tag>
                <S.Tag theme={theme}>Microsoft SQL Server</S.Tag>
                <S.Tag theme={theme}>MySQL / MariaDB</S.Tag>
                <S.Tag theme={theme}>Supabase</S.Tag>
                <S.Tag theme={theme}>Firebase</S.Tag>
              </S.TagContainer>
            </S.SkillGroup>

            <S.SkillGroup>
              <S.SkillGroupTitle theme={theme}>AI & Computer Vision</S.SkillGroupTitle>
              <S.TagContainer>
                <S.Tag theme={theme}>TensorFlow</S.Tag>
                <S.Tag theme={theme}>OpenCV</S.Tag>
                <S.Tag theme={theme}>YOLO</S.Tag>
                <S.Tag theme={theme}>Mediapipe</S.Tag>
                <S.Tag theme={theme}>Ollama</S.Tag>
                <S.Tag theme={theme}>PydanticAI</S.Tag>
                <S.Tag theme={theme}>n8n AI Agents</S.Tag>
              </S.TagContainer>
            </S.SkillGroup>

            <S.SkillGroup>
              <S.SkillGroupTitle theme={theme}>Cloud, Network & IoT</S.SkillGroupTitle>
              <S.TagContainer>
                <S.Tag theme={theme}>Vercel</S.Tag>
                <S.Tag theme={theme}>Microsoft Azure</S.Tag>
                <S.Tag theme={theme}>Docker / Podman</S.Tag>
                <S.Tag theme={theme}>Linux / Windows Server</S.Tag>
                <S.Tag theme={theme}>MQTT</S.Tag>
                <S.Tag theme={theme}>Zigbee2MQTT</S.Tag>
                <S.Tag theme={theme}>Node-RED</S.Tag>
              </S.TagContainer>
            </S.SkillGroup>
          </Box>
        </S.AboutGrid>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}
