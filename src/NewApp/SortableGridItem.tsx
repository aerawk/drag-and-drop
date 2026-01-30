import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { GridItemData } from "./GridItem";
import { SvgItem } from "./SvgItem";
import { AppleIcon } from "./icons";

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: "100%",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {icon}
    </div>
  );
}
