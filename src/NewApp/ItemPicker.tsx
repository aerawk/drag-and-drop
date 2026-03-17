import { useState } from "react";
import { Button, Tooltip } from "@mantine/core";
import { iconEntries, type IconRegistryEntry } from "./data/iconRegistry";

interface ItemPickerProps {
  onAddItems: (selectedEntries: IconRegistryEntry[]) => void;
}

export const ItemPicker = ({ onAddItems }: ItemPickerProps) => {
  const [selectedQuantities, setSelectedQuantities] = useState<
    Map<number, number>
  >(new Map());

  const toggleItem = (index: number) => {
    setSelectedQuantities((prev) => {
      const next = new Map(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.set(index, 1);
      }
      return next;
    });
  };

  const increment = (index: number) => {
    setSelectedQuantities((prev) => {
      const next = new Map(prev);
      next.set(index, (next.get(index) ?? 0) + 1);
      return next;
    });
  };

  const decrement = (index: number) => {
    setSelectedQuantities((prev) => {
      const next = new Map(prev);
      const current = next.get(index) ?? 0;
      if (current <= 1) {
        next.delete(index);
      } else {
        next.set(index, current - 1);
      }
      return next;
    });
  };

  const totalCount = Array.from(selectedQuantities.values()).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const handleAdd = () => {
    const selected = Array.from(selectedQuantities.entries()).flatMap(
      ([index, qty]) => Array<IconRegistryEntry>(qty).fill(iconEntries[index]),
    );
    onAddItems(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto p-1">
        {iconEntries.map((entry, index) => {
          const qty = selectedQuantities.get(index);
          const isSelected = qty !== undefined;
          return (
            <Tooltip
              key={index}
              label={`${entry.name}, ${entry.width}mm`}
              position="top"
              withArrow>
              <div
                onClick={() => toggleItem(index)}
                className={`relative flex flex-col items-center justify-center p-2 rounded cursor-pointer border-2 transition-colors ${
                  isSelected
                    ? "border-purple-500"
                    : "border-transparent hover:border-gray-300"
                }`}>
                <img
                  src={entry.svgSrc}
                  alt={entry.name}
                  className="w-16 h-16 object-contain"
                />
                <span className="text-xs text-center mt-1 truncate w-full">
                  {entry.name}
                </span>
                {isSelected && (
                  <div
                    className="flex items-center gap-1 mt-1"
                    onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => decrement(index)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-white text-xs leading-none hover:bg-purple-600">
                      -
                    </button>
                    <span className="text-xs font-semibold min-w-4 text-center">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => increment(index)}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500 text-white text-xs leading-none hover:bg-purple-600">
                      +
                    </button>
                  </div>
                )}
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <Button disabled={selectedQuantities.size === 0} onClick={handleAdd}>
          {totalCount > 0 ? `Add (${totalCount})` : "Add"}
        </Button>
      </div>
    </div>
  );
};
