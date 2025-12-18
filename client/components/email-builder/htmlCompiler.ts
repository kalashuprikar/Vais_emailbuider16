/**
 * HTML Compiler - Parses and compiles HTML with semantic tag handling
 * Ensures h1, h2, h3 and other semantic tags are properly rendered with appropriate styling
 */

interface ParsedNode {
  type: "element" | "text";
  tag?: string;
  attributes?: Record<string, string>;
  children?: ParsedNode[];
  content?: string;
}

interface TagStyleConfig {
  fontSize: string;
  fontWeight: string;
  margin: string;
  lineHeight: string;
  color?: string;
}

const semanticTagStyles: Record<string, TagStyleConfig> = {
  h1: {
    fontSize: "2.25rem",
    fontWeight: "700",
    margin: "1rem 0",
    lineHeight: "1.2",
  },
  h2: {
    fontSize: "1.875rem",
    fontWeight: "700",
    margin: "0.875rem 0",
    lineHeight: "1.25",
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: "700",
    margin: "0.75rem 0",
    lineHeight: "1.35",
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: "700",
    margin: "0.625rem 0",
    lineHeight: "1.4",
  },
  h5: {
    fontSize: "1.125rem",
    fontWeight: "700",
    margin: "0.5rem 0",
    lineHeight: "1.45",
  },
  h6: {
    fontSize: "1rem",
    fontWeight: "700",
    margin: "0.5rem 0",
    lineHeight: "1.5",
  },
  p: {
    fontSize: "1rem",
    fontWeight: "400",
    margin: "0.5rem 0",
    lineHeight: "1.6",
  },
  strong: {
    fontSize: "inherit",
    fontWeight: "700",
    margin: "0",
    lineHeight: "inherit",
  },
  em: {
    fontSize: "inherit",
    fontWeight: "inherit",
    margin: "0",
    lineHeight: "inherit",
  },
  span: {
    fontSize: "inherit",
    fontWeight: "inherit",
    margin: "0",
    lineHeight: "inherit",
  },
  div: {
    fontSize: "1rem",
    fontWeight: "400",
    margin: "0",
    lineHeight: "1.5",
  },
};

/**
 * Simple HTML parser - converts HTML string to a tree structure
 * Handles basic HTML parsing without external dependencies
 */
function parseHTML(html: string): ParsedNode[] {
  try {
    const nodes: ParsedNode[] = [];
    let currentPos = 0;

    // Normalize whitespace for parsing
    const normalized = html.trim();

    if (!normalized) return nodes;

    while (currentPos < normalized.length) {
      // Check for tag
      if (normalized[currentPos] === "<") {
        const tagEnd = normalized.indexOf(">", currentPos);
        if (tagEnd === -1) break;

        const tagContent = normalized.substring(currentPos + 1, tagEnd).trim();

        // Skip empty tags or malformed content
        if (!tagContent) {
          currentPos = tagEnd + 1;
          continue;
        }

        // Check if it's a closing tag
        if (tagContent.startsWith("/")) {
          currentPos = tagEnd + 1;
          continue;
        }

        // Check if it's a comment or special tag
        if (tagContent.startsWith("!") || tagContent.startsWith("?")) {
          currentPos = tagEnd + 1;
          continue;
        }

        // Extract tag name (handle tags with hyphens and numbers)
        const tagNameMatch = tagContent.match(/^([a-zA-Z][a-zA-Z0-9-]*)/);
        if (!tagNameMatch || !tagNameMatch[1]) {
          currentPos = tagEnd + 1;
          continue;
        }

        const tag = tagNameMatch[1].toLowerCase();
        const attrString = tagContent.substring(tagNameMatch[0].length).trim();

        // Check if it's a self-closing tag
        const isSelfClosing =
          tagContent.endsWith("/") ||
          ["img", "br", "hr", "input", "meta", "link"].includes(tag);

        // Parse attributes
        const attributes: Record<string, string> = {};
        if (attrString) {
          const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*?)["']|(\w+(?:-\w+)*)/g;
          let attrMatch;

          while ((attrMatch = attrRegex.exec(attrString)) !== null) {
            if (attrMatch[1]) {
              attributes[attrMatch[1].toLowerCase()] = attrMatch[2] || "";
            } else if (attrMatch[3]) {
              attributes[attrMatch[3].toLowerCase()] = "";
            }
          }
        }

        // Find matching closing tag
        let children: ParsedNode[] = [];
        let innerPos = tagEnd + 1;

        if (!isSelfClosing) {
          const closingTag = `</${tag}>`;
          const closePos = normalized.indexOf(closingTag, innerPos);

          if (closePos !== -1) {
            const innerHTML = normalized.substring(innerPos, closePos);
            // Recursively parse inner HTML
            if (innerHTML.trim()) {
              children = parseHTML(innerHTML);
            }
            currentPos = closePos + closingTag.length;
          } else {
            currentPos = tagEnd + 1;
          }
        } else {
          currentPos = tagEnd + 1;
        }

        nodes.push({
          type: "element",
          tag,
          attributes,
          children,
        });
      } else {
        // Text node
        const nextTag = normalized.indexOf("<", currentPos);
        const textEnd = nextTag === -1 ? normalized.length : nextTag;
        const text = normalized.substring(currentPos, textEnd).trim();

        if (text) {
          nodes.push({
            type: "text",
            content: text,
          });
        }

        currentPos = textEnd;
      }
    }

    return nodes;
  } catch (error) {
    // If parsing fails for any reason, return empty array
    console.error("HTML parser error:", error);
    return [];
  }
}

/**
 * Generates inline styles for semantic tags
 */
function getStyleString(tag: string, existingStyle = ""): string {
  const baseStyles = semanticTagStyles[tag] || semanticTagStyles.div;

  const styleObj: Record<string, string> = {
    "font-size": baseStyles.fontSize,
    "font-weight": baseStyles.fontWeight,
    margin: baseStyles.margin,
    "line-height": baseStyles.lineHeight,
  };

  // Parse existing inline styles
  if (existingStyle) {
    const pairs = existingStyle.split(";");
    pairs.forEach((pair) => {
      const [key, value] = pair.split(":").map((s) => s.trim());
      if (key && value) {
        styleObj[key] = value;
      }
    });
  }

  // Convert to style string
  return Object.entries(styleObj)
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

/**
 * Converts parsed nodes back to HTML string with proper styling
 */
function nodesToHTML(nodes: ParsedNode[]): string {
  try {
    return nodes
      .map((node) => {
        if (!node) return "";

        if (node.type === "text") {
          return node.content || "";
        }

        const tag = node.tag;
        if (!tag) return "";

        const attributes = node.attributes || {};

        // Get styled string for semantic tags
        const style = getStyleString(tag, attributes.style);

        // Build attribute string
        const attrString = Object.entries(attributes)
          .filter(([key]) => key !== "style" && key && attributes[key] !== null)
          .map(
            ([key, value]) =>
              `${key}="${String(value).replace(/"/g, "&quot;")}"`,
          )
          .join(" ");

        // Recursively convert children
        const innerHTML =
          node.children && node.children.length > 0
            ? nodesToHTML(node.children)
            : attributes.alt || ""; // For img tags

        // Build tag
        const selfClosing = ["img", "br", "hr", "input"].includes(tag);

        if (selfClosing) {
          return `<${tag} style="${style}"${attrString ? ` ${attrString}` : ""} />`;
        }

        const attrPart = attrString ? ` ${attrString}` : "";
        return `<${tag} style="${style}"${attrPart}>${innerHTML}</${tag}>`;
      })
      .join("");
  } catch (error) {
    console.error("HTML to string conversion error:", error);
    return "";
  }
}

/**
 * Compiles HTML string, ensuring semantic tags are preserved and properly styled
 * @param htmlContent - Raw HTML string (e.g., "<h1>Title</h1><p>Content</p>")
 * @returns Compiled HTML with proper semantic styling
 */
export function compileHTML(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== "string") {
    return "";
  }

  try {
    const trimmed = htmlContent.trim();

    if (!trimmed) {
      return "";
    }

    // Parse the HTML
    const parsedNodes = parseHTML(trimmed);

    // If parsing failed, return sanitized original content
    if (!parsedNodes || parsedNodes.length === 0) {
      return sanitizeHTML(trimmed);
    }

    // Convert back to HTML with proper styling
    const compiledHTML = nodesToHTML(parsedNodes);

    return compiledHTML || sanitizeHTML(trimmed);
  } catch (error) {
    // If parsing fails, return sanitized content as fallback
    console.error("HTML compilation error:", error);
    try {
      return sanitizeHTML(htmlContent);
    } catch {
      return "";
    }
  }
}

/**
 * Validates if HTML is properly formed
 * @param htmlContent - HTML string to validate
 * @returns boolean indicating if HTML is valid
 */
export function isValidHTML(htmlContent: string): boolean {
  if (!htmlContent || typeof htmlContent !== "string") {
    return false;
  }

  try {
    // Check for unmatched tags
    const openTags: string[] = [];
    const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(htmlContent)) !== null) {
      const [fullTag, tagName] = match;
      const tag = tagName.toLowerCase();
      const isClosing = fullTag.startsWith("</");
      const isSelfClosing = fullTag.endsWith("/>");

      if (isSelfClosing) continue;

      if (isClosing) {
        if (openTags[openTags.length - 1] === tag) {
          openTags.pop();
        }
      } else {
        openTags.push(tag);
      }
    }

    return openTags.length === 0;
  } catch {
    return false;
  }
}

/**
 * Sanitizes HTML to prevent XSS - removes script tags and event handlers
 * @param htmlContent - Raw HTML string
 * @returns Sanitized HTML
 */
export function sanitizeHTML(htmlContent: string): string {
  if (!htmlContent || typeof htmlContent !== "string") {
    return "";
  }

  // Remove script tags
  let sanitized = htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove style tags
  sanitized = sanitized.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // Remove potentially dangerous iframe and object tags
  sanitized = sanitized.replace(
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    "",
  );
  sanitized = sanitized.replace(
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    "",
  );
  sanitized = sanitized.replace(/<embed\b[^<]*/gi, "");

  return sanitized.trim();
}
