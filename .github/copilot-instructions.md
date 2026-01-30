# Copilot Instructions - Drag & Drop Grid Application

## Business Context

This application serves as a **product configurator for an online shop** selling decorative wooden cutouts. Customers use this interface to:

- Select small decorative wooden pieces (drag-and-drop items)
- Arrange them on physical display boards/receptacles (the grid drop zones)
- Visualize their custom decoration before ordering

**Critical constraints**: Each wooden piece has a real-world width (in millimeters), and each display board has a maximum groove width capacity. The app enforces these physical limitations to ensure customers can only create arrangements that will physically fit on their chosen board size.

**Responsive Design Priority**: This is a customer-facing e-commerce tool that must provide an excellent user experience across mobile, tablet, and desktop screen sizes. Layout decisions should prioritize usability and visual clarity on all device types.

## Project Overview

This is a React + TypeScript grid-based drag-and-drop application using **@dnd-kit** for drag operations and **Mantine UI** + **Tailwind CSS v4** for styling. The app allows users to arrange items on multiple configurable grid rows with width-based capacity constraints.

## Tech Stack & Build

- **Framework**: React 19 + TypeScript 5.9 (Vite 7 build)
- **Key Libraries**: @dnd-kit/core, @dnd-kit/sortable, Mantine UI 8.x, Tailwind CSS 4.x
- **Build Performance**: React Compiler is enabled via `babel-plugin-react-compiler`
- **Commands**: `npm run dev` (development), `npm run build` (TypeScript + Vite), `npm run lint`

## Architecture & State Management

### Core Data Model

The grid system uses a **width-based capacity model** reflecting physical product constraints:

- **Board sizes** defined in `src/NewApp/data/boards.ts` with `grooveWidth` (usable display capacity in millimeters)
- **Items** represent wooden cutouts with `width` (25-150mm) and `height` (1-3 units) properties
- Grids calculate remaining capacity: `grooveWidth - sum(item.width)` to prevent physically impossible arrangements
- Three grids represent the front, middle, and back rows of a tiered display board

### State Structure (NewApp.tsx)

```typescript
// Three independent grids with separate state
const [grid1Items, setGrid1Items] = useState<GridItemData[]>([]);
const [grid2Items, setGrid2Items] = useState<GridItemData[]>([]);
const [grid3Items, setGrid3Items] = useState<GridItemData[]>([]);

// Available items pool for drag-and-drop
const [availableItems, setAvailableItems] = useState<GridItemData[]>([]);

// Active board configuration
const [activeBoardSize, setActiveBoardSize] = useState<BoardType>(
  boardSizes[1]
);
```

### Drag-and-Drop Logic

**Critical pattern**: The `findItemLocation()` helper searches all sources (available + 3 grids) to determine where an item currently lives. This enables:

1. Cross-grid dragging
2. Returning items to the available pool
3. Reordering within the same grid (uses `@dnd-kit/sortable`'s `arrayMove`)

**Capacity validation**: Before accepting drops, `handleDragEnd` checks if target grid has sufficient `remainingWidth`.

## Component Architecture

### GridDroppable Component

- Uses `@dnd-kit`'s `useDroppable` hook + `SortableContext` for both drop zone and sorting
- Renders a **CSS Grid** with `gridTemplateColumns: repeat(${maxWidth}, 1fr)` for precise width allocation
- Items positioned with `gridColumn: span ${item.width}` and `gridRow: ${4 - item.height} / 4` (bottom-aligned)

### GridItem vs SortableGridItem

- **GridItem**: Base draggable component using `useDraggable` hook
- **SortableGridItem**: Wraps GridItem with `useSortable` for within-grid reordering
- Both share the `GridItemData` interface (`id`, `text`, `width`, `height`, `backgroundImage?`)

### ItemPicker Modal (WIP)

- Mantine `Modal` component for selecting items to add to available pool
- Triggered via `useDisclosure` hook: `const [opened, { open, close }] = useDisclosure(false);`
- **Current State**: Basic grid selection UI exists, but integration with main app state is pending design decisions

## Styling Conventions

### Hybrid Tailwind + Mantine Approach

- **Tailwind CSS 4.x** for layout (`flex`, `grid`, spacing, colors)
- **Mantine components** for UI elements (Radio.Group, Modal, Button)
- **PostCSS config** required for Mantine's CSS variables (see `postcss.config.cjs`)

### Tailwind Class Patterns

- Use `className="p-2!"` syntax for Mantine overrides (important modifier)
- Grid backgrounds change on hover: `isOver ? "#e0f2fe" : "#f8fafc"`
- Conditional classes for capacity: `remainingWidth === 0 ? "text-red-600 font-bold" : "text-green-600"`
- **Responsive utilities**: Leverage Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) for layouts that adapt to mobile, tablet, and desktop viewports

## Key Development Patterns

### Adding New Grid Functionality

1. Update `GridItemData` interface in `GridItem.tsx` for new item properties
2. Modify `handleDragEnd` in `NewApp.tsx` for drop validation logic
3. Adjust CSS Grid template in `GridDroppable.tsx` for layout changes

### Working with Board Sizes

- Board configurations in `src/NewApp/data/boards.ts` follow `BoardType` schema
- `grooveWidth` is the **actual usable space** (boardWidth minus margins)
- Radio.Group selection updates `activeBoardSize` state, triggering grid capacity recalculation

### Icon System (In Transition)

- **Current**: Individual SVG icon components in `src/NewApp/icons/` (e.g., `MountainIcon.tsx`) with size prop
- **Future Direction**: Consolidate into a flexible `Icon` component accepting `size` and `imageSource` props to simplify implementation
- Pattern to follow: `<Icon size="small" | "medium" | "large" source="mountain" />`

## Common Tasks

### Adding a New Grid Row

1. Add state: `const [grid4Items, setGrid4Items] = useState<GridItemData[]>([]);`
2. Update `getGridItems()` and `setGridItems()` switch statements
3. Add to `findItemLocation()` sources array: `{ location: "grid-4", items: grid4Items }`
4. Render `<GridDroppable id="grid-4" ... />`

### Creating Item Templates

- Templates defined in `itemTemplates` array (NewApp.tsx)
- `height` auto-calculated via `calculateHeight(width)`: ≤3 → 1, ≤7 → 2, else 3
- `backgroundImage` optional property for visual customization

### Debugging Drag Issues

- Check `activeItem` state in `handleDragStart`
- Verify `findItemLocation()` returns correct source
- Console log `over.id` in `handleDragEnd` to see drop targets
- Uncomment `<DragOverlay>` (line 272) for visual feedback during drag
