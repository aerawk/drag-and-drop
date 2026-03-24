import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGridItem } from "./SortableGridItem";
import type { GridItemData } from "./GridItem";
import { useViewportSize } from "@mantine/hooks";
import { getScaledWidth } from "./ItemIcon";
import { useState } from "react";
import { Button, Menu, Tooltip } from "@mantine/core";
import type { BoardType } from "./types/types";

export type JustifyValue =
  | "start"
  | "center"
  | "end"
  | "space-evenly"
  | "space-between";

const AlignOptions: {
  value: JustifyValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "start",
    label: "Align items to the left",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 20 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round">
        <line x1="1" y1="12" x2="19" y2="12" />
        <circle cx="2" cy="7" r="1.5" stroke="none" />
        <circle cx="6" cy="7" r="1.5" stroke="none" />
      </svg>
    ),
  },

  {
    value: "space-evenly",
    label: "Space items evenly",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 20 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round">
        <line x1="1" y1="12" x2="19" y2="12" />
        <circle cx="6" cy="7" r="1.5" stroke="none" />
        <circle cx="14" cy="7" r="1.5" stroke="none" />
      </svg>
    ),
  },
  {
    value: "center",
    label: "Center items",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 20 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round">
        <line x1="1" y1="12" x2="19" y2="12" />
        <circle cx="8" cy="7" r="1.5" stroke="none" />
        <circle cx="12" cy="7" r="1.5" stroke="none" />
      </svg>
    ),
  },
  {
    value: "space-between",
    label: "Space items apart",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 20 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round">
        <line x1="1" y1="12" x2="19" y2="12" />
        <circle cx="2" cy="7" r="1.5" stroke="none" />
        <circle cx="18" cy="7" r="1.5" stroke="none" />
      </svg>
    ),
  },
  {
    value: "end",
    label: "Align items to the right",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 20 16"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round">
        <line x1="1" y1="12" x2="19" y2="12" />
        <circle cx="14" cy="7" r="1.5" stroke="none" />
        <circle cx="18" cy="7" r="1.5" stroke="none" />
      </svg>
    ),
  },
];

interface TargetGrid {
  id: string;
  title: string;
  remainingWidth: number;
}

interface GridDroppableProps {
  id: string;
  title: string;
  items: GridItemData[];
  activeBoardSize: BoardType;
  onMoveItem: (
    itemId: string,
    direction: "left" | "right" | "start" | "end",
  ) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveToRow: (itemId: string, targetGridId: string) => void;
  otherGrids: TargetGrid[];
  isDragging?: boolean;
  justifyItems: JustifyValue;
  onJustifyChange: (value: JustifyValue) => void;
}

export function GridDroppable({
  id,
  title,
  items,
  activeBoardSize,
  onMoveItem,
  onRemoveItem,
  onMoveToRow,
  otherGrids,
  isDragging: isDraggingGlobal = false,
  justifyItems,
  onJustifyChange,
}: GridDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const { width: viewportWidth } = useViewportSize();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when drag starts
  if (isDraggingGlobal && openMenuId !== null) {
    setOpenMenuId(null);
  }

  const closeAndDo = (fn: () => void) => {
    setOpenMenuId(null);
    // Defer the action so the menu state clears before the re-render from the action
    requestAnimationFrame(() => fn());
  };

  const maxWidth = activeBoardSize.grooveWidth;
  const usedWidth = items.reduce((sum, item) => sum + item.width, 0);
  const remainingWidth = maxWidth - usedWidth;

  const style = {
    backgroundColor: isOver ? "#ae8856ea" : "#ae8856",
    borderColor: isOver ? "##997547" : "#ae8856",
    width: `${getScaledWidth(maxWidth, viewportWidth)}px`,
    boxShadow: "12px 0px #ae8856,  -12px 0px #ae8856",
    filter: `drop-shadow(1px -${getScaledWidth(1.5, viewportWidth)}px 0px #7c603c)`,
    height: `${getScaledWidth(12, viewportWidth)}px`,
  };

  const dropAreaStyle = {
    backgroundColor: isOver ? "#4a4a4aa2" : "transparent",
    borderColor: isOver ? "##997547" : "transparent",
    padding: "0 60px",
    height: "100%",
    minHeight: "100px",
    bottom: "-8px",
    width: `${getScaledWidth(maxWidth, viewportWidth) + 120}px`,
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 w-full relative items-center">
      <div
        ref={setNodeRef}
        style={dropAreaStyle}
        className="transition-colors relative flex h-full">
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={rectSortingStrategy}>
          <div
            className="flex flex-wrap gap-0 items-end relative"
            style={{
              width: "100%",
              justifyContent: justifyItems,
            }}>
            {items.map((item, index) => (
              <Menu
                key={item.id}
                position="bottom"
                withArrow
                shadow="md"
                opened={openMenuId === item.id}
                onChange={(opened) => setOpenMenuId(opened ? item.id : null)}>
                <Menu.Target>
                  <div
                    className="mx-0.5 relative w-fit cursor-pointer"
                    style={{
                      width: `${Math.round(getScaledWidth(item.width, viewportWidth))}px`,
                    }}>
                    <SortableGridItem {...item} />
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    disabled={index === 0}
                    onClick={() =>
                      closeAndDo(() => onMoveItem(item.id, "start"))
                    }
                    leftSection={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M11 17l-5-5 5-5" />
                        <path d="M18 17l-5-5 5-5" />
                      </svg>
                    }>
                    Move to Start
                  </Menu.Item>
                  <Menu.Item
                    disabled={index === 0}
                    onClick={() =>
                      closeAndDo(() => onMoveItem(item.id, "left"))
                    }
                    leftSection={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    }>
                    Move Left
                  </Menu.Item>
                  <Menu.Item
                    disabled={index === items.length - 1}
                    onClick={() =>
                      closeAndDo(() => onMoveItem(item.id, "right"))
                    }
                    leftSection={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    }>
                    Move Right
                  </Menu.Item>
                  <Menu.Item
                    disabled={index === items.length - 1}
                    onClick={() => closeAndDo(() => onMoveItem(item.id, "end"))}
                    leftSection={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M6 17l5-5-5-5" />
                        <path d="M13 17l5-5-5-5" />
                      </svg>
                    }>
                    Move to End
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Label>Move to row</Menu.Label>
                  {otherGrids.map((grid) => {
                    const hasSpace = item.width <= grid.remainingWidth;
                    return (
                      <Menu.Item
                        key={grid.id}
                        disabled={!hasSpace}
                        onClick={() =>
                          closeAndDo(() => onMoveToRow(item.id, grid.id))
                        }>
                        {grid.title}
                      </Menu.Item>
                    );
                  })}
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    classNames={{ itemLabel: "text-center" }}
                    onClick={() => closeAndDo(() => onRemoveItem(item.id))}>
                    Remove
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            ))}
          </div>
        </SortableContext>
      </div>
      <div
        style={style}
        className={`
        rounded-xs sm:rounded-sm transition-colors overflow-x-auto overflow-y-visible z-50`}></div>
      <h3 className="font-bold text-base md:text-lg">{title}</h3>
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
      <span className="text-xs sm:text-sm text-gray-300">Item Layout:</span>
      <div className="flex items-center gap-1">
        {AlignOptions.map((opt) => (
          <Tooltip
            label={opt.label}
            key={opt.value}
            position="bottom"
            withArrow>
            <Button
              key={opt.value}
              type="button"
              onClick={() => onJustifyChange(opt.value)}
              className="p-0 rounded transition-colors"
              style={{
                backgroundColor:
                  justifyItems === opt.value ? "#ffffff30" : "transparent",
                color: justifyItems === opt.value ? "#fff" : "#9ca3af",
              }}>
              {opt.icon}
            </Button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
