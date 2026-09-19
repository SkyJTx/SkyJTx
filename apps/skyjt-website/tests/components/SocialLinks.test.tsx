import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";
import { SocialLinks } from "~/components/SocialLinks";

describe("SocialLinks component", () => {
  it("renders social links with valid hrefs and accessible labels", () => {
    const { getByRole } = render(() => (
      <SocialLinks
        githubUrl="https://github.com/SkyJTx"
        linkedinUrl="https://linkedin.com/in/test"
        emailAddress="test@example.com"
      />
    ));

    const github = getByRole("link", { name: "GitHub Profile" });
    const linkedin = getByRole("link", { name: "LinkedIn Profile" });
    const email = getByRole("link", { name: "Send Email" });

    expect(github.getAttribute("href")).toBe("https://github.com/SkyJTx");
    expect(linkedin.getAttribute("href")).toBe("https://linkedin.com/in/test");
    expect(email.getAttribute("href")).toBe("mailto:test@example.com");
  });
});