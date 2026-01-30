export type BoardType = {
  size: BoardSizeKey;
  boardWidth: number;
  grooveWidth: number;
  name: string;
  label: string;
  description: string;
  price: string;
  isInStock: boolean;
};

export type BoardSizeKey = "small" | "medium" | "large" | "x-large";
