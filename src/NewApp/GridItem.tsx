import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
export interface GridItemData {
  id: string;
  text: string;
  width: number;
  svgSrc: string;
  icon: React.ReactNode;
}

interface GridItemProps extends GridItemData {
  onItemClick?: (e: React.MouseEvent) => void;
  onLongPress?: () => void;
  dragHandleProps?: {
    listeners: any;
    attributes: any;
  };
  isOverlay?: boolean;
}

export function GridItem({
  id,
  text,
  width,
  svgSrc,
  isOverlay = false,
}: GridItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { width },
      disabled: isOverlay,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative h-full flex flex-col justify-center items-center text-white rounded border-2 border-transparent hover:bg-neutral-700 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      {...listeners}
      {...attributes}>
      <div className="w-full h-full px-2 flex items-center justify-center pointer-events-none">
        <img
          src={svgSrc}
          alt={text}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}
