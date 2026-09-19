import type { JSX } from "@solidjs/web";
import { Tooltip } from "~/components/Tooltip";
import { Icon } from "~/components/Icon";

/**
 * Properties for SocialLinks component.
 */
export interface SocialLinksProps {
  githubUrl: string;
  linkedinUrl: string;
  emailAddress: string;
}

/**
 * Social links bar with accessible tooltips and DaisyUI buttons.
 */
export function SocialLinks(props: SocialLinksProps): JSX.Element {
  return (
    <div class="flex items-center gap-3">
      {/* GitHub */}
      <Tooltip content="GitHub Profile" placement="bottom">
        <a
          href={props.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-circle btn-sm btn-ghost border border-base-300/80 hover:border-primary hover:text-primary transition-all duration-200"
          aria-label="GitHub Profile"
        >
          <Icon name="github" size={18} />
        </a>
      </Tooltip>

      {/* LinkedIn */}
      <Tooltip content="LinkedIn Profile" placement="bottom">
        <a
          href={props.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-circle btn-sm btn-ghost border border-base-300/80 hover:border-primary hover:text-primary transition-all duration-200"
          aria-label="LinkedIn Profile"
        >
          <Icon name="linkedin" size={18} />
        </a>
      </Tooltip>

      {/* Mail */}
      <Tooltip content="Send Email" placement="bottom">
        <a
          href={`mailto:${props.emailAddress}`}
          class="btn btn-circle btn-sm btn-ghost border border-base-300/80 hover:border-primary hover:text-primary transition-all duration-200"
          aria-label="Send Email"
        >
          <Icon name="mail" size={18} />
        </a>
      </Tooltip>
    </div>
  );
}
