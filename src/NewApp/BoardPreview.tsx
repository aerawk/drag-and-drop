import { useRef, useState, useEffect } from "react";
import type { GridItemData } from "./GridItem";
import type { BoardType } from "./types/types";
import type { JustifyValue } from "./GridDroppable";
import { getScaledWidth } from "./ItemIcon";
import { useViewportSize } from "@mantine/hooks";

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
const ROW_OFFSET_MM = 4;
const ROW_Z_SPACING_MM = 25;
const BOARD_Z_DEPTH_MM = 100;
const GROOVE_THICKNESS_MM = 3;

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
  const { width: viewportWidth } = useViewportSize();
  const [rotation, setRotation] = useState({ x: -15, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startRotX: number;
    startRotY: number;
  } | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRotX: rotation.x,
      startRotY: rotation.y,
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setRotation({
      x: Math.max(-25, Math.min(15, dragRef.current.startRotX - dy * 0.3)),
      y: Math.max(-45, Math.min(45, dragRef.current.startRotY + dx * 0.3)),
    });
  }

  function handlePointerUp() {
    dragRef.current = null;
    setIsDragging(false);
    setRotation({ x: -15, y: 0 });
  }

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
  const rowZSpacingPx = ROW_Z_SPACING_MM * pxPerMm;
  const boardZDepthPx = BOARD_Z_DEPTH_MM * pxPerMm;
  const grooveThicknessPx = GROOVE_THICKNESS_MM * pxPerMm;
  const boardStripOffsetPx = 4 * pxPerMm;

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
      className="w-full sm:w-3/4 max-w-2xl mx-auto flex-1 flex flex-col p-6">
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
            <>
              <div
                style={{ perspective: "900px", perspectiveOrigin: "50% 60%" }}>
                <div
                  style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: "preserve-3d",
                    transition: isDragging
                      ? undefined
                      : "transform 0.5s ease-out",
                  }}>
                  <div
                    className="relative"
                    style={{ width: "100%", transformStyle: "preserve-3d" }}>
                    {/* Thin board strip */}
                    <div
                      style={{
                        position: "relative",
                        height: boardDepthPx,
                        borderRadius: 2,
                        top: -boardStripOffsetPx,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        height: boardDepthPx,
                        width: "100%",
                        backgroundColor: "#9b784b",
                        borderRadius: 2,
                        top: -boardStripOffsetPx,
                        zIndex: 100,
                      }}
                    />

                    {/* Board top face */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: boardZDepthPx,
                        backgroundColor: "#ae8856",
                        top: -boardStripOffsetPx,
                        transformOrigin: "top center",
                        transform: "rotateX(-90deg)",
                        zIndex: 99,
                      }}>
                      {rows.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            width: grooveWidthPx,
                            height: grooveThicknessPx,
                            backgroundColor: "#9b784b",
                            top:
                              (3 - i) * rowZSpacingPx - grooveThicknessPx / 2,
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        />
                      ))}
                    </div>

                    {/* Board bottom face */}
                    <div
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: boardZDepthPx,
                        backgroundColor: "#82643e",
                        top: boardDepthPx - boardZDepthPx - boardStripOffsetPx,
                        transformOrigin: "bottom center",
                        transform: "rotateX(90deg)",
                        zIndex: 99,
                      }}
                    />

                    {/* Board left side face */}
                    <div
                      style={{
                        position: "absolute",
                        width: boardZDepthPx,
                        height: boardDepthPx,
                        backgroundColor: "#ae8856",
                        top: -boardStripOffsetPx,
                        left: 0,
                        transformOrigin: "left center",
                        transform: "rotateY(90deg)",
                        zIndex: 99,
                      }}
                    />

                    {/* Board right side face */}
                    <div
                      style={{
                        position: "absolute",
                        width: boardZDepthPx,
                        height: boardDepthPx,
                        backgroundColor: "#ae8856",
                        top: -boardStripOffsetPx,
                        right: 0,
                        transformOrigin: "right center",
                        transform: "rotateY(-90deg)",
                        zIndex: 99,
                      }}
                    />

                    {/* Item rows — all absolute, anchored above the board strip */}
                    {rows.map((row, i) => {
                      const scale = i === 0 ? 0.96 : i === 1 ? 0.98 : 1;
                      const bottomOffset =
                        boardDepthPx + (2 - (i + 1) * 0.5) * rowOffsetPx;
                      return (
                        <div
                          key={row.label}
                          style={{
                            position: "absolute",
                            bottom: bottomOffset,
                            left: "50%",
                            transform: `translateX(-50%) translateZ(${(i - 3) * rowZSpacingPx}px) scale(${scale})`,
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
                                filter: `drop-shadow(1px -${getScaledWidth(1.5, viewportWidth)}px 0px #7c603c) drop-shadow(0px -${2 + (2 - i)}px ${4 + (2 - i)}px rgba(0,0,0,${0.4 + (2 - i) * 0.06})) saturate(0.95) sepia(0.1)`,
                              }}
                            />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  margin: "16px auto 0",
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "dodgerblue",
                  opacity: isDragging ? ".9" : "1",
                  cursor: isDragging ? "grabbing" : "grab",
                  userSelect: "none",
                  touchAction: "none",
                  color: "white",
                  width: "fit-content",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M12 3C7.03 3 3 7.03 3 12" />
                  <path d="M3 12v-3h3" />
                  <path d="M12 21c4.97 0 9-4.03 9-9" />
                  <path d="M21 12v3h-3" />
                </svg>
                <span style={{ fontSize: 12 }}>Drag to Rotate View</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
