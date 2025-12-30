import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export interface GridItemData {
  id: string;
  text: string;
  width: number; // Width in grid units (1-10)
  height: number; // Height in grid units (1-3)
  backgroundImage?: string; // Optional background image URL
}

export function GridItem({
  id,
  text,
  width,
  height,
  backgroundImage,
}: GridItemData) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: { width, height },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    height: "100%",
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex justify-center items-center cursor-grab h-20 bg-blue-500 text-white rounded border-2 border-transparent hover:border-blue-700`}
      {...listeners}
      {...attributes}>
      <div className="text-center">
        <div className="font-bold">{text}</div>
        <div className="text-sm">
          W: {width} H: {height}
        </div>
      </div>
    </div>
  );
}
