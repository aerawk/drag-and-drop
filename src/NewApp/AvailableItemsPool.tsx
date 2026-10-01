import { useDroppable } from "@dnd-kit/core";
import type { GridItemData } from "./GridItem";
import type { BoardType } from "./types/types";
import { ItemWithContextMenu } from "./ItemWithContextMenu";

export function AvailableItemsPool({
  items,
  onRemove,
  onAddToGrid,
  grid1Items,
  grid2Items,
  grid3Items,
  activeBoardSize,
}: {
  items: GridItemData[];
  onRemove: (itemId: string) => void;
  onAddToGrid: (gridId: string, item: GridItemData) => void;
  grid1Items: GridItemData[];
  grid2Items: GridItemData[];
  grid3Items: GridItemData[];
  activeBoardSize: BoardType;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "available",
  });

  const style = {
    backgroundColor: isOver ? "#404040" : undefined,
    height: "fit-content",
    maxHeight: "400px",
    overflow: "auto",
  };

  const getAvailableGrids = (item: GridItemData) => {
    const grids = [
      { id: "grid-1", title: "Back Row", items: grid1Items },
      { id: "grid-2", title: "Middle Row", items: grid2Items },
      { id: "grid-3", title: "Front Row", items: grid3Items },
    ];

    return grids.map((grid) => {
      const usedWidth = grid.items.reduce((sum, i) => sum + i.width, 0);
      const remainingWidth = activeBoardSize.grooveWidth - usedWidth;
      return {
        id: grid.id,
        title: grid.title,
        hasSpace: item.width <= remainingWidth,
      };
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex-1 bg-neutral-800 text-white rounded-lg p-3 md:p-4 transition-colors">
      <h3 className="font-bold mb-2 text-sm md:text-base">Available Items</h3>
      <p className="text-xs mb-2">
        Click an item to add it to a row, or drag it directly to a board row.
      </p>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="italic text-xs sm:text-sm">
            No items yet. Click the "Browse Pieces" button above to find your
            perfect pieces!
          </p>
        ) : (
          items.map((item) => (
            <ItemWithContextMenu
              key={item.id}
              item={item}
              onRemove={onRemove}
              onAddToGrid={onAddToGrid}
              availableGrids={getAvailableGrids(item)}
            />
          ))
        )}
      </div>
    </div>
  );
}
