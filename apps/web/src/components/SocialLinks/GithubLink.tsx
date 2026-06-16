import { IconButton } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useComputed } from "@skyjt/signals-solid";

interface GithubLinkProps {
  url?: string;
  class?: string;
}

/**
 * A beautiful, glassmorphic link to a GitHub profile.
 */
export function GithubLink(props: GithubLinkProps) {
  const url = useComputed(() => props.url ?? "https://github.com");

  return (
    <IconButton
      href={url.value}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel="GitHub Profile"
      class={props.class}
    >
      <Icon name="github" />
    </IconButton>
  );
}


