import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GridItemData } from "./GridItem";

export function SortableGridItem({
  id,
  text,
  width,
  backgroundImage,
  svgSrc,
  icon,
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
    data: { width },
  });

  // For displaced (non-dragged) items, dampen the transform so they only
  // shift slightly rather than jumping far from their original position.
  const dampenedTransform =
    transform && !isDragging
      ? {
          ...transform,
          x: Math.round(transform.x * 0.5),
          y: Math.round(transform.y * 0.05),
        }
      : transform;

  const itemStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(dampenedTransform),
    transition,
    opacity: isDragging ? 0 : 1,
    height: "100%",
    cursor: isDragging ? "grabbing" : "grab",
    position: "relative",
    zIndex: isDragging ? 9999 : "auto",
  };

  return (
    <div ref={setNodeRef} style={itemStyle} {...listeners} {...attributes}>
      {icon}
    </div>
  );
}
