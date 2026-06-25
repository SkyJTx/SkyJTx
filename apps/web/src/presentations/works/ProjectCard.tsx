import { Show, For } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useComputed } from "@skyjt/signals-solid";
import { Box } from "~/components/Box";
import { ImageCarousel } from "~/components/ImageCarousel";
import { PdfPreview } from "~/components/PdfPreview";
import { Icon } from "~/components/Icon";
import type { ProjectData } from "~/constants/worksData";
import * as S from "./ProjectCard.styles";

export interface ProjectCardProps {
  project: ProjectData;
}

/**
 * Individual project card showing media (image carousel or PDF preview), title, description, and links.
 */
export function ProjectCard(props: ProjectCardProps) {
  const theme = useTheme();
  const hasImages = useComputed(() => props.project.images.length > 0);
  const hasPdf = useComputed(() => Boolean(props.project.pdfUrl));

  return (
    <Box padding="1rem" style={{ height: "100%" }}>
      <S.CardContainer>
        <S.MediaSection>
          <Show when={hasImages()}>
            <ImageCarousel images={props.project.images} />
          </Show>
          <Show when={!hasImages() && hasPdf()}>
            <PdfPreview
              url={props.project.pdfUrl!}
              title={props.project.title}
            />
          </Show>
        </S.MediaSection>

        <S.ContentSection>
          <S.CardTitle theme={theme}>{props.project.title}</S.CardTitle>
          <S.CardDescription theme={theme}>
            {props.project.description}
          </S.CardDescription>

          <Show when={props.project.links.length > 0}>
            <S.LinksRow>
              <For each={props.project.links}>
                {(link) => (
                  <S.LinkButton
                    theme={theme}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={link.icon} size={14} />
                    {link.label}
                  </S.LinkButton>
                )}
              </For>
            </S.LinksRow>
          </Show>
        </S.ContentSection>
      </S.CardContainer>
    </Box>
  );
}
