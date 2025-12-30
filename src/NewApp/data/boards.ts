import type { BoardType } from "../types/types";

export const boardSizes: BoardType[] = [
  {
    size: "small",
    boardWidth: 254,
    grooveWidth: 224,
    name: "Small",
    label: "Small (10 inch)",
    description: "Our smallest board, suitable for small spaces.",
    price: "$19.99",
    isInStock: true,
  },
  {
    size: "medium",
    boardWidth: 355,
    grooveWidth: 325,
    name: "Medium",
    label: "Medium (14 inch)",
    description: "A medium-sized board, perfect for most uses.",
    price: "$29.99",
    isInStock: true,
  },
  {
    size: "large",
    boardWidth: 457,
    grooveWidth: 427,
    name: "Large",
    label: "Large (18 inch)",
    description: "A large board for bigger projects.",
    price: "$39.99",
    isInStock: true,
  },
];
