import React from "react";
import { FeaturesBlock } from "../types";
import { renderBlockToHTML } from "../utils";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

interface FeaturesBlockComponentProps {
  block: FeaturesBlock;
  isSelected: boolean;
  onUpdate: (block: FeaturesBlock) => void;
  onDuplicate?: (block: FeaturesBlock, position: number) => void;
  onDelete?: (blockId: string) => void;
  blockIndex?: number;
}

export const FeaturesBlockComponent: React.FC<FeaturesBlockComponentProps> = ({
  block,
  isSelected,
  onDuplicate,
  onDelete,
  blockIndex = 0,
}) => {
  const html = renderBlockToHTML(block);

  return (
    <div className="w-full">
      {isSelected && (onDuplicate || onDelete) && (
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-2 shadow-sm mb-3 w-fit">
          {onDuplicate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-gray-100"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(block, blockIndex + 1);
              }}
              title="Duplicate this section"
            >
              <Copy className="w-4 h-4 text-gray-700" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-100"
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(block.id);
              }}
              title="Delete this section"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          )}
        </div>
      )}

      <div
        className={`w-full rounded-lg overflow-hidden ${
          isSelected ? "ring-2 ring-valasys-orange" : ""
        }`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};
