import type { BoardSizeKey } from "../types/types";

export function BoardSizeIcon({ size }: { size: BoardSizeKey }) {
  return (
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
      {size === "small" && (
        <>
          <rect x="8" y="3" width="16" height="14" rx="1.5" />
          <line x1="11" y1="7" x2="21" y2="7" />
          <line x1="11" y1="10" x2="21" y2="10" />
          <line x1="11" y1="13" x2="21" y2="13" />
        </>
      )}
      {size === "medium" && (
        <>
          <rect x="5" y="2" width="22" height="16" rx="1.5" />
          <line x1="8" y1="6.5" x2="24" y2="6.5" />
          <line x1="8" y1="10" x2="24" y2="10" />
          <line x1="8" y1="13.5" x2="24" y2="13.5" />
        </>
      )}
      {size === "large" && (
        <>
          <rect x="2" y="1" width="28" height="18" rx="1.5" />
          <line x1="5" y1="6" x2="27" y2="6" />
          <line x1="5" y1="10" x2="27" y2="10" />
          <line x1="5" y1="14" x2="27" y2="14" />
        </>
      )}
    </svg>
  );
}
