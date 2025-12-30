import {
  DndContext,
  type DragEndEvent,
  useDroppable,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { GridDroppable } from "./GridDroppable";
import { GridItem, type GridItemData } from "./GridItem";
import { arrayMove } from "@dnd-kit/sortable";
import { Radio, Group, Text, Modal, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { boardSizes } from "./data/boards";
import type { BoardType } from "./types/types";
import { ItemPicker } from "./ItemPicker";

export function NewApp() {
  const cards = Object.values(boardSizes).map((item) => (
    <Radio.Card className="p-2!" radius="md" value={item.name} key={item.name}>
      <Group wrap="nowrap" align="flex-start">
        <Radio.Indicator className="self-center" />
        <div>
          <Text className="">
            {item.name} - {item.price}
          </Text>
          <Text className="">{item.description}</Text>
        </div>
      </Group>
    </Radio.Card>
  ));

  const [activeBoardSize, setActiveBoardSize] = useState<BoardType>(
    boardSizes[1]
  );

  const [availableItems, setAvailableItems] = useState<GridItemData[]>([
    { id: "item-1", text: "Small", width: 20, height: 1 },
    { id: "item-2", text: "Medium", width: 40, height: 2 },
    { id: "item-3", text: "Large", width: 60, height: 2 },
    { id: "item-4", text: "Tiny", width: 10, height: 1 },
    { id: "item-5", text: "Big", width: 80, height: 2 },
  ]);

  const [opened, { open, close }] = useDisclosure(false);

  const [grid1Items, setGrid1Items] = useState<GridItemData[]>([]);
  const [grid2Items, setGrid2Items] = useState<GridItemData[]>([]);
  const [grid3Items, setGrid3Items] = useState<GridItemData[]>([]);
  const [activeItem, setActiveItem] = useState<GridItemData | null>(null);
  const [itemCounter, setItemCounter] = useState(6);

  // Helper function to calculate height based on width
  const calculateHeight = (width: number): number => {
    if (width <= 3) return 1;
    if (width <= 7) return 2;
    return 3;
  };

  // Item templates for creating new items
  const itemTemplates = [
    { text: "Tiny", width: 10 },
    {
      text: "Small",
      width: 20,
      backgroundImage: "/src/assets/45123202_9121422.svg",
    },
    { text: "Medium", width: 40 },
    { text: "Large", width: 60 },
    { text: "Big", width: 800 },
    {
      text: "Huge",
      width: 100,
      backgroundImage: "/src/assets/45123202_9121422.svg",
    },
  ];

  const createNewItem = (template: {
    text: string;
    width: number;
    backgroundImage?: string;
  }) => {
    const newItem: GridItemData = {
      id: `item-${itemCounter}`,
      text: template.text,
      width: template.width,
      height: calculateHeight(template.width),
      backgroundImage: template.backgroundImage,
    };
    setAvailableItems([...availableItems, newItem]);
    setItemCounter(itemCounter + 1);
  };

  const removeItemFromAvailable = (itemId: string) => {
    setAvailableItems(availableItems.filter((i) => i.id !== itemId));
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
    itemId: string
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
          `Not enough space! Need ${item.width} units but only ${remainingWidth} available.`
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
        sourceItems.filter((i) => i.id !== item.id)
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
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div id="main-container" className="flex w-full p-6 space-y-6 gap-4">
        <div id="title-and-grid" className="flex flex-col flex-2">
          <h1 className="text-2xl font-bold">Grid Drag & Drop</h1>

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

        <aside className="w-80 space-y-6 pt-5">
          <span>Select Board Size:</span>
          <Radio.Group
            value={activeBoardSize.name}
            onChange={(name) => {
              const selected = boardSizes.find((b) => b.name === name);
              if (selected) setActiveBoardSize(selected);
            }}
            label="Choose your board size"
            description="Select the board size that fits your needs">
            <div className="pt-md gap-xs">{cards}</div>
          </Radio.Group>
          <Button variant="default" onClick={open}>
            Choose Pieces
          </Button>

          <ItemCreator templates={itemTemplates} onCreate={createNewItem} />

          <AvailableItemsPool
            items={availableItems}
            onRemove={removeItemFromAvailable}
          />
        </aside>
      </div>
      {/* <DragOverlay>
        {activeItem ? <GridItem {...activeItem} /> : null}
      </DragOverlay> */}
      <Modal
        opened={opened}
        onClose={close}
        title="Pick Your Pieces"
        centered
        size="lg">
        <ItemPicker />
      </Modal>
    </DndContext>
  );
}

function ItemCreator({
  templates,
  onCreate,
}: {
  templates: { text: string; width: number; backgroundImage?: string }[];
  onCreate: (template: {
    text: string;
    width: number;
    backgroundImage?: string;
  }) => void;
}) {
  return (
    <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-900">
      <h3 className="font-bold mb-3">Create New Items</h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onCreate(template)}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold transition-colors">
            + {template.text} ({template.width})
          </button>
        ))}
      </div>
    </div>
  );
}

function AvailableItemsPool({
  items,
  onRemove,
}: {
  items: GridItemData[];
  onRemove: (itemId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "available",
  });

  const style = {
    backgroundColor: isOver ? "#f0fdf4" : undefined,
    borderColor: isOver ? "#22c55e" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors">
      <div className="flex flex-wrap gap-2">
        {items.length === 0 ? (
          <p className="text-gray-500 italic">
            No items available. Create new items above or drag items here to
            return them.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="relative w-32 group">
              <GridItem {...item} />
              <button
                onClick={() => onRemove(item.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove item">
                ×
              </button>
            </div>
          ))
        )}
      </div>
      <h3 className="font-bold mb-2">
        Available Items (Drop here to remove from grids)
      </h3>
    </div>
  );
}
