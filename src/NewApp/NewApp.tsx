import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  useDroppable,
  type DragStartEvent,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
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
  Popover,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState as useReactState, useRef, useEffect } from "react";
import { boardSizes } from "./data/boards";
import type { BoardType } from "./types/types";
import { ItemPicker } from "./ItemPicker";
import { toKebabId, type IconRegistryEntry } from "./data/iconRegistry";
import { ItemIcon } from "./ItemIcon";
import { BoardPreview } from "./BoardPreview";
import type { JustifyValue } from "./GridDroppable";

export function NewApp() {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const cards = Object.values(boardSizes).map((item) => (
    <Radio.Card
      className="p-2! sm:px-3! max-w-2xs h-40! min-w-52"
      radius="md"
      value={item.name}
      key={item.name}>
      <Group wrap="nowrap" align="flex-start" className="h-full">
        <Radio.Indicator className="self-center" />
        <div className="min-w-0 flex flex-col gap-3">
          <Text className="text-xs sm:text-sm md:text-base font-bold!">
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
  const [previewOpened, { open: openPreview, close: closePreview }] =
    useDisclosure(false);
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(true);

  const [grid1Items, setGrid1Items] = useState<GridItemData[]>([]);
  const [grid2Items, setGrid2Items] = useState<GridItemData[]>([]);
  const [grid3Items, setGrid3Items] = useState<GridItemData[]>([]);
  const [activeItem, setActiveItem] = useState<GridItemData | null>(null);
  const itemCounterRef = useRef(0);

  const [justify1, setJustify1] = useState<JustifyValue>("start");
  const [justify2, setJustify2] = useState<JustifyValue>("start");
  const [justify3, setJustify3] = useState<JustifyValue>("start");

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
      <div
        id="main-container"
        className="flex flex-col w-full max-w-full p-3 sm:p-4 md:p-6 overflow-x-hidden">
        <div id="title-and-grid" className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 relative">
            <h2 className="text-2xl font-bold">Groove Board</h2>
            <Button
              className="fixed! top-9 right-9 z-100"
              variant={drawerOpened ? "" : "gradient"}
              size="sm"
              onClick={toggleDrawer}>
              {drawerOpened ? "Hide Panel" : "Add Pieces"}
            </Button>
          </div>
          <div className="flex flex-col items-center gap-2 pt-6">
            <Text size="lg" fw={600}>
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
                    label={`${board.label} — ${board.price}`}
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="32"
                          height="22"
                          viewBox="0 0 32 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          {board.size === "small" && (
                            <>
                              <rect
                                x="8"
                                y="3"
                                width="16"
                                height="14"
                                rx="1.5"
                              />
                              <line x1="11" y1="7" x2="21" y2="7" />
                              <line x1="11" y1="10" x2="21" y2="10" />
                              <line x1="11" y1="13" x2="21" y2="13" />
                            </>
                          )}
                          {board.size === "medium" && (
                            <>
                              <rect
                                x="5"
                                y="2"
                                width="22"
                                height="16"
                                rx="1.5"
                              />
                              <line x1="8" y1="6.5" x2="24" y2="6.5" />
                              <line x1="8" y1="10" x2="24" y2="10" />
                              <line x1="8" y1="13.5" x2="24" y2="13.5" />
                            </>
                          )}
                          {board.size === "large" && (
                            <>
                              <rect
                                x="2"
                                y="1"
                                width="28"
                                height="18"
                                rx="1.5"
                              />
                              <line x1="5" y1="6" x2="27" y2="6" />
                              <line x1="5" y1="10" x2="27" y2="10" />
                              <line x1="5" y1="14" x2="27" y2="14" />
                            </>
                          )}
                        </svg>
                      </Button>
                      <span className="text-md font-semibold mt-1 h-3.5">
                        {isActive ? board.name : ""}
                      </span>
                    </div>
                  </Tooltip>
                );
              })}
            </div>

            <div className="flex flex-col items-center gap-1 pt-4">
              <span className="text-lg">{activeBoardSize.description}</span>
              <span>{activeBoardSize.price}</span>
            </div>
          </div>

          <div id="grid-container" className="flex flex-col gap-4">
            <GridDroppable
              id="grid-1"
              title="Back Row"
              items={grid1Items}
              maxWidth={activeBoardSize.grooveWidth}
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
              maxWidth={activeBoardSize.grooveWidth}
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
              maxWidth={activeBoardSize.grooveWidth}
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

          <div className="flex flex-col items-center pt-8 gap-4">
            <Button variant="gradient" onClick={generatePreview}>
              Generate Preview
            </Button>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem ? activeItem.icon : null}
      </DragOverlay>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        // title="Add Pieces and Select Your Board Size!"
        title={
          <div className="flex items-center justify-between w-full">
            {/* <h2>Add Pieces</h2> */}
            <Button
              variant="gradient"
              onClick={open}
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
            {/* <Button
              variant="default"
              onClick={open}
              className="w-full sm:w-auto">
              Browse Pieces
            </Button> */}
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
          {/* <div className="flex flex-1">
            <Select
              height={80}
              label="Choose your board size"
              description="Select between our small, medium, and large boards to fit your project needs!"
              value={activeBoardSize.name}
              onChange={(name) => {
                const selected = boardSizes.find((b) => b.name === name);
                if (selected) setActiveBoardSize(selected);
              }}
              data={boardSizes.map((b) => {
                const maxRowWidth = Math.max(
                  grid1Items.reduce((sum, i) => sum + i.width, 0),
                  grid2Items.reduce((sum, i) => sum + i.width, 0),
                  grid3Items.reduce((sum, i) => sum + i.width, 0),
                );
                const tooSmall = b.grooveWidth < maxRowWidth;
                return {
                  value: b.name,
                  label: `${b.name} - ${b.description} - ${b.price}`,
                  disabled: tooSmall,
                };
              })}
              classNames={{
                label: "text-sm md:text-base",
                description: "text-xs md:text-sm",
              }}
            />
          </div> */}
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
      <Modal
        id="preview-modal"
        opened={previewOpened}
        onClose={closePreview}
        title="Board Preview"
        centered
        size="xl"
        styles={{
          content: {
            height: "calc(100vh - 2rem)",
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
  const [popoverOpened, setPopoverOpened] = useReactState(false);
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

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const gridsWithSpace = availableGrids.filter((g) => g.hasSpace);

  return (
    <Popover
      opened={popoverOpened}
      onChange={setPopoverOpened}
      position="top"
      withArrow
      shadow="md">
      <Popover.Target>
        <div>
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
                  useDragHandle={false}
                />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
              {/* <Menu.Label>Add to row</Menu.Label> */}
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
                    Add to {grid.title}
                  </Menu.Item>
                ))
              )}
              <Menu.Divider />
              <Menu.Item
                onClick={() => {
                  setMenuOpened(false);
                  setPopoverOpened((o) => !o);
                }}>
                View Item Details
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                classNames={{ itemLabel: "text-center" }}
                color="red"
                onClick={() => {
                  onRemove(item.id);
                  setMenuOpened(false);
                }}>
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <Text fw={600} size="sm">
          {item.text}
        </Text>
        <Text size="xs" c="dimmed">
          Width: {item.width}mm
        </Text>
        <Text size="xs" c="dimmed">
          ID: {item.id}
        </Text>
      </Popover.Dropdown>
    </Popover>
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
