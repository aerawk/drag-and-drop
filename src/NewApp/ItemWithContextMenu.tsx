import { Menu, Popover, Text } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { GridItem, type GridItemData } from "./GridItem";

export function ItemWithContextMenu({
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
  const [menuOpened, setMenuOpened] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
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
                <GridItem {...item} svgSrc={item.svgSrc} key={item.id} />
              </div>
            </Menu.Target>
            <Menu.Dropdown>
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
