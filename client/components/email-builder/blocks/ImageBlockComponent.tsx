import React, { useRef, useState } from "react";
import { ImageBlock } from "../types";
import { Upload } from "lucide-react";

interface ImageBlockComponentProps {
  block: ImageBlock;
  isSelected: boolean;
  onSrcChange: (src: string) => void;
  onDimensionChange: (width: number, height: number) => void;
}

export const ImageBlockComponent: React.FC<ImageBlockComponentProps> = ({
  block,
  isSelected,
  onSrcChange,
  onDimensionChange,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(block.width);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (warn if > 1MB)
      if (file.size > 1024 * 1024) {
        console.warn(
          "⚠️ Large image detected! File size: " +
            (file.size / 1024 / 1024).toFixed(2) +
            "MB. Consider using a smaller image to avoid storage issues.",
        );
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onSrcChange(result);
        }
      };
      reader.onerror = () => {
        console.error("❌ Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartX(e.clientX);
    setStartWidth(block.width);
  };

  React.useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      let newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px

      // Apply constraints based on width unit
      if (block.widthUnit === "%") {
        newWidth = Math.min(100, newWidth); // Max 100% for percentage
      } else {
        newWidth = Math.min(800, newWidth); // Max 800px for pixel width
      }

      onDimensionChange(newWidth, block.height);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, block, onDimensionChange]);

  return (
    <div
      className={`relative p-4 transition-all ${
        isSelected ? "ring-2 ring-valasys-orange" : ""
      }`}
      style={{ textAlign: block.alignment as any }}
    >
      {block.src ? (
        <div style={{ textAlign: block.alignment as any, overflow: "hidden" }}>
          <img
            src={block.src}
            alt={block.alt || "Image"}
            crossOrigin="anonymous"
            style={{
              width: `${block.width}${block.widthUnit}`,
              height:
                block.heightUnit === "%"
                  ? `${block.height}${block.heightUnit}`
                  : `${block.height}px`,
              display: block.alignment === "center" ? "block" : "inline",
              margin: block.alignment === "center" ? "0 auto" : "0",
              maxWidth: "100%",
              objectFit: "contain",
              boxSizing: "border-box",
            }}
            onError={(e) => {
              console.error("Image failed to load:", block.src);
              (e.target as HTMLImageElement).style.border = "2px solid red";
            }}
          />
        </div>
      ) : (
        <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload image</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};
