import { Show, For } from "solid-js";
import { useTheme } from "solid-styled-components";
import { useComputed } from "@skyjt/signals-solid";
import { Card } from "~/components/Card";
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

  const media = (
    <>
      <Show when={hasImages.value}>
        <ImageCarousel
          images={props.project.images}
          projectName={props.project.title}
          projectDate={props.project.date}
        />
      </Show>
      <Show when={!hasImages.value && hasPdf.value}>
        <PdfPreview
          url={props.project.pdfUrl!}
          title={props.project.title}
          date={props.project.date}
        />
      </Show>
    </>
  );

  const actions = (
    <Show when={props.project.links.length > 0}>
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
    </Show>
  );

  return (
    <Card
      media={media}
      title={props.project.title}
      description={props.project.description}
      actions={actions}
    />
  );
}
