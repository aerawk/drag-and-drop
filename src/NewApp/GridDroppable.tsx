import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGridItem } from "./SortableGridItem";
import type { GridItemData } from "./GridItem";
import { useViewportSize } from "@mantine/hooks";
import { getScaledWidth } from "./ItemIcon";
import { useEffect, useState } from "react";

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
  const { width: viewportWidth } = useViewportSize();
  const [columns, setColumns] = useState(
    getScaledWidth(maxWidth, viewportWidth),
  );

  const usedWidth = items.reduce((sum, item) => sum + item.width, 0);
  const remainingWidth = maxWidth - usedWidth;

  const style = {
    backgroundColor: isOver ? "#ae8856ea" : "#ae8856",
    borderColor: isOver ? "##997547" : "#ae8856",
    width: `${getScaledWidth(maxWidth, viewportWidth)}px`,
    boxShadow: "12px 0px #ae8856,  -12px 0px #ae8856",
  };

  const dropAreaStyle = {
    backgroundColor: isOver ? "#4a4a4aa2" : "transparent",
    borderColor: isOver ? "##997547" : "transparent",
    // padding: "0 8px",
    height: "fit-content",
    minHeight: "100px",
    bottom: "-8px",
    width: `${getScaledWidth(maxWidth, viewportWidth)}px`,
  };
  useEffect(() => {
    setColumns(Math.round(getScaledWidth(maxWidth - 8, viewportWidth)));
  }, [maxWidth, viewportWidth]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 w-full relative items-center">
      <h3 className="font-bold text-base md:text-lg">{title}</h3>
      <div
        ref={setNodeRef}
        style={dropAreaStyle}
        className="transition-colors relative flex h-full">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}>
          <div
            className="grid gap-0 items-end relative"
            style={{
              gridTemplateColumns: `repeat(${columns + 16}, 1px)`,
              gridAutoRows: "auto",
              // minWidth: `${Math.min(maxWidth * 1.5, 300)}px`,
              width: "100%",
            }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="mx-0.5 relative w-fit"
                style={{
                  gridColumn: `span ${Math.round(getScaledWidth(item.width, viewportWidth))}`,
                }}>
                <SortableGridItem {...item} />
              </div>
            ))}
          </div>
        </SortableContext>
      </div>
      <div
        style={style}
        className={`border-2 border-dashed border-t-0 rounded-lg p-2 sm:p-3 md:p-4 ] h-8 transition-colors overflow-x-auto overflow-y-visible z-50`}></div>
      <div className="mb-2 text-xs sm:text-sm text-gray-300">
        Capacity: {usedWidth}/{maxWidth} units (
        <span
          className={
            remainingWidth === 0 ? "text-red-600 font-bold" : "text-green-600"
          }>
          {remainingWidth} remaining
        </span>
        )
      </div>
    </div>
  );
}
