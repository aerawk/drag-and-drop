import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  useDroppable,
  type DragStartEvent,
  pointerWithin,
} from "@dnd-kit/core";
import { useState } from "react";
import { GridDroppable } from "./GridDroppable";
import { GridItem, type GridItemData } from "./GridItem";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Radio,
  Group,
  Text,
  Modal,
  Button,
  Menu,
  Drawer,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState as useReactState, useRef, useEffect } from "react";
import { boardSizes } from "./data/boards";
import type { BoardType } from "./types/types";
import { ItemPicker } from "./ItemPicker";
import { toKebabId, type IconRegistryEntry } from "./data/iconRegistry";
import { ItemIcon } from "./ItemIcon";

export function NewApp() {
  const cards = Object.values(boardSizes).map((item) => (
    <Radio.Card
      className="p-2 sm:p-3!"
      radius="md"
      value={item.name}
      key={item.name}>
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator className="self-center" />
        <div className="min-w-0">
          <Text className="text-xs sm:text-sm md:text-base truncate">
            {item.name} - {item.price}
          </Text>
          <Text className="text-xs sm:text-sm text-gray-600">
            {item.description}
          </Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  const [activeBoardSize, setActiveBoardSize] = useState<BoardType>(
    boardSizes[1],
  );

  const [availableItems, setAvailableItems] = useState<GridItemData[]>([]);

  const [opened, { open, close }] = useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(true);

  const [grid1Items, setGrid1Items] = useState<GridItemData[]>([]);
  const [grid2Items, setGrid2Items] = useState<GridItemData[]>([]);
  const [grid3Items, setGrid3Items] = useState<GridItemData[]>([]);
  const [activeItem, setActiveItem] = useState<GridItemData | null>(null);
  const itemCounterRef = useRef(0);

  const handleAddItems = (selectedEntries: IconRegistryEntry[]) => {
    const newItems: GridItemData[] = selectedEntries.map((entry) => {
      itemCounterRef.current += 1;
      const uniqueId = `${toKebabId(entry.name)}-${itemCounterRef.current}`;
      return {
        id: uniqueId,
        text: entry.name,
        width: entry.width,
        svgSrc: entry.svgSrc,
        icon: (
          <ItemIcon
            src={entry.svgSrc}
            alt={`${entry.name} Icon`}
            width={entry.width}
          />
        ),
      };
    });
    setAvailableItems((prev) => [...prev, ...newItems]);
    close();
  };

  const removeItemFromAvailable = (itemId: string) => {
    setAvailableItems(availableItems.filter((i) => i.id !== itemId));
  };

  const addItemToGrid = (gridId: string, item: GridItemData) => {
    // Check capacity
    const targetItems = getGridItems(gridId);
    const usedWidth = targetItems.reduce((sum, i) => sum + i.width, 0);
    const remainingWidth = activeBoardSize.grooveWidth - usedWidth;

    if (item.width > remainingWidth) {
      alert(
        `Not enough space! Need ${item.width}mm but only ${remainingWidth}mm available.`,
      );
      return;
    }

    // Remove from available items
    setAvailableItems(availableItems.filter((i) => i.id !== item.id));

    // Add to target grid
    setGridItems(gridId, [...targetItems, item]);
  };

  const getGridItems = (gridId: string) => {
    switch (gridId) {
      case "grid-1":
        return grid1Items;
      case "grid-2":
        return grid2Items;
      case "grid-3":
        return grid3Items;
      default:
        return [];
    }
  };

  const setGridItems = (gridId: string, items: GridItemData[]) => {
    switch (gridId) {
      case "grid-1":
        setGrid1Items(items);
        break;
      case "grid-2":
        setGrid2Items(items);
        break;
      case "grid-3":
        setGrid3Items(items);
        break;
    }
  };

  const findItemLocation = (
    itemId: string,
  ): { location: string; item: GridItemData } | null => {
    const allSources = [
      { location: "available", items: availableItems },
      { location: "grid-1", items: grid1Items },
      { location: "grid-2", items: grid2Items },
      { location: "grid-3", items: grid3Items },
    ];

    for (const source of allSources) {
      const item = source.items.find((i) => i.id === itemId);
      if (item) return { location: source.location, item };
    }
    return null;
  };

  function handleDragStart(event: DragStartEvent) {
    const itemLocation = findItemLocation(event.active.id as string);
    if (itemLocation) {
      setActiveItem(itemLocation.item);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const itemLocation = findItemLocation(active.id as string);
    if (!itemLocation) return;

    const { location: sourceLocation, item } = itemLocation;

    // Determine if we're hovering over an item or a container
    const overLocation = findItemLocation(over.id as string);
    const targetLocation = overLocation
      ? overLocation.location
      : (over.id as string);

    // Handle reordering within the same grid
    if (
      sourceLocation === targetLocation &&
      sourceLocation.startsWith("grid-")
    ) {
      const items = getGridItems(sourceLocation);
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setGridItems(sourceLocation, arrayMove(items, oldIndex, newIndex));
      }
      return;
    }

    // If dropping in the same location (container), do nothing
    if (sourceLocation === targetLocation) return;

    // Check capacity if dropping into a grid
    if (targetLocation.startsWith("grid-")) {
      const targetItems = getGridItems(targetLocation);
      const usedWidth = targetItems.reduce((sum, i) => sum + i.width, 0);
      const remainingWidth = activeBoardSize.grooveWidth - usedWidth;

      if (item.width > remainingWidth) {
        alert(
          `Not enough space! Need ${item.width} units but only ${remainingWidth} available.`,
        );
        return;
      }
    }

    // Remove from source
    if (sourceLocation === "available") {
      setAvailableItems(availableItems.filter((i) => i.id !== item.id));
    } else if (sourceLocation.startsWith("grid-")) {
      const sourceItems = getGridItems(sourceLocation);
      setGridItems(
        sourceLocation,
        sourceItems.filter((i) => i.id !== item.id),
      );
    }

    // Add to target
    if (targetLocation === "available") {
      setAvailableItems([...availableItems, item]);
    } else if (targetLocation.startsWith("grid-")) {
      const targetItems = getGridItems(targetLocation);
      setGridItems(targetLocation, [...targetItems, item]);
    }
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <div
        id="main-container"
        className="flex flex-col w-full max-w-full p-3 sm:p-4 md:p-6 overflow-x-hidden">
        <div id="title-and-grid" className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Grid Drag & Drop</h2>
            <Button variant="" size="sm" onClick={toggleDrawer}>
              {drawerOpened ? "Hide Panel" : "Show Panel"}
            </Button>
          </div>

          <div id="grid-container" className="flex flex-col gap-4">
            <GridDroppable
              id="grid-1"
              title="Back Row"
              items={grid1Items}
              maxWidth={activeBoardSize.grooveWidth}
            />
            <GridDroppable
              id="grid-2"
              title="Middle Row"
              items={grid2Items}
              maxWidth={activeBoardSize.grooveWidth}
            />
            <GridDroppable
              id="grid-3"
              title="Front Row"
              items={grid3Items}
              maxWidth={activeBoardSize.grooveWidth}
            />
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem ? activeItem.icon : null}
      </DragOverlay>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        title="Add Pieces and Select Your Board Size!"
        position="bottom"
        withOverlay={false}
        trapFocus={false}
        lockScroll={false}
        size={"sm"}
        styles={{
          title: { fontWeight: 600 },
          content: {
            borderTop: "1px solid #313131",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5)",
            backgroundColor: "#3c3c3c",
          },
        }}
        radius="lg"
        shadow="xl">
        <div className="flex flex-row space-x-4">
          <div className="flex flex-col gap-4 flex-2">
            <AvailableItemsPool
              items={availableItems}
              onRemove={removeItemFromAvailable}
              onAddToGrid={addItemToGrid}
              grid1Items={grid1Items}
              grid2Items={grid2Items}
              grid3Items={grid3Items}
              activeBoardSize={activeBoardSize}
            />
            <Button
              variant="default"
              onClick={open}
              className="w-full sm:w-auto">
              Browse Pieces
            </Button>
          </div>

          {/* <Radio.Group
            value={activeBoardSize.name}
            onChange={(name) => {
              const selected = boardSizes.find((b) => b.name === name);
              if (selected) setActiveBoardSize(selected);
            }}
            label="Choose your board size"
            description="Select the board size that fits your needs"
            classNames={{
              label: "text-sm md:text-base",
              description: "text-xs md:text-sm",
            }}>
            <div className="pt-md gap-xs">{cards}</div>
          </Radio.Group> */}
          <div className="flex flex-1">
            <Select
              height={80}
              label="Choose your board size"
              description="Select between our small, medium, and large boards to fit your project needs!"
              value={activeBoardSize.name}
              onChange={(name) => {
                const selected = boardSizes.find((b) => b.name === name);
                if (selected) setActiveBoardSize(selected);
              }}
              data={boardSizes.map((b) => ({
                value: b.name,
                label: `${b.name} - ${b.description} - ${b.price}`,
              }))}
              classNames={{
                label: "text-sm md:text-base",
                description: "text-xs md:text-sm",
              }}
            />
          </div>
        </div>
      </Drawer>
      <Modal
        id="item-picker-modal"
        opened={opened}
        onClose={close}
        title="Pick Your Pieces"
        centered
        size="lg">
        <ItemPicker onAddItems={handleAddItems} />
      </Modal>
    </DndContext>
  );
}

function ItemWithContextMenu({
  item,
  onRemove,
  onAddToGrid,
  availableGrids,
}: {
  item: GridItemData;
  onRemove: (itemId: string) => void;
  onAddToGrid: (gridId: string, item: GridItemData) => void;
  availableGrids: { id: string; title: string; hasSpace: boolean }[];
}) {
  const [menuOpened, setMenuOpened] = useReactState(false);
  const longPressTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLongPressStart = (e: React.TouchEvent) => {
    // Only trigger long press on the GridItem itself, not the buttons
    if ((e.target as HTMLElement).closest("button")) return;

    longPressTimer.current = setTimeout(() => {
      setMenuOpened(true);
    }, 500); // 500ms for long press
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // Don't open menu if clicking the remove button
    if ((e.target as HTMLElement).closest("button[data-remove]")) return;
    e.preventDefault();
    e.stopPropagation();
    setMenuOpened(true);
  };

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const gridsWithSpace = availableGrids.filter((g) => g.hasSpace);

  return (
    <Menu
      opened={menuOpened}
      onChange={setMenuOpened}
      position="bottom-start"
      withArrow>
      <Menu.Target>
        <div
          ref={containerRef}
          className="relative w-24 sm:w-28 md:w-32 aspect-square group"
          onTouchStart={handleLongPressStart}
          onTouchEnd={handleLongPressEnd}
          onTouchCancel={handleLongPressEnd}>
          <GridItem
            {...item}
            svgSrc={item.svgSrc}
            key={item.id}
            useDragHandle={true}
            onItemClick={handleItemClick}
          />

          {/* Remove button */}
          <button
            data-remove
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10"
            title="Remove item">
            ×
          </button>
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Add to row</Menu.Label>
        {gridsWithSpace.length === 0 ? (
          <Menu.Item disabled>
            No rows have enough space ({item.width}mm needed)
          </Menu.Item>
        ) : (
          gridsWithSpace.map((grid) => (
            <Menu.Item
              key={grid.id}
              onClick={() => {
                onAddToGrid(grid.id, item);
                setMenuOpened(false);
              }}>
              {grid.title}
            </Menu.Item>
          ))
        )}
      </Menu.Dropdown>
    </Menu>
  );
}

function AvailableItemsPool({
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
    backgroundColor: isOver ? "#f0fdf4" : undefined,
    borderColor: isOver ? "#22c55e" : undefined,
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
      className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 transition-colors">
      <h3 className="font-bold mb-2 text-sm md:text-base">Available Items</h3>
      <p className="text-xs text-gray-600 mb-2">
        Click an item to add it to a row, long-press for menu, or drag using the
        handle (⋮⋮) that appears on hover.
      </p>
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-gray-500 italic text-xs sm:text-sm">
            No items yet. Click "Choose Pieces" to add items, or drag items here
            to return them.
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
