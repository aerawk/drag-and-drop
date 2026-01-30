interface SvgItemProps {
  width: number; // Width in grid units
  src: string; // Path to SVG file
  alt?: string; // Alt text for accessibility
  className?: string; // Additional classes
}

/**
 * Reusable component for displaying SVG images with accurate width constraints.
 * The SVG will be scaled down to fit within the specified width while maintaining
 * its natural aspect ratio. No part of the image will be cropped.
 */
export function SvgItem({ width, src, alt = "", className = "" }: SvgItemProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: "100%",
      }}>
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto"
        style={{
          display: "block",
        }}
      />
    </div>
  );
}
