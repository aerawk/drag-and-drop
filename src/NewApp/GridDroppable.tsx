import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGridItem } from "./SortableGridItem";
import type { GridItemData } from "./GridItem";

interface GridDroppableProps {
  id: string;
  title: string;
  items: GridItemData[];
  maxWidth: number;
}

export function GridDroppable({
  id,
  title,
  items,
  maxWidth,
}: GridDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const usedWidth = items.reduce((sum, item) => sum + item.width, 0);
  const remainingWidth = maxWidth - usedWidth;

  const style = {
    backgroundColor: isOver ? "#e0f2fe" : "#f8fafc",
    borderColor: isOver ? "#3b82f6" : "#cbd5e1",
    width: `${maxWidth * 2 + 16}px`,
    maxWidth: `${maxWidth * 2 + 16}px`,
  };

  return (
    <div className="flex flex-col gap-2 flex-1">
      <h3 className="font-bold text-lg">{title}</h3>
      <div
        ref={setNodeRef}
        style={style}
        className="border-2 rounded-lg p-4 min-h-[200px] transition-colors">
        <div className="mb-2 text-sm text-gray-600">
          Capacity: {usedWidth}/{maxWidth} units (
          <span
            className={
              remainingWidth === 0 ? "text-red-600 font-bold" : "text-green-600"
            }>
            {remainingWidth} remaining
          </span>
          )
        </div>
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}>
          <div
            className="grid gap-0"
            style={{
              gridTemplateColumns: `repeat(${maxWidth}, 1fr)`,
              gridTemplateRows: "repeat(3, 40px)",
            }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="h-full mx-0.5"
                style={{
                  gridColumn: `span ${item.width}`,
                  gridRow: `${4 - item.height} / 4`,
                }}>
                <SortableGridItem {...item} />
              </div>
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
