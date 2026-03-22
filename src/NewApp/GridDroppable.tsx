import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableGridItem } from "./SortableGridItem";
import type { GridItemData } from "./GridItem";
import { useViewportSize } from "@mantine/hooks";
import { getScaledWidth } from "./ItemIcon";
import { useState } from "react";
import { Menu } from "@mantine/core";

interface TargetGrid {
  id: string;
  title: string;
  remainingWidth: number;
}

interface GridDroppableProps {
  id: string;
  title: string;
  items: GridItemData[];
  maxWidth: number;
  onMoveItem: (
    itemId: string,
    direction: "left" | "right" | "start" | "end",
  ) => void;
  onRemoveItem: (itemId: string) => void;
  onMoveToRow: (itemId: string, targetGridId: string) => void;
  otherGrids: TargetGrid[];
  isDragging?: boolean;
}

export function GridDroppable({
  id,
  title,
  items,
  maxWidth,
  onMoveItem,
  onRemoveItem,
  onMoveToRow,
  otherGrids,
  isDragging: isDraggingGlobal = false,
}: GridDroppableProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });
  const { width: viewportWidth } = useViewportSize();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [justifyItems, setJustifyItems] = useState<
    "start" | "center" | "end" | "space-evenly" | "space-between"
  >("start");

  // Close menu when drag starts
  if (isDraggingGlobal && openMenuId !== null) {
    setOpenMenuId(null);
  }

  const closeAndDo = (fn: () => void) => {
    setOpenMenuId(null);
    // Defer the action so the menu state clears before the re-render from the action
    requestAnimationFrame(() => fn());
  };

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
    padding: "0 60px",
    height: "100%",
    minHeight: "100px",
    bottom: "-8px",
    width: `${getScaledWidth(maxWidth, viewportWidth) + 120}px`,
  };

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 w-full relative items-center">
      {/* <h3 className="font-bold text-base md:text-lg">{title}</h3> */}
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
                    onClick={() => closeAndDo(() => onMoveItem(item.id, "start"))}
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
                    onClick={() => closeAndDo(() => onMoveItem(item.id, "left"))}
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
                    onClick={() => closeAndDo(() => onMoveItem(item.id, "right"))}
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
                        onClick={() => closeAndDo(() => onMoveToRow(item.id, grid.id))}>
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
        className={`border-2 border-dashed border-t-0 rounded-sm sm:rounded-md md:rounded-lg p-2 sm:p-3 md:p-4 h-4 sm:h-6 md:h-8 transition-colors overflow-x-auto overflow-y-visible z-50`}></div>
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
      <Menu position="bottom" withArrow>
        <Menu.Target>
          <span
            id="adjust-layout"
            className="text-xs sm:text-sm text-gray-300 cursor-pointer flex items-center gap-1">
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
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Adjust Layout
          </span>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Justify items</Menu.Label>
          <Menu.Item onClick={() => setJustifyItems("start")}>Left</Menu.Item>
          <Menu.Item onClick={() => setJustifyItems("center")}>
            Center
          </Menu.Item>
          <Menu.Item onClick={() => setJustifyItems("end")}>Right</Menu.Item>
          <Menu.Item onClick={() => setJustifyItems("space-evenly")}>
            Space Evenly
          </Menu.Item>
          <Menu.Item onClick={() => setJustifyItems("space-between")}>
            Space Between
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
