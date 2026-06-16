import { JSX, splitProps, Switch, Match } from "solid-js";
import { useComputed } from "@skyjt/signals-solid";

export type IconName =
  | "github"
  | "mail"
  | "linkedin"
  | "location"
  | "phone"
  | "resume"
  | "code"
  | "vision"
  | "cpu"
  | "arrow-down"
  | "sun"
  | "moon"
  | "monitor";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number | string;
}

/**
 * Reusable Icon component rendering SVGs dynamically.
 */
export function Icon(props: IconProps) {
  const [local, others] = splitProps(props, ["name", "size", "strokeWidth", "class"]);

  const size = useComputed(() => local.size ?? 20);
  const strokeWidth = useComputed(() => local.strokeWidth ?? 2);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size.value}
      height={size.value}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={strokeWidth.value}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      {...others}
    >
      <Switch>
        <Match when={local.name === "github"}>
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </Match>
        <Match when={local.name === "mail"}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Match>
        <Match when={local.name === "linkedin"}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </Match>
        <Match when={local.name === "location"}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </Match>
        <Match when={local.name === "phone"}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </Match>
        <Match when={local.name === "resume"}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <path d="M10 9H8" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
        </Match>
        <Match when={local.name === "code"}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </Match>
        <Match when={local.name === "vision"}>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </Match>
        <Match when={local.name === "cpu"}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </Match>
        <Match when={local.name === "arrow-down"}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </Match>
        <Match when={local.name === "sun"}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </Match>
        <Match when={local.name === "moon"}>
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </Match>
        <Match when={local.name === "monitor"}>
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </Match>
      </Switch>
    </svg>
  );
}
