import { IconButton } from "~/components/Button";
import { Icon } from "~/components/Icon";
import { useComputed } from "@skyjt/signals-solid";

interface MailLinkProps {
  emailAddress?: string;
  class?: string;
}

/**
 * A beautiful, glassmorphic link to send an email.
 */
export function MailLink(props: MailLinkProps) {
  const email = useComputed(() => props.emailAddress ?? "hello@example.com");
  const href = useComputed(() => email.value.startsWith("mailto:") ? email.value : `mailto:${email.value}`);

  return (
    <IconButton
      href={href.value}
      ariaLabel="Send Email"
      class={props.class}
    >
      <Icon name="mail" />
    </IconButton>
  );
}


