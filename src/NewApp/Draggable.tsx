import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function Draggable({
  id,
  text,
  props,
}: {
  id: string;
  text: string;
  props?: any;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-center items-center cursor-grab h-24 w-24 bg-green-400 text-black rounded"
      {...listeners}
      {...attributes}>
      {text}
    </div>
  );
}
