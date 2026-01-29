import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { ContentBlock } from "./types";
import { BlockRenderer } from "./BlockRenderer";
import { BlockActions } from "./BlockActions";
import { cn } from "@/lib/utils";

interface DraggableBlockProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isSelected: boolean;
  isEditing?: boolean;
  selectedFooterElement?: string | null;
  onBlockUpdate: (block: ContentBlock) => void;
  onBlockSelect: (id: string) => void;
  onEditingBlockChange?: (id: string | null) => void;
  onFooterElementSelect?: (element: string | null) => void;
  onMoveBlock: (dragIndex: number, hoverIndex: number) => void;
  onAddBlock: (block: ContentBlock, position: number) => void;
  onDuplicate: (block: ContentBlock, position: number) => void;
  onDelete: (blockId: string) => void;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  index,
  totalBlocks,
  isSelected,
  isEditing,
  selectedFooterElement,
  onBlockUpdate,
  onBlockSelect,
  onEditingBlockChange,
  onFooterElementSelect,
  onMoveBlock,
  onAddBlock,
  onDuplicate,
  onDelete,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "canvas-block",
      item: () => ({ index, blockId: block.id }),
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [index, block.id],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "canvas-block",
      hover: (item: { index: number; blockId: string }) => {
        if (item.index !== index) {
          onMoveBlock(item.index, index);
          item.index = index;
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [index, onMoveBlock],
  );

  const ref = React.useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  drag(drop(ref));

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative cursor-move rounded-lg transition-all",
        isDragging && "opacity-50 scale-95 transition-all",
        isOver && "ring-2 ring-valasys-orange rounded-lg",
      )}
      style={{
        border: isHovered ? "2px dashed rgb(255, 106, 0)" : "2px solid transparent",
      }}
    >

      <BlockRenderer
        block={block}
        isSelected={isSelected}
        isEditing={isEditing}
        selectedFooterElement={selectedFooterElement}
        onBlockUpdate={onBlockUpdate}
        onBlockSelect={onBlockSelect}
        onEditingBlockChange={onEditingBlockChange}
        onFooterElementSelect={onFooterElementSelect}
        onAddBlock={onAddBlock}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        blockIndex={index}
      />

      {isSelected && (
        <div className="px-4 py-2">
          <BlockActions
            block={block}
            blockIndex={index}
            totalBlocks={totalBlocks}
            onAddBlock={onAddBlock}
            onDuplicate={onDuplicate}
            onDelete={() => onDelete(block.id)}
          />
        </div>
      )}
    </div>
  );
};
