import mime from "mime";

export type FileType = "image" | "pdf";

export function detectFileType(url: string): FileType {
  const cleanUrl = url.split(/[?#]/)[0] ?? url;
  const mimeType = mime.getType(cleanUrl);
  if (mimeType === "application/pdf") {
    return "pdf";
  }
  return "image";
}

export async function downloadFile(url: string, defaultFilename = "download"): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    const filename = url.split("/").pop()?.split(/[?#]/)[0] || defaultFilename;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.warn("[fileDownload] Direct fetch failed, fallback to window.open:", err);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
