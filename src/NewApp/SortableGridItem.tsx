import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GridItemData } from "./GridItem";

export function SortableGridItem({
  id,
  text,
  width,
  height,
  backgroundImage,
}: GridItemData) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: { width, height },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
      className={`flex justify-center items-center cursor-grab bg-blue-500 text-white rounded border-2 border-blue-700`}
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
