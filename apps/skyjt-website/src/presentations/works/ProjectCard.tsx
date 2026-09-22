import type { JSX } from "@solidjs/web";
import { For, Show } from "solid-js";
import { Card } from "~/components/Card";
import { ExpandableText } from "~/components/ExpandableText";
import { ImageCarousel } from "~/components/ImageCarousel";
import { Icon } from "~/components/Icon";
import type { ProjectData } from "~/types";

/**
 * Properties for ProjectCard component.
 */
export interface ProjectCardProps {
  project: ProjectData;
}

/**
 * Individual portfolio project card featuring media carousel and external links.
 */
export function ProjectCard(props: ProjectCardProps): JSX.Element {
  const hasImages = () => props.project.images.length > 0;
  const hasPdf = () => Boolean(props.project.pdfUrl);

  const media = () => (
    <>
      <Show when={hasImages()}>
        <ImageCarousel
          images={props.project.images}
          projectName={props.project.title}
          projectDate={props.project.date}
        />
      </Show>
      <Show when={!hasImages() && hasPdf()}>
        <div class="w-full h-full flex flex-col items-center justify-center bg-base-300/60 p-6 text-center gap-3">
          <Icon name="file-text" size={36} class="text-primary" />
          <p class="text-xs font-semibold text-base-content/70">PDF Document</p>
          <a
            href={props.project.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-xs gap-1.5 shadow-sm"
          >
            <Icon name="external-link" size={12} />
            View Document
          </a>
        </div>
      </Show>
    </>
  );

  const actions = () => (
    <Show when={props.project.links.length > 0}>
      <For each={props.project.links}>
        {(link) => (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-outline btn-xs sm:btn-sm gap-1.5 hover:btn-primary transition-colors"
          >
            <Icon name={link.icon} size={14} />
            {link.label}
          </a>
        )}
      </For>
    </Show>
  );

  return (
    <Card
      media={media()}
      title={props.project.title}
      actions={actions()}
    >
      <p class="text-sm text-base-content/80 leading-relaxed my-2 flex-1">
        <ExpandableText text={props.project.description} />
      </p>
    </Card>
  );
}

