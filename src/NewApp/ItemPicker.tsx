import { useState } from "react";

export const ItemPicker = () => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const handleItemClick = (itemIndex: number) => {
    if (!selectedItems.includes(itemIndex)) {
      setSelectedItems([...selectedItems, itemIndex]);
    } else {
      setSelectedItems(selectedItems.filter((index) => index !== itemIndex));
    }
  };

  const isItemSelected = (itemIndex: number) => {
    return selectedItems.includes(itemIndex);
  };
  return (
    <div className="p-4">
      <div className="grid grid-cols-8 gap-2">
        {Array(50)
          .fill(null)
          .map((_, index) => (
            <div
              onClick={() => handleItemClick(index + 1)}
              className="w-16 h-16 flex items-center justify-center rounded"
              style={{
                backgroundColor: isItemSelected(index + 1)
                  ? "mediumpurple"
                  : "rebeccapurple",
              }}
              key={index}>
              {index + 1}
            </div>
          ))}
      </div>
      <span className="mt-4 block">
        Selected Items: {selectedItems.join(", ")}
      </span>
    </div>
  );
};
