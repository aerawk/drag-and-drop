import { ItemIcon } from "../ItemIcon";
import type { GridItemData } from "../GridItem";

export interface IconRegistryEntry {
  name: string;
  svgSrc: string;
  width: number;
  iconOverride?: React.ReactNode;
}

export const iconEntries: IconRegistryEntry[] = [
  { name: "A Plus", svgSrc: "/src/assets/A+.svg", width: 40 },
  { name: "Abc", svgSrc: "/src/assets/Abc.svg", width: 55 },
  { name: "Alarm Clock", svgSrc: "/src/assets/Alarm Clock.svg", width: 55 },
  { name: "Apple", svgSrc: "/src/assets/Apple.svg", width: 55 },
  { name: "Arrow Cursor", svgSrc: "/src/assets/ArrowCursor.svg", width: 35 },
  { name: "Art", svgSrc: "/src/assets/Art.svg", width: 70 },
  { name: "Back To School", svgSrc: "/src/assets/BackToSchool.svg", width: 80 },
  { name: "Backpack Blue", svgSrc: "/src/assets/Backpack Blue.svg", width: 70 },
  {
    name: "Backpack Green",
    svgSrc: "/src/assets/Backpack Green.svg",
    width: 70,
  },
  {
    name: "Backpack Purple",
    svgSrc: "/src/assets/Backpack Purple.svg",
    width: 70,
  },
  { name: "Backpack Red", svgSrc: "/src/assets/Backpack Red.svg", width: 70 },
  {
    name: "Banner Primary Colors",
    svgSrc: "/src/assets/BannerPrimaryColors.svg",
    width: 150,
  },
  {
    name: "Banner Rainbow",
    svgSrc: "/src/assets/BannerRainbow.svg",
    width: 150,
  },
  { name: "Binder", svgSrc: "/src/assets/Binder.svg", width: 55 },
  { name: "Binder Clip", svgSrc: "/src/assets/BinderClip.svg", width: 35 },
  { name: "Book 1", svgSrc: "/src/assets/Book1.svg", width: 60 },
  { name: "Book 2", svgSrc: "/src/assets/Book2.svg", width: 60 },
  { name: "Books Stacked", svgSrc: "/src/assets/BooksStacked.svg", width: 85 },
  { name: "Bus Stop", svgSrc: "/src/assets/BusStop.svg", width: 50 },
  { name: "Calculator", svgSrc: "/src/assets/Calculator.svg", width: 50 },
  { name: "Chalk Box", svgSrc: "/src/assets/ChalkBox.svg", width: 50 },
  { name: "Chalkboard", svgSrc: "/src/assets/Chalkboard.svg", width: 160 },
  { name: "Clipboard", svgSrc: "/src/assets/Clipboard.svg", width: 55 },
  {
    name: "Colored Pencil Orange",
    svgSrc: "/src/assets/ColoredPencilOrange.svg",
    width: 15,
  },
  {
    name: "Colored Pencil Purple",
    svgSrc: "/src/assets/ColoredPencilPurple.svg",
    width: 15,
  },
  { name: "Compass", svgSrc: "/src/assets/Compass.svg", width: 45 },
  {
    name: "Composition Notebook Blue",
    svgSrc: "/src/assets/CompositionNotebookBlue.svg",
    width: 65,
  },
  {
    name: "Composition Notebook Green",
    svgSrc: "/src/assets/CompositionNotebookGreen.svg",
    width: 65,
  },
  {
    name: "Computer Mouse",
    svgSrc: "/src/assets/ComputerMouse.svg",
    width: 45,
  },
  { name: "Crayon Blue", svgSrc: "/src/assets/CrayonBlue.svg", width: 15 },
  { name: "Crayon Box", svgSrc: "/src/assets/CrayonBox.svg", width: 65 },
  { name: "Crayon Green", svgSrc: "/src/assets/CrayonGreen.svg", width: 15 },
  { name: "Crayon Red", svgSrc: "/src/assets/CrayonRed.svg", width: 15 },
  { name: "Desk", svgSrc: "/src/assets/Desk.svg", width: 130 },
  {
    name: "Dry Erase Marker Blue",
    svgSrc: "/src/assets/DryEraseMarkerBlue.svg",
    width: 15,
  },
  {
    name: "Dry Erase Marker Red",
    svgSrc: "/src/assets/DryEraseMarkerRed.svg",
    width: 15,
  },
  { name: "Eraser", svgSrc: "/src/assets/Eraser.svg", width: 45 },
  { name: "Eraser Topper", svgSrc: "/src/assets/EraserTopper.svg", width: 30 },
  { name: "Folder Blue", svgSrc: "/src/assets/FolderBlue.svg", width: 70 },
  { name: "Folder Orange", svgSrc: "/src/assets/FolderOrange.svg", width: 70 },
  { name: "Glue Bottle", svgSrc: "/src/assets/GlueBottle.svg", width: 45 },
  { name: "Glue Stick", svgSrc: "/src/assets/GlueStick.svg", width: 35 },
  {
    name: "Hand Sanitizer",
    svgSrc: "/src/assets/HandSanitizer.svg",
    width: 40,
  },
  {
    name: "Headphones Green",
    svgSrc: "/src/assets/HeadphonesGreen.svg",
    width: 75,
  },
  {
    name: "Headphones Red",
    svgSrc: "/src/assets/HeadphonesRed.svg",
    width: 75,
  },
  {
    name: "Highlighter Green",
    svgSrc: "/src/assets/HighlighterGreen.svg",
    width: 15,
  },
  {
    name: "Highlighter Yellow",
    svgSrc: "/src/assets/HighlighterYellow.svg",
    width: 15,
  },
  { name: "History", svgSrc: "/src/assets/History.svg", width: 60 },
  { name: "Hole Puncher", svgSrc: "/src/assets/HolePuncher.svg", width: 55 },
  { name: "Index Card", svgSrc: "/src/assets/IndexCard.svg", width: 65 },
  { name: "Laptop", svgSrc: "/src/assets/Laptop.svg", width: 120 },
  { name: "Lock", svgSrc: "/src/assets/Lock.svg", width: 40 },
  { name: "Lockers", svgSrc: "/src/assets/Lockers.svg", width: 100 },
  { name: "Lunch Sack", svgSrc: "/src/assets/LunchSack.svg", width: 55 },
  { name: "Lunch Time", svgSrc: "/src/assets/LunchTime.svg", width: 70 },
  { name: "Marker Green", svgSrc: "/src/assets/MarkerGreen.svg", width: 15 },
  { name: "Marker Pink", svgSrc: "/src/assets/Marker Pink.svg", width: 15 },
  { name: "Math", svgSrc: "/src/assets/Math.svg", width: 55 },
  {
    name: "Message Bubble",
    svgSrc: "/src/assets/MessageBubble.svg",
    width: 65,
  },
  {
    name: "Notebook Paper",
    svgSrc: "/src/assets/NotebookPaper.svg",
    width: 60,
  },
  {
    name: "Notebook Purple",
    svgSrc: "/src/assets/NotebookPurple.svg",
    width: 60,
  },
  { name: "Notebook Red", svgSrc: "/src/assets/NotebookRed.svg", width: 60 },
  { name: "Numbers 123", svgSrc: "/src/assets/123.svg", width: 55 },
  { name: "Paint Brush", svgSrc: "/src/assets/PaintBrush.svg", width: 20 },
  { name: "Paint Palette", svgSrc: "/src/assets/PaintPalette.svg", width: 65 },
  {
    name: "Paper Airplane",
    svgSrc: "/src/assets/PaperAirplane.svg",
    width: 65,
  },
  { name: "Paperclip", svgSrc: "/src/assets/Paperclip.svg", width: 20 },
  { name: "Pen Blue", svgSrc: "/src/assets/PenBlue.svg", width: 15 },
  { name: "Pen Red", svgSrc: "/src/assets/PenRed.svg", width: 15 },
  { name: "Pencil", svgSrc: "/src/assets/Pencil.svg", width: 15 },
  { name: "Pencil Cup", svgSrc: "/src/assets/PencilCup.svg", width: 50 },
  {
    name: "Pencil Pouch Blue",
    svgSrc: "/src/assets/PencilPouchBlue.svg",
    width: 80,
  },
  {
    name: "Pencil Pouch Red",
    svgSrc: "/src/assets/PencilPouchRed.svg",
    width: 80,
  },
  {
    name: "Pencil Sharpener",
    svgSrc: "/src/assets/Pencil Sharpener.svg",
    width: 45,
  },
  { name: "Reading", svgSrc: "/src/assets/Reading.svg", width: 75 },
  {
    name: "Ruler Protractor",
    svgSrc: "/src/assets/RulerProtractor.svg",
    width: 80,
  },
  { name: "Ruler Stick", svgSrc: "/src/assets/RulerStick.svg", width: 110 },
  {
    name: "Ruler Triangle",
    svgSrc: "/src/assets/RulerTriangle.svg",
    width: 65,
  },
  {
    name: "School Building",
    svgSrc: "/src/assets/SchoolBuilding.svg",
    width: 200,
  },
  { name: "School Bus", svgSrc: "/src/assets/SchoolBus.svg", width: 175 },
  { name: "Science", svgSrc: "/src/assets/Science.svg", width: 60 },
  { name: "Scissors", svgSrc: "/src/assets/Scissors.svg", width: 55 },
  {
    name: "Staple Remover",
    svgSrc: "/src/assets/StapleRemover.svg",
    width: 40,
  },
  { name: "Stapler", svgSrc: "/src/assets/Stapler.svg", width: 70 },
  { name: "Star", svgSrc: "/src/assets/Star.svg", width: 45 },
  { name: "Star Student", svgSrc: "/src/assets/StarStudent.svg", width: 60 },
  {
    name: "Sticky Note Green",
    svgSrc: "/src/assets/StickyNoteGreen.svg",
    width: 55,
  },
  {
    name: "Sticky Note Yellow",
    svgSrc: "/src/assets/StickyNoteYellow.svg",
    width: 55,
  },
  {
    name: "Tape Dispenser Blue",
    svgSrc: "/src/assets/TapeDispenserBlue.svg",
    width: 65,
  },
  {
    name: "Tape Dispenser Purple",
    svgSrc: "/src/assets/TapeDispenserPurple.svg",
    width: 65,
  },
  {
    name: "Thought Bubble",
    svgSrc: "/src/assets/ThoughtBubble.svg",
    width: 85,
  },
  { name: "Thumbtack", svgSrc: "/src/assets/Thumbtack.svg", width: 30 },
  { name: "Tissue Box", svgSrc: "/src/assets/TissueBox.svg", width: 60 },
  { name: "USB Drive", svgSrc: "/src/assets/USBDrive.svg", width: 35 },
  {
    name: "Water Bottle Blue",
    svgSrc: "/src/assets/WaterBottleBlue.svg",
    width: 45,
  },
  {
    name: "Water Bottle Pink",
    svgSrc: "/src/assets/WaterBottlePink.svg",
    width: 45,
  },
  { name: "Watercolors", svgSrc: "/src/assets/Watercolors.svg", width: 80 },
  { name: "Welcome Class", svgSrc: "/src/assets/WelcomeClass.svg", width: 110 },
  { name: "Whiteboard", svgSrc: "/src/assets/Whiteboard.svg", width: 170 },
  {
    name: "Whiteboard Eraser",
    svgSrc: "/src/assets/WhiteboardEraser.svg",
    width: 55,
  },
];

export function toKebabId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function buildIconItems(): GridItemData[] {
  return iconEntries.map((entry) => ({
    id: toKebabId(entry.name),
    text: entry.name,
    width: entry.width,
    svgSrc: entry.svgSrc,
    icon: (
      <ItemIcon
        src={entry.svgSrc}
        alt={`${entry.name} Icon`}
        width={entry.width}
      />
    ),
  }));
}
