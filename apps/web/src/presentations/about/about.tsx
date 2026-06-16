import { useTheme } from "solid-styled-components";
import { useAboutController } from "./about.controller";
import * as S from "./styles";
import { Icon } from "~/components/Icon";

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
                <S.AvatarImage src={c.avatarUrl} alt="Nattakarn Khumsupha" />
              </S.CircleAvatar>
            </S.AvatarWrapper>
            <S.TextContent>
              <S.AboutTitle theme={theme}>About Me</S.AboutTitle>
              <S.BioParagraph theme={theme}>
                I am a computer engineer, full-stack developer, and classical music composer with experience in software development, database architectures, and smart systems design. Active across various university events, I leverage collaboration, problem-solving, and team coordination to achieve results.
              </S.BioParagraph>
              <S.Divider theme={theme} />
              <S.InfoGrid>
                <S.InfoItem theme={theme}>
                  <Icon name="location" size={16} strokeWidth={2.5} />
                  <S.InfoValue theme={theme}>{c.location}</S.InfoValue>
                </S.InfoItem>
                <S.InfoItem theme={theme}>
                  <Icon name="mail" size={16} strokeWidth={2.5} />
                  <S.InfoValue theme={theme}>
                    <a href={`mailto:${c.email}`}>{c.email}</a>
                  </S.InfoValue>
                </S.InfoItem>
                <S.InfoItem theme={theme}>
                  <Icon name="phone" size={16} strokeWidth={2.5} />
                  <S.InfoValue theme={theme}>
                    <a href={`tel:${c.phone.replace(/\s+/g, "")}`}>{c.phone}</a>
                  </S.InfoValue>
                </S.InfoItem>
              </S.InfoGrid>
              <S.ButtonContainer>
                <S.ResumeButton
                  theme={theme}
                  href={c.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="resume" size={16} strokeWidth={2.5} style={{ "margin-right": "8px" }} />
                  View CV / Resume
                </S.ResumeButton>
              </S.ButtonContainer>
            </S.TextContent>
          </S.AboutContainer>
        </S.AboutBox>
      </S.ContentBox>
    </S.SectionWrapper>
  );
}

