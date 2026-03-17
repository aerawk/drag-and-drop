import type { BoardType } from "../types/types";

export const boardSizes: BoardType[] = [
  {
    size: "small",
    boardWidth: 254,
    grooveWidth: 224,
    name: "Small",
    label: "Small (10 inch)",
    description: "Our small board, great for small shelves and spaces!",
    price: "$19.99",
    isInStock: true,
  },
  {
    size: "medium",
    boardWidth: 355,
    grooveWidth: 325,
    name: "Medium",
    label: "Medium (14 inch)",
    description: "Our original groove board, perfect for most uses!",
    price: "$29.99",
    isInStock: true,
  },
  {
    size: "large",
    boardWidth: 457,
    grooveWidth: 427,
    name: "Large",
    label: "Large (18 inch)",
    description: "Our biggest board, great for maximum customization and fun!",
    price: "$39.99",
    isInStock: true,
  },
  // {
  //   size: "x-large",
  //   boardWidth: 600,
  //   grooveWidth: 540,
  //   name: "X-Large",
  //   label: "X-Large (24 inch)",
  //   description: "An extra large board for the biggest projects.",
  //   price: "$49.99",
  //   isInStock: true,
  // },
];
