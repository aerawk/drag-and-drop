import { useState } from "react";
import { Button, Tooltip } from "@mantine/core";
import { iconEntries, type IconRegistryEntry } from "./data/iconRegistry";

interface ItemPickerProps {
  onAddItems: (selectedEntries: IconRegistryEntry[]) => void;
}

export const ItemPicker = ({ onAddItems }: ItemPickerProps) => {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(
    new Set(),
  );

  const toggleItem = (index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAdd = () => {
    const selected = Array.from(selectedIndices).map((i) => iconEntries[i]);
    onAddItems(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[60vh] overflow-y-auto p-1">
        {iconEntries.map((entry, index) => (
          <Tooltip
            key={index}
            label={`${entry.name}, ${entry.width}mm`}
            position="top"
            withArrow>
            <div
              onClick={() => toggleItem(index)}
              className={`flex flex-col items-center justify-center p-2 rounded cursor-pointer border-2 transition-colors ${
                selectedIndices.has(index)
                  ? "border-purple-500 bg-purple-100"
                  : "border-transparent hover:border-gray-300"
              }`}>
              <img
                src={entry.svgSrc}
                alt={entry.name}
                className="w-12 h-12 object-contain"
              />
              <span className="text-xs text-center mt-1 truncate w-full">
                {entry.name}
              </span>
            </div>
          </Tooltip>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button disabled={selectedIndices.size === 0} onClick={handleAdd}>
          {selectedIndices.size > 0 ? `Add (${selectedIndices.size})` : "Add"}
        </Button>
      </div>
    </div>
  );
};
