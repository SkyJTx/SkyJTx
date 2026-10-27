import { render, fireEvent } from "@solidjs/testing-library";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { ContactsPresentation } from "~/presentations/contacts/contacts";
import type { ContactData } from "~/types";

const mockContactData: ContactData = {
  contact: {
    email: "contact@example.com",
    phone: "+1 555 010 9999",
    location: "Sample City",
    availabilityStatus: "Available for software engineering roles",
    openTo: [
      "Full-Stack & Backend Systems",
      "Edge AI & Performance Engineering",
      "Classical Composition & Score Transcriptions",
    ],
  },
  socialMedia: [
    {
      platform: "GitHub",
      handle: "sample-handle",
      url: "https://github.com/example",
      icon: "github",
      purpose: "Open-source tools, compilers & edge experiments",
    },
    {
      platform: "LinkedIn",
      handle: "Sample Engineer",
      url: "https://www.linkedin.com/in/example/",
      icon: "linkedin",
      purpose: "Professional background & engineering network",
    },
  ],
  workMedia: [
    {
      title: "Classical Scores",
      platform: "MuseScore",
      handle: "sample-composer",
      url: "https://musescore.com/example",
      icon: "music",
      purpose: "Original piano compositions & arrangements",
    },
    {
      title: "Curriculum Vitae",
      platform: "Direct Document",
      handle: "CV Resume (PDF)",
      url: "/api/storage/file/sample-cv.pdf",
      icon: "file-text",
      purpose: "Formal engineering & academic background",
    },
  ],
};

vi.mock("~/services/portfolio", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/services/portfolio")>();
  return {
    ...actual,
    getContactDataQuery: vi.fn(() => mockContactData as unknown as Promise<ContactData>),
  };
});

describe("ContactsPresentation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading, availability subtitle, and direct contact channels", async () => {
    const { getByText, findByText } = render(() => <ContactsPresentation />);

    expect(await findByText("Available for software engineering roles")).toBeInTheDocument();
    expect(getByText("Get in Touch")).toBeInTheDocument();
    expect(getByText("contact@example.com")).toBeInTheDocument();
    expect(getByText("+1 555 010 9999")).toBeInTheDocument();
    expect(getByText("Sample City")).toBeInTheDocument();
  });

  it("renders open-to focus tags without robotic uppercase headers", async () => {
    const { getByText, findByText } = render(() => <ContactsPresentation />);

    expect(await findByText("Full-Stack & Backend Systems")).toBeInTheDocument();
    expect(getByText("Edge AI & Performance Engineering")).toBeInTheDocument();
    expect(getByText("Classical Composition & Score Transcriptions")).toBeInTheDocument();
  });

  it("renders unified editorial directory rows with clean handles", async () => {
    const { getByText, findByText } = render(() => <ContactsPresentation />);

    expect(await findByText("GitHub")).toBeInTheDocument();
    expect(getByText("sample-handle")).toBeInTheDocument();
    expect(getByText("LinkedIn")).toBeInTheDocument();
    expect(getByText("Sample Engineer")).toBeInTheDocument();

    expect(getByText("Classical Scores")).toBeInTheDocument();
    expect(getByText("sample-composer")).toBeInTheDocument();
    expect(getByText("Curriculum Vitae")).toBeInTheDocument();
    expect(getByText("CV Resume (PDF)")).toBeInTheDocument();
  });

  it("handles copy email action and updates button text", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    const { findByText } = render(() => <ContactsPresentation />);
    const copyButton = await findByText(/copy email/i);
    expect(copyButton).toBeInTheDocument();

    await fireEvent.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith("contact@example.com");
    const copiedText = await findByText("Copied");
    expect(copiedText).toBeInTheDocument();
  });
});
