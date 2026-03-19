import { useViewportSize } from "@mantine/hooks";
import { Tooltip } from "@mantine/core";

export function getScaledWidth(width: number, viewportWidth: number) {
  if (viewportWidth < 400) {
    return width * 0.65;
  } else if (viewportWidth < 500) {
    return width * 0.75;
  } else if (viewportWidth < 640) {
    return width * 1;
  } else if (viewportWidth < 768) {
    return width * 1.25;
  } else if (viewportWidth < 1024) {
    return width * 1.5;
  } else {
    return width * 2;
  }
}
export function ItemIcon({
  src,
  alt,
  width,
}: {
  src: string;
  alt: string;
  width: number;
}) {
  const { width: viewportWidth } = useViewportSize();

  return (
    <Tooltip label={`${alt}, ${width}`} position="top" withArrow>
      <div
        style={{
          width: getScaledWidth(width, viewportWidth),
          padding: "0 2px",
        }}>
        <img src={src} alt={alt} width="100%" />
      </div>
    </Tooltip>
  );
}
