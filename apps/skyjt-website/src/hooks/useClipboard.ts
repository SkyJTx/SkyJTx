import { createSignal } from "solid-js";

export function useClipboard(timeoutMs = 2000) {
  const [copied, setCopied] = createSignal(false);

  const copy = async (text: string): Promise<boolean> => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), timeoutMs);
        return true;
      } catch (err) {
        console.error("[useClipboard] Copy failed:", err);
      }
    }
    return false;
  };

  return { copied, copy };
}
