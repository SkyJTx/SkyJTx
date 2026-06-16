import { styled } from "solid-styled-components";
import { GithubLink } from "./GithubLink";
import { LinkedinLink } from "./LinkedinLink";
import { MailLink } from "./MailLink";

interface SocialLinksProps {
  githubUrl?: string;
  linkedinUrl?: string;
  emailAddress?: string;
  class?: string;
}

const SocialContainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

/**
 * A reusable glassmorphic social icons container composing individual platform links.
 */
export function SocialLinks(props: SocialLinksProps) {
  return (
    <SocialContainer class={props.class}>
      <GithubLink url={props.githubUrl} />
      <LinkedinLink url={props.linkedinUrl} />
      <MailLink emailAddress={props.emailAddress} />
    </SocialContainer>
  );
}
