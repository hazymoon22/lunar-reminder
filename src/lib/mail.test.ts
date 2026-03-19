import { describe, expect, it } from "vite-plus/test";
import { sanitizeMailBody } from "./mail.ts";

describe("sanitizeMailBody", () => {
  it("keeps allowed tags", () => {
    const input = "<p>Hello</p><br><h3>Title</h3><span>Note</span>";
    const output = sanitizeMailBody(input);

    expect(output).toContain("<p>Hello</p>");
    expect(output).toContain("<br />");
    expect(output).toContain("<h3>Title</h3>");
    expect(output).toContain("<span>Note</span>");
  });

  it("removes disallowed tags", () => {
    const input = "<script>alert(1)</script><div>Box</div><p>Safe</p>";
    const output = sanitizeMailBody(input);

    expect(output).not.toContain("<script");
    expect(output).not.toContain("<div>");
    expect(output).toContain("<p>Safe</p>");
  });

  it("keeps only class attribute on anchor tag", () => {
    const input = '<a href="https://example.com" class="btn" target="_blank">Link</a>';
    const output = sanitizeMailBody(input);

    expect(output).toContain('<a class="btn">Link</a>');
    expect(output).not.toContain("href=");
    expect(output).not.toContain("target=");
  });
});
