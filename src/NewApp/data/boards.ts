import type { BoardType } from "../types/types";

export const boardSizes: BoardType[] = [
  {
    size: "small",
    boardWidth: 254,
    grooveWidth: 224,
    name: "Small",
    label: "Small (10 inch)",
    description: "The little one. Short on space, big on grooves.",
    price: "$19.99",
    isInStock: true,
  },
  {
    size: "medium",
    boardWidth: 355,
    grooveWidth: 325,
    name: "Medium",
    label: "Medium (14 inch)",
    description: "The original one. Perfect for most uses!",
    price: "$29.99",
    isInStock: true,
  },
  {
    size: "large",
    boardWidth: 457,
    grooveWidth: 427,
    name: "Large",
    label: "Large (18 inch)",
    description: "The big one. So much room for activities!",
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
