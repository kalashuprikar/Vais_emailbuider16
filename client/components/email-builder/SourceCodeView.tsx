import React, { useState } from "react";
import { EmailTemplate } from "./types";
import { renderTemplateToHTML } from "./utils";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface SourceCodeViewProps {
  template: EmailTemplate;
}

export const SourceCodeView: React.FC<SourceCodeViewProps> = ({ template }) => {
  const [copied, setCopied] = useState(false);

  const htmlContent = renderTemplateToHTML(template);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html" });
    element.href = URL.createObjectURL(file);
    element.download = `${template.name || "template"}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header with Actions */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            HTML Source Code
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete HTML for: {template.name || "Untitled Template"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copied!" : "Copy Code"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Code Display */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <pre className="p-4 text-xs font-mono text-gray-800 overflow-auto max-h-full leading-relaxed">
            <code>{htmlContent}</code>
          </pre>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t border-gray-200 p-4 text-sm text-gray-600 flex justify-between">
        <span>Lines: {htmlContent.split("\n").length}</span>
        <span>Characters: {htmlContent.length}</span>
        <span>Blocks: {template.blocks.length}</span>
      </div>
    </div>
  );
};
