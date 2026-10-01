import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { GridDroppable } from "./GridDroppable";
import type { GridItemData } from "./GridItem";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Text,
  Modal,
  Button,
  Drawer,
  Popover,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useState, useRef } from "react";
import { boardSizes } from "./data/boards";
import type { BoardType } from "./types/types";
import { ItemPicker } from "./ItemPicker";
import { toKebabId, type IconRegistryEntry } from "./data/iconRegistry";
import { ItemIcon } from "./ItemIcon";
import { BoardPreview } from "./BoardPreview";
import type { JustifyValue } from "./GridDroppable";
import { useAutoHideHeader } from "./useAutoHideHeader";
import { AvailableItemsPool } from "./AvailableItemsPool";
import { BoardSizeIcon } from "./icons/BoardSizeIcon";
import { ChevronLeftIcon, PlusIcon, EyeIcon } from "./icons/UIIcons";

export function NewApp() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);
  const headerVisible = useAutoHideHeader();
  const isCompact = useMediaQuery("(max-width: 650px)");
  const isNarrow = useMediaQuery("(max-width: 500px)");

  const [activeBoardSize, setActiveBoardSize] = useState<BoardType>(
    boardSizes[1],
  );

  const [availableItems, setAvailableItems] = useState<GridItemData[]>([]);

  const [isItemPickerOpen, { open: openPicker, close: closePicker }] =
    useDisclosure(false);
  const [isPreviewOpen, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const [isDrawerOpen, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(true);

  const [grid1Items, setGrid1Items] = useState<GridItemData[]>([]);
  const [grid2Items, setGrid2Items] = useState<GridItemData[]>([]);
  const [grid3Items, setGrid3Items] = useState<GridItemData[]>([]);
  const [activeItem, setActiveItem] = useState<GridItemData | null>(null);
  const itemCounterRef = useRef(0);

  const [justify1, setJustify1] = useState<JustifyValue>("center");
  const [justify2, setJustify2] = useState<JustifyValue>("center");
  const [justify3, setJustify3] = useState<JustifyValue>("center");

  type PreviewData = {
    grid1: GridItemData[];
    grid2: GridItemData[];
    grid3: GridItemData[];
    boardSize: BoardType;
    justify1: JustifyValue;
    justify2: JustifyValue;
    justify3: JustifyValue;
  };
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const generatePreview = () => {
    setPreviewData({
      grid1: [...grid1Items],
      grid2: [...grid2Items],
      grid3: [...grid3Items],
      boardSize: activeBoardSize,
      justify1,
      justify2,
      justify3,
    });
    openPreview();
  };

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

  const handleMoveToRow = (
    sourceGridId: string,
    itemId: string,
    targetGridId: string,
  ) => {
    const sourceItems = getGridItems(sourceGridId);
    const item = sourceItems.find((i) => i.id === itemId);
    if (!item) return;
    const targetItems = getGridItems(targetGridId);
    const usedWidth = targetItems.reduce((sum, i) => sum + i.width, 0);
    const remainingWidth = activeBoardSize.grooveWidth - usedWidth;
    if (item.width > remainingWidth) return;
    setGridItems(
      sourceGridId,
      sourceItems.filter((i) => i.id !== itemId),
    );
    setGridItems(targetGridId, [...targetItems, item]);
  };

  const handleRemoveFromGrid = (gridId: string, itemId: string) => {
    const items = getGridItems(gridId);
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    setGridItems(
      gridId,
      items.filter((i) => i.id !== itemId),
    );
    setAvailableItems((prev) => [...prev, item]);
  };

  const handleMoveItem = (
    gridId: string,
    itemId: string,
    direction: "left" | "right" | "start" | "end",
  ) => {
    const items = getGridItems(gridId);
    const index = items.findIndex((i) => i.id === itemId);
    if (index === -1) return;
    let newIndex: number;
    switch (direction) {
      case "start":
        newIndex = 0;
        break;
      case "end":
        newIndex = items.length - 1;
        break;
      case "left":
        newIndex = index - 1;
        break;
      case "right":
        newIndex = index + 1;
        break;
    }
    if (newIndex < 0 || newIndex >= items.length || newIndex === index) return;
    setGridItems(gridId, arrayMove(items, index, newIndex));
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

  const getRemainingWidth = (gridId: string) => {
    const items = getGridItems(gridId);
    return (
      activeBoardSize.grooveWidth - items.reduce((sum, i) => sum + i.width, 0)
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-neutral-900 transition-transform duration-300 ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <h2 className={`${isNarrow ? "text-lg" : "text-2xl"} font-bold`}>
          Groove Board
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <Popover position="bottom" withArrow shadow="md">
              <Popover.Target>
                <Tooltip label="Choose Board" disabled={!isCompact}>
                  <Button variant="" size={isNarrow ? "xs" : "sm"}>
                    {isCompact ? <BoardSizeIcon size="large" /> : "Choose Board"}
                  </Button>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown w={"350px"}>
                <div className="flex flex-col items-center gap-2">
                  <Text size="sm" fw={600}>
                    Choose Your Board Size
                  </Text>
                  <div className="flex items-center gap-1">
                    {boardSizes.map((board) => {
                      const maxRowWidth = Math.max(
                        grid1Items.reduce((sum, i) => sum + i.width, 0),
                        grid2Items.reduce((sum, i) => sum + i.width, 0),
                        grid3Items.reduce((sum, i) => sum + i.width, 0),
                      );
                      const tooSmall = board.grooveWidth < maxRowWidth;
                      const isActive = activeBoardSize.name === board.name;
                      return (
                        <Tooltip
                          key={board.name}
                          label={
                            tooSmall
                              ? `Your current items exceed the width of this board.`
                              : `${board.label} — ${board.price}`
                          }
                          position="top"
                          openDelay={250}
                          withArrow>
                          <div className="flex flex-col items-center">
                            <Button
                              type="button"
                              disabled={tooSmall}
                              onClick={() => setActiveBoardSize(board)}
                              className="p-0 rounded transition-colors"
                              style={{
                                backgroundColor: isActive
                                  ? "#ffffff30"
                                  : "transparent",
                                color: isActive ? "#fff" : "#9ca3af",
                              }}>
                              <BoardSizeIcon size={board.size} />
                            </Button>
                            <span className="text-md font-semibold mt-1 h-3.5">
                              {isActive ? board.name : ""}
                            </span>
                          </div>
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm">
                      {activeBoardSize.description}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {activeBoardSize.price}
                    </span>
                  </div>
                </div>
              </Popover.Dropdown>
            </Popover>
            {isCompact && (
              <span className="text-[10px] text-neutral-400 font-semibold">
                Board
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <Tooltip
              label={isDrawerOpen ? "Hide Panel" : "Add Pieces"}
              disabled={!isCompact}>
              <Button
                variant={isDrawerOpen ? "" : "gradient"}
                size={isNarrow ? "xs" : "sm"}
                onClick={toggleDrawer}>
                {isCompact ? (
                  isDrawerOpen ? (
                    <ChevronLeftIcon />
                  ) : (
                    <PlusIcon />
                  )
                ) : isDrawerOpen ? (
                  "Hide Panel"
                ) : (
                  "Add Pieces"
                )}
              </Button>
            </Tooltip>
            {isCompact && (
              <span className="text-[10px] text-neutral-400 font-semibold">
                Pieces
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <Tooltip label="Generate Preview" disabled={!isCompact}>
              <Button
                variant="gradient"
                size={isNarrow ? "xs" : "sm"}
                onClick={generatePreview}>
                {isCompact ? <EyeIcon /> : "Generate Preview"}
              </Button>
            </Tooltip>
            {isCompact && (
              <span className="text-[10px] text-neutral-400  font-semibold">
                Preview
              </span>
            )}
          </div>
        </div>
      </header>
      <div
        id="main-container"
        className="flex flex-col w-full max-w-full p-3 sm:p-4 md:p-6 overflow-x-hidden sm:pt-10 md:pt-12 lg:pt-16">
        <div
          id="title-and-grid"
          className="flex flex-col flex-1 min-w-0"
          style={{ paddingBottom: isDrawerOpen ? "400px" : "initial" }}>
          <div id="grid-container" className="flex flex-col gap-4 pt-6">
            <GridDroppable
              id="grid-1"
              title="Back Row"
              items={grid1Items}
              activeBoardSize={activeBoardSize}
              onMoveItem={(itemId, direction) =>
                handleMoveItem("grid-1", itemId, direction)
              }
              onRemoveItem={(itemId) => handleRemoveFromGrid("grid-1", itemId)}
              onMoveToRow={(itemId, targetGridId) =>
                handleMoveToRow("grid-1", itemId, targetGridId)
              }
              otherGrids={[
                {
                  id: "grid-2",
                  title: "Middle Row",
                  remainingWidth: getRemainingWidth("grid-2"),
                },
                {
                  id: "grid-3",
                  title: "Front Row",
                  remainingWidth: getRemainingWidth("grid-3"),
                },
              ]}
              isDragging={!!activeItem}
              justifyItems={justify1}
              onJustifyChange={setJustify1}
            />
            <GridDroppable
              id="grid-2"
              title="Middle Row"
              items={grid2Items}
              activeBoardSize={activeBoardSize}
              onMoveItem={(itemId, direction) =>
                handleMoveItem("grid-2", itemId, direction)
              }
              onRemoveItem={(itemId) => handleRemoveFromGrid("grid-2", itemId)}
              onMoveToRow={(itemId, targetGridId) =>
                handleMoveToRow("grid-2", itemId, targetGridId)
              }
              otherGrids={[
                {
                  id: "grid-1",
                  title: "Back Row",
                  remainingWidth: getRemainingWidth("grid-1"),
                },
                {
                  id: "grid-3",
                  title: "Front Row",
                  remainingWidth: getRemainingWidth("grid-3"),
                },
              ]}
              isDragging={!!activeItem}
              justifyItems={justify2}
              onJustifyChange={setJustify2}
            />
            <GridDroppable
              id="grid-3"
              title="Front Row"
              items={grid3Items}
              activeBoardSize={activeBoardSize}
              onMoveItem={(itemId, direction) =>
                handleMoveItem("grid-3", itemId, direction)
              }
              onRemoveItem={(itemId) => handleRemoveFromGrid("grid-3", itemId)}
              onMoveToRow={(itemId, targetGridId) =>
                handleMoveToRow("grid-3", itemId, targetGridId)
              }
              otherGrids={[
                {
                  id: "grid-1",
                  title: "Back Row",
                  remainingWidth: getRemainingWidth("grid-1"),
                },
                {
                  id: "grid-2",
                  title: "Middle Row",
                  remainingWidth: getRemainingWidth("grid-2"),
                },
              ]}
              isDragging={!!activeItem}
              justifyItems={justify3}
              onJustifyChange={setJustify3}
            />
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem ? activeItem.icon : null}
      </DragOverlay>
      <Drawer
        opened={isDrawerOpen}
        onClose={closeDrawer}
        title={
          <div className="flex items-center justify-between w-full">
            {/* <h2>Add Pieces</h2> */}
            <Button
              variant="gradient"
              onClick={openPicker}
              className="w-full sm:w-auto absolute! top-3 left-1/2 -translate-x-1/2! sm:static sm:translate-x-0">
              Browse Pieces
            </Button>
          </div>
        }
        position="bottom"
        withOverlay={false}
        trapFocus={false}
        lockScroll={false}
        size={"sm"}
        styles={{
          title: {
            fontWeight: 600,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          },
          content: {
            borderTop: "1px solid #313131",
            boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.5)",
            backgroundColor: "#3c3c3c",
          },
          body: {
            paddingTop: "8px",
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 60px)",
          },
        }}
        radius="lg"
        shadow="xl">
        <div className="flex flex-row space-x-4 flex-1">
          <div className="flex flex-col gap-4 flex-1">
            <AvailableItemsPool
              items={availableItems}
              onRemove={removeItemFromAvailable}
              onAddToGrid={addItemToGrid}
              grid1Items={grid1Items}
              grid2Items={grid2Items}
              grid3Items={grid3Items}
              activeBoardSize={activeBoardSize}
            />
          </div>
        </div>
      </Drawer>
      <Modal
        id="item-picker-modal"
        opened={isItemPickerOpen}
        onClose={closePicker}
        title="Pick Your Pieces"
        centered
        size="lg"
        removeScrollProps={{ allowPinchZoom: true }}>
        <ItemPicker onAddItems={handleAddItems} />
      </Modal>
      <Modal
        id="preview-modal"
        opened={isPreviewOpen}
        onClose={closePreview}
        title="Board Preview"
        centered
        size="xl"
        removeScrollProps={{ allowPinchZoom: true }}
        styles={{
          content: {
            height: "75vh",
            maxHeight: "700px",
            display: "flex",
            flexDirection: "column",
          },
          body: { flex: 1, display: "flex", flexDirection: "column" },
        }}>
        {previewData && (
          <BoardPreview
            grid1Items={previewData.grid1}
            grid2Items={previewData.grid2}
            grid3Items={previewData.grid3}
            boardSize={previewData.boardSize}
            justify1={previewData.justify1}
            justify2={previewData.justify2}
            justify3={previewData.justify3}
          />
        )}
      </Modal>
    </DndContext>
  );
}
