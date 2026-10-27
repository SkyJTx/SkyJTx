import type { JSX } from "@solidjs/web";
import { For, Loading, Show } from "solid-js";
import { BrandTitle, BrandSubtitle } from "~/components/Brand";
import { Icon } from "~/components/Icon";
import { useContactsController } from "./contacts.controller";

/**
 * Inner content rendering the editorial split ledger for contacts.
 */
function ContactsContent(): JSX.Element {
  const ctrl = useContactsController();

  const contact = () => ctrl.contact;
  const social = () => ctrl.socialMedia;
  const work = () => ctrl.workMedia;

  return (
    <section
      id="Contacts"
      class="min-h-screen min-h-dvh w-full max-w-5xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16 animate-fade-in"
    >
      <BrandTitle>Get in Touch</BrandTitle>
      <BrandSubtitle>{contact().availabilityStatus}</BrandSubtitle>

      <div class="w-full mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Direct Correspondence & Context (5 cols) */}
        <div class="lg:col-span-5 flex flex-col gap-6">
          <div class="space-y-3">
            <p class="text-sm sm:text-base text-base-content/75 leading-relaxed">
              Whether you want to discuss systems engineering, backend architecture, or classical composition, feel free to reach out directly.
            </p>
            <a
              href={`mailto:${contact().email}`}
              class="block text-base sm:text-lg font-semibold text-base-content hover:text-primary transition-colors break-words"
            >
              {contact().email}
            </a>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={ctrl.handleCopyEmail}
              class="btn btn-primary btn-sm gap-2 rounded-lg transition-all active:scale-[0.98]"
              aria-label="Copy email address"
            >
              <Show when={ctrl.copied()} fallback={<><Icon name="copy" size={15} /><span>Copy Email</span></>}>
                <Icon name="check" size={15} />
                <span>Copied</span>
              </Show>
            </button>
            <a
              href={`mailto:${contact().email}`}
              class="btn btn-ghost btn-sm gap-2 rounded-lg border border-base-content/15 hover:border-primary hover:text-primary transition-all"
            >
              <Icon name="mail" size={15} />
              <span>Write Email</span>
            </a>
          </div>

          <div class="pt-5 border-t border-base-content/10 flex flex-col gap-2.5 text-sm text-base-content/70">
            <Show when={contact().phone}>
              {(phone) => (
                <div class="flex items-center gap-2.5">
                  <Icon name="phone" size={15} class="text-primary shrink-0" />
                  <a
                    href={`tel:${phone().replace(/\s+/g, "")}`}
                    class="hover:text-primary transition-colors"
                  >
                    {phone()}
                  </a>
                </div>
              )}
            </Show>
            <div class="flex items-center gap-2.5">
              <Icon name="location" size={15} class="text-primary shrink-0" />
              <span>{contact().location}</span>
            </div>
          </div>

          <Show when={contact().openTo.length > 0}>
            <div class="pt-2 flex flex-wrap gap-2">
              <For each={contact().openTo}>
                {(topic) => (
                  <span class="text-xs text-base-content/65 px-2.5 py-1 rounded-md bg-base-content/5 border border-base-content/10">
                    {topic}
                  </span>
                )}
              </For>
            </div>
          </Show>
        </div>

        {/* Right Column: Unified Editorial Hairline Directory (7 cols) */}
        <div class="lg:col-span-7 divide-y divide-base-content/10 border-y border-base-content/10">
          <For each={social()}>
            {(item) => (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="group py-4 px-2 flex items-center justify-between gap-4 hover:bg-base-content/[0.03] transition-colors"
              >
                <div class="flex items-start gap-3.5 min-w-0">
                  <Icon name={item.icon} size={18} class="text-base-content/60 group-hover:text-primary transition-colors mt-0.5 shrink-0" />
                  <div class="min-w-0">
                    <div class="text-sm sm:text-base font-semibold text-base-content group-hover:text-primary transition-colors">
                      {item.platform}
                    </div>
                    <div class="text-xs sm:text-sm text-base-content/60 truncate">
                      {item.purpose}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 text-xs sm:text-sm text-base-content/50">
                  <span class="hidden sm:inline">{item.handle}</span>
                  <Icon
                    name="external-link"
                    size={15}
                    class="text-base-content/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
              </a>
            )}
          </For>
          <For each={work()}>
            {(item) => (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="group py-4 px-2 flex items-center justify-between gap-4 hover:bg-base-content/[0.03] transition-colors"
              >
                <div class="flex items-start gap-3.5 min-w-0">
                  <Icon name={item.icon} size={18} class="text-base-content/60 group-hover:text-primary transition-colors mt-0.5 shrink-0" />
                  <div class="min-w-0">
                    <div class="text-sm sm:text-base font-semibold text-base-content group-hover:text-primary transition-colors">
                      {item.title}
                    </div>
                    <div class="text-xs sm:text-sm text-base-content/60 truncate">
                      {item.purpose}
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 text-xs sm:text-sm text-base-content/50">
                  <span class="hidden sm:inline">{item.handle}</span>
                  <Icon
                    name="external-link"
                    size={15}
                    class="text-base-content/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
              </a>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

/**
 * Contacts section presentation wrapped in a Solid 2 Loading boundary.
 */
export function ContactsPresentation(): JSX.Element {
  return (
    <Loading
      fallback={
        <section
          id="Contacts"
          class="min-h-screen min-h-dvh w-full max-w-5xl mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center scroll-mt-16"
        >
          <BrandTitle>Get in Touch</BrandTitle>
          <div class="skeleton h-5 w-64 rounded-box mt-2" />
          <div class="w-full mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div class="lg:col-span-5 space-y-4">
              <div class="skeleton h-16 w-full rounded-box" />
              <div class="skeleton h-10 w-48 rounded-box" />
            </div>
            <div class="lg:col-span-7 space-y-3">
              <div class="skeleton h-16 w-full rounded-box" />
              <div class="skeleton h-16 w-full rounded-box" />
              <div class="skeleton h-16 w-full rounded-box" />
            </div>
          </div>
        </section>
      }
    >
      <ContactsContent />
    </Loading>
  );
}
