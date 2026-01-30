import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SvgItem } from "./SvgItem";

export interface GridItemData {
  id: string;
  text: string;
  width: number; // Width in grid units (1-10)
  backgroundImage?: string; // Optional background image URL (deprecated - use svgSrc)
  svgSrc?: string; // Optional SVG source path for properly constrained rendering
  icon: React.ReactNode;
}

interface GridItemProps extends GridItemData {
  useDragHandle?: boolean;
  onItemClick?: (e: React.MouseEvent) => void;
  onLongPress?: () => void;
  dragHandleProps?: {
    listeners: any;
    attributes: any;
  };
}

export function GridItem({
  id,
  text,
  width,
  backgroundImage,
  svgSrc,
  icon,
  useDragHandle = false,
  onItemClick,
  onLongPress,
  dragHandleProps,
}: GridItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { width },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onItemClick) {
      onItemClick(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group/item relative flex flex-col justify-center items-center py-3 sm:py-4 bg-blue-500 text-white rounded border-2 border-transparent hover:border-blue-700 ${
        useDragHandle ? "cursor-pointer" : "cursor-grab"
      }`}
      onClick={useDragHandle ? handleClick : undefined}
      {...(!useDragHandle ? listeners : {})}
      {...(!useDragHandle ? attributes : {})}>
      {/* {svgSrc && (
        <div className="w-full px-2 mb-2 pointer-events-none">
          <SvgItem width={width} src={svgSrc} alt={text} />
        </div>
      )} */}
      {icon}
      <div className="text-center px-1 pointer-events-none">
        <div className="font-bold text-xs sm:text-sm md:text-base truncate">
          {text}
        </div>
        <div className="text-[10px] sm:text-xs">W: {width}</div>
      </div>

      {/* Drag Handle - only shown when useDragHandle is true */}
      {useDragHandle && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-10 bg-gray-300 hover:bg-gray-400 rounded cursor-grab flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-auto shadow-md ${
            isDragging ? "opacity-100" : ""
          }`}
          {...listeners}
          {...attributes}
          title="Drag to move">
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="1" fill="white" />
            <circle cx="8" cy="4" r="1" fill="white" />
            <circle cx="4" cy="8" r="1" fill="white" />
            <circle cx="8" cy="8" r="1" fill="white" />
            <circle cx="4" cy="12" r="1" fill="white" />
            <circle cx="8" cy="12" r="1" fill="white" />
          </svg>
        </div>
      )}
    </div>
  );
}
