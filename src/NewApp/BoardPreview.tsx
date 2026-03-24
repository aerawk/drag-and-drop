import { useRef, useState, useEffect } from "react";
import type { GridItemData } from "./GridItem";
import type { BoardType } from "./types/types";
import type { JustifyValue } from "./GridDroppable";

interface BoardPreviewProps {
  grid1Items: GridItemData[];
  grid2Items: GridItemData[];
  grid3Items: GridItemData[];
  boardSize: BoardType;
  justify1: JustifyValue;
  justify2: JustifyValue;
  justify3: JustifyValue;
}

const BOARD_DEPTH_MM = 16;
const ROW_OFFSET_MM = 5;

export function BoardPreview({
  grid1Items,
  grid2Items,
  grid3Items,
  boardSize,
  justify1,
  justify2,
  justify3,
}: BoardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const pxPerMm =
    containerWidth > 0 ? containerWidth / boardSize.boardWidth : 1;
  const grooveWidthPx = boardSize.grooveWidth * pxPerMm;
  const boardDepthPx = BOARD_DEPTH_MM * pxPerMm;
  const rowOffsetPx = ROW_OFFSET_MM * pxPerMm;

  // Back row (index 0) is furthest back, front row (index 2) is closest
  const rows = [
    { items: grid1Items, justify: justify1, label: "Back" },
    { items: grid2Items, justify: justify2, label: "Middle" },
    { items: grid3Items, justify: justify3, label: "Front" },
  ];

  const isEmpty =
    grid1Items.length === 0 &&
    grid2Items.length === 0 &&
    grid3Items.length === 0;

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
      {containerWidth > 0 && (
        <div
          className="relative mx-auto flex-1 flex flex-col justify-end"
          style={{
            width: boardSize.boardWidth * pxPerMm,
          }}>
          {isEmpty ? (
            <p className="text-center text-sm text-white/60 py-8">
              Add items to your rows to see a preview.
            </p>
          ) : (
            <div className="relative" style={{ width: "100%" }}>
              {/* Thin board strip */}
              <div
                style={{
                  position: "relative",
                  height: boardDepthPx,
                  backgroundColor: "#ae8856",
                  filter: "drop-shadow(2px -6px 1px #7c603c)",
                  borderRadius: 2,
                  top: "2px",
                }}
              />

              {/* Item rows — all absolute, anchored above the board strip */}
              {rows.map((row, i) => {
                const scale = i === 0 ? 0.96 : i === 1 ? 0.98 : 1;
                const bottomOffset = boardDepthPx + (2 - i) * rowOffsetPx;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      bottom: bottomOffset,
                      left: "50%",
                      transform: `translateX(-50%) scale(${scale})`,
                      transformOrigin: "center bottom",
                      zIndex: i + 1,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: row.justify,
                      width: grooveWidthPx,
                    }}>
                    {row.items.map((item) => (
                      <img
                        key={item.id}
                        src={item.svgSrc}
                        alt={item.text}
                        style={{
                          width: item.width * pxPerMm,
                          height: "auto",
                          minHeight: " 20px",
                          display: "block",
                          filter: `drop-shadow(1px -3px 0px #7c603c) drop-shadow(0px -${2 + (2 - i)}px ${4 + (2 - i)}px rgba(0,0,0,${0.4 + (2 - i) * 0.06})) saturate(0.95) sepia(0.1)`,
                        }}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
