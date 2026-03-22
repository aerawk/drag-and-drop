import { useState } from "react";
import { Button, TextInput, Tooltip } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { iconEntries, type IconRegistryEntry } from "./data/iconRegistry";

interface ItemPickerProps {
  onAddItems: (selectedEntries: IconRegistryEntry[]) => void;
}

export const ItemPicker = ({ onAddItems }: ItemPickerProps) => {
  const [filter, setFilter] = useState("");
  const [debouncedFilter] = useDebouncedValue(filter, 200);
  const [selectedQuantities, setSelectedQuantities] = useState<
    Map<number, number>
  >(new Map());

  const filteredEntries = iconEntries
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) =>
      entry.name.toLowerCase().includes(debouncedFilter.toLowerCase()),
    );

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
      <TextInput
        placeholder="Filter icons..."
        value={filter}
        onChange={(e) => setFilter(e.currentTarget.value)}
        className="mb-2"
      />
      <div className="grid grid-cols-4 grid-rows-[max-content] gap-2 h-[50vh] overflow-y-auto p-1">
        {filteredEntries.length === 0 ? (
          <div className="col-span-4 row-span-4 flex items-center justify-center text-lg font-semibold">
            No items found
          </div>
        ) : (
          filteredEntries.map(({ entry, index }) => {
            const qty = selectedQuantities.get(index);
            const isSelected = qty !== undefined;
            return (
              <Tooltip
                key={index}
                label={`${entry.name}, ${entry.width}mm`}
                position="top"
                openDelay={250}
                withArrow>
                <div
                  key={`${entry.name}-${entry.width}`}
                  onClick={() => toggleItem(index)}
                  className={`relative flex flex-col items-center justify-center p-2 rounded cursor-pointer border-2 transition-colors ${
                    isSelected
                      ? "border-gray-300"
                      : "border-transparent hover:border-gray-400"
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
                      <Button
                        onClick={() => decrement(index)}
                        radius={"xl"}
                        size="compact-sm">
                        -
                      </Button>
                      <span className="text-xs font-semibold min-w-4 text-center">
                        {qty}
                      </span>
                      <Button
                        onClick={() => increment(index)}
                        radius={"xl"}
                        size="compact-sm">
                        +
                      </Button>
                    </div>
                  )}
                </div>
              </Tooltip>
            );
          })
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button disabled={selectedQuantities.size === 0} onClick={handleAdd}>
          {totalCount > 0 ? `Add (${totalCount})` : "Add"}
        </Button>
      </div>
    </div>
  );
};
