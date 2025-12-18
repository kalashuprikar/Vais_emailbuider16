import { describe, it, expect } from "vitest";
import { compileHTML, sanitizeHTML, isValidHTML } from "../htmlCompiler";

describe("HTML Compiler", () => {
  describe("compileHTML", () => {
    it("should compile h1 tags with proper styling", () => {
      const input = "<h1>Test Title</h1>";
      const result = compileHTML(input);

      expect(result).toContain("<h1");
      expect(result).toContain("font-size: 2.25rem");
      expect(result).toContain("font-weight: 700");
      expect(result).toContain("Test Title");
      expect(result).toContain("</h1>");
    });

    it("should compile h2 tags with proper styling", () => {
      const input = "<h2>Subtitle</h2>";
      const result = compileHTML(input);

      expect(result).toContain("<h2");
      expect(result).toContain("font-size: 1.875rem");
      expect(result).toContain("font-weight: 700");
      expect(result).toContain("Subtitle");
    });

    it("should compile h3 tags with proper styling", () => {
      const input = "<h3>Section Title</h3>";
      const result = compileHTML(input);

      expect(result).toContain("<h3");
      expect(result).toContain("font-size: 1.5rem");
      expect(result).toContain("Section Title");
    });

    it("should compile p tags with proper styling", () => {
      const input = "<p>Paragraph text</p>";
      const result = compileHTML(input);

      expect(result).toContain("<p");
      expect(result).toContain("font-size: 1rem");
      expect(result).toContain("Paragraph text");
      expect(result).toContain("</p>");
    });

    it("should handle multiple tags", () => {
      const input = "<h1>Title</h1><p>Content</p>";
      const result = compileHTML(input);

      expect(result).toContain("<h1");
      expect(result).toContain("Title");
      expect(result).toContain("</h1>");
      expect(result).toContain("<p");
      expect(result).toContain("Content");
      expect(result).toContain("</p>");
    });

    it("should handle nested tags", () => {
      const input = "<h1>Title with <strong>bold</strong> text</h1>";
      const result = compileHTML(input);

      expect(result).toContain("<h1");
      expect(result).toContain("<strong");
      expect(result).toContain("bold");
      expect(result).toContain("</strong>");
    });

    it("should preserve existing inline styles", () => {
      const input = '<h1 style="color: red;">Title</h1>';
      const result = compileHTML(input);

      expect(result).toContain("<h1");
      expect(result).toContain("color: red");
      expect(result).toContain("font-size: 2.25rem");
    });

    it("should handle empty input", () => {
      expect(compileHTML("")).toBe("");
      expect(compileHTML(null as any)).toBe("");
    });

    it("should handle invalid HTML gracefully", () => {
      const input = "<h1>Unclosed tag";
      const result = compileHTML(input);
      // Should return sanitized content
      expect(result).toBeTruthy();
    });

    it("should handle empty tags", () => {
      const input = "<><h1>Title</h1>";
      const result = compileHTML(input);
      expect(result).toContain("Title");
    });

    it("should handle malformed tag content", () => {
      const input = "< h1 >Title</h1>";
      const result = compileHTML(input);
      // Should handle gracefully
      expect(result).toBeTruthy();
    });

    it("should handle comments", () => {
      const input = "<!-- comment --><h1>Title</h1>";
      const result = compileHTML(input);
      expect(result).toContain("<h1");
      expect(result).toContain("Title");
    });

    it("should handle tags with hyphens and numbers", () => {
      const input = "<custom-element-123>Content</custom-element-123>";
      const result = compileHTML(input);
      expect(result).toContain("custom-element-123");
    });

    it("should handle attributes with hyphens", () => {
      const input = '<div data-test-attr="value">Content</div>';
      const result = compileHTML(input);
      expect(result).toContain("data-test-attr");
    });

    it("should handle multiple nested tags with attributes", () => {
      const input =
        '<h1 style="color: blue;">Title <span class="highlight">highlighted</span></h1>';
      const result = compileHTML(input);
      expect(result).toContain("<h1");
      expect(result).toContain("highlighted");
      expect(result).toContain("</h1>");
    });
  });

  describe("sanitizeHTML", () => {
    it("should remove script tags", () => {
      const input = "<h1>Title</h1><script>alert('xss')</script>";
      const result = sanitizeHTML(input);

      expect(result).toContain("<h1>Title</h1>");
      expect(result).not.toContain("<script");
      expect(result).not.toContain("alert");
    });

    it("should remove event handlers", () => {
      const input = '<h1 onclick="alert(1)">Title</h1>';
      const result = sanitizeHTML(input);

      expect(result).toContain("<h1");
      expect(result).toContain("Title");
      expect(result).not.toContain("onclick");
    });

    it("should remove style tags", () => {
      const input = "<style>body{background:red}</style><p>Content</p>";
      const result = sanitizeHTML(input);

      expect(result).toContain("<p>Content</p>");
      expect(result).not.toContain("<style");
    });

    it("should remove iframe tags", () => {
      const input = '<p>Text</p><iframe src="evil.com"></iframe>';
      const result = sanitizeHTML(input);

      expect(result).toContain("<p>Text</p>");
      expect(result).not.toContain("<iframe");
    });

    it("should handle empty input", () => {
      expect(sanitizeHTML("")).toBe("");
      expect(sanitizeHTML(null as any)).toBe("");
    });
  });

  describe("isValidHTML", () => {
    it("should validate correct HTML", () => {
      expect(isValidHTML("<h1>Title</h1>")).toBe(true);
      expect(isValidHTML("<p>Paragraph</p>")).toBe(true);
      expect(isValidHTML("<h1>Title</h1><p>Para</p>")).toBe(true);
    });

    it("should reject unclosed tags", () => {
      expect(isValidHTML("<h1>Title")).toBe(false);
      expect(isValidHTML("<h1>Title</h2>")).toBe(false);
    });

    it("should handle self-closing tags", () => {
      expect(isValidHTML('<img src="test.jpg" />')).toBe(true);
      expect(isValidHTML("<br /><p>Text</p>")).toBe(true);
    });

    it("should handle empty input", () => {
      expect(isValidHTML("")).toBe(false);
      expect(isValidHTML(null as any)).toBe(false);
    });
  });
});
