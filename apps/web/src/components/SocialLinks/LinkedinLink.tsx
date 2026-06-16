import { IconButton } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useComputed } from "@skyjt/signals-solid";

interface LinkedinLinkProps {
  url?: string;
  class?: string;
}

/**
 * A beautiful, glassmorphic link to a LinkedIn profile.
 */
export function LinkedinLink(props: LinkedinLinkProps) {
  const url = useComputed(() => props.url ?? "https://linkedin.com");

  return (
    <IconButton
      href={url.value}
      target="_blank"
      rel="noopener noreferrer"
      ariaLabel="LinkedIn Profile"
      class={props.class}
    >
      <Icon name="linkedin" />
    </IconButton>
  );
}


