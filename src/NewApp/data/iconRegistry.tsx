import { ItemIcon } from "../ItemIcon";
import type { GridItemData } from "../GridItem";

export interface IconRegistryEntry {
  name: string;
  svgSrc: string;
  width: number;
  iconOverride?: React.ReactNode;
}

export const iconEntries: IconRegistryEntry[] = [
  { name: "A Plus", svgSrc: "/assets/A+.svg", width: 40 },
  { name: "Abc", svgSrc: "/assets/Abc.svg", width: 55 },
  { name: "Alarm Clock", svgSrc: "/assets/Alarm Clock.svg", width: 55 },
  { name: "Apple", svgSrc: "/assets/Apple.svg", width: 55 },
  { name: "Arrow Cursor", svgSrc: "/assets/ArrowCursor.svg", width: 35 },
  { name: "Art", svgSrc: "/assets/Art.svg", width: 70 },
  { name: "Back To School", svgSrc: "/assets/BackToSchool.svg", width: 80 },
  { name: "Backpack Blue", svgSrc: "/assets/Backpack Blue.svg", width: 70 },
  {
    name: "Backpack Green",
    svgSrc: "/assets/Backpack Green.svg",
    width: 70,
  },
  {
    name: "Backpack Purple",
    svgSrc: "/assets/Backpack Purple.svg",
    width: 70,
  },
  { name: "Backpack Red", svgSrc: "/assets/Backpack Red.svg", width: 70 },
  {
    name: "Banner Primary Colors",
    svgSrc: "/assets/BannerPrimaryColors.svg",
    width: 150,
  },
  {
    name: "Banner Rainbow",
    svgSrc: "/assets/BannerRainbow.svg",
    width: 150,
  },
  { name: "Binder", svgSrc: "/assets/Binder.svg", width: 55 },
  { name: "Binder Clip", svgSrc: "/assets/BinderClip.svg", width: 35 },
  { name: "Book 1", svgSrc: "/assets/Book1.svg", width: 60 },
  { name: "Book 2", svgSrc: "/assets/Book2.svg", width: 60 },
  { name: "Books Stacked", svgSrc: "/assets/BooksStacked.svg", width: 85 },
  { name: "Bus Stop", svgSrc: "/assets/BusStop.svg", width: 50 },
  { name: "Calculator", svgSrc: "/assets/Calculator.svg", width: 50 },
  { name: "Chalk Box", svgSrc: "/assets/ChalkBox.svg", width: 50 },
  { name: "Chalkboard", svgSrc: "/assets/Chalkboard.svg", width: 160 },
  { name: "Clipboard", svgSrc: "/assets/Clipboard.svg", width: 55 },
  {
    name: "Colored Pencil Orange",
    svgSrc: "/assets/ColoredPencilOrange.svg",
    width: 15,
  },
  {
    name: "Colored Pencil Purple",
    svgSrc: "/assets/ColoredPencilPurple.svg",
    width: 15,
  },
  { name: "Compass", svgSrc: "/assets/Compass.svg", width: 45 },
  {
    name: "Composition Notebook Blue",
    svgSrc: "/assets/CompositionNotebookBlue.svg",
    width: 65,
  },
  {
    name: "Composition Notebook Green",
    svgSrc: "/assets/CompositionNotebookGreen.svg",
    width: 65,
  },
  {
    name: "Computer Mouse",
    svgSrc: "/assets/ComputerMouse.svg",
    width: 45,
  },
  { name: "Crayon Blue", svgSrc: "/assets/CrayonBlue.svg", width: 15 },
  { name: "Crayon Box", svgSrc: "/assets/CrayonBox.svg", width: 65 },
  { name: "Crayon Green", svgSrc: "/assets/CrayonGreen.svg", width: 15 },
  { name: "Crayon Red", svgSrc: "/assets/CrayonRed.svg", width: 15 },
  { name: "Desk", svgSrc: "/assets/Desk.svg", width: 130 },
  {
    name: "Dry Erase Marker Blue",
    svgSrc: "/assets/DryEraseMarkerBlue.svg",
    width: 15,
  },
  {
    name: "Dry Erase Marker Red",
    svgSrc: "/assets/DryEraseMarkerRed.svg",
    width: 15,
  },
  { name: "Eraser", svgSrc: "/assets/Eraser.svg", width: 45 },
  { name: "Eraser Topper", svgSrc: "/assets/EraserTopper.svg", width: 30 },
  { name: "Folder Blue", svgSrc: "/assets/FolderBlue.svg", width: 70 },
  { name: "Folder Orange", svgSrc: "/assets/FolderOrange.svg", width: 70 },
  { name: "Glue Bottle", svgSrc: "/assets/GlueBottle.svg", width: 45 },
  { name: "Glue Stick", svgSrc: "/assets/GlueStick.svg", width: 35 },
  {
    name: "Hand Sanitizer",
    svgSrc: "/assets/HandSanitizer.svg",
    width: 40,
  },
  {
    name: "Headphones Green",
    svgSrc: "/assets/HeadphonesGreen.svg",
    width: 75,
  },
  {
    name: "Headphones Red",
    svgSrc: "/assets/HeadphonesRed.svg",
    width: 75,
  },
  {
    name: "Highlighter Green",
    svgSrc: "/assets/HighlighterGreen.svg",
    width: 15,
  },
  {
    name: "Highlighter Yellow",
    svgSrc: "/assets/HighlighterYellow.svg",
    width: 15,
  },
  { name: "History", svgSrc: "/assets/History.svg", width: 60 },
  { name: "Hole Puncher", svgSrc: "/assets/HolePuncher.svg", width: 55 },
  { name: "Index Card", svgSrc: "/assets/IndexCard.svg", width: 65 },
  { name: "Laptop", svgSrc: "/assets/Laptop.svg", width: 120 },
  { name: "Lock", svgSrc: "/assets/Lock.svg", width: 40 },
  { name: "Lockers", svgSrc: "/assets/Lockers.svg", width: 100 },
  { name: "Lunch Sack", svgSrc: "/assets/LunchSack.svg", width: 55 },
  { name: "Lunch Time", svgSrc: "/assets/LunchTime.svg", width: 70 },
  { name: "Marker Green", svgSrc: "/assets/MarkerGreen.svg", width: 15 },
  { name: "Marker Pink", svgSrc: "/assets/Marker Pink.svg", width: 15 },
  { name: "Math", svgSrc: "/assets/Math.svg", width: 55 },
  {
    name: "Message Bubble",
    svgSrc: "/assets/MessageBubble.svg",
    width: 65,
  },
  {
    name: "Notebook Paper",
    svgSrc: "/assets/NotebookPaper.svg",
    width: 60,
  },
  {
    name: "Notebook Purple",
    svgSrc: "/assets/NotebookPurple.svg",
    width: 60,
  },
  { name: "Notebook Red", svgSrc: "/assets/NotebookRed.svg", width: 60 },
  { name: "Numbers 123", svgSrc: "/assets/123.svg", width: 55 },
  { name: "Paint Brush", svgSrc: "/assets/PaintBrush.svg", width: 20 },
  { name: "Paint Palette", svgSrc: "/assets/PaintPalette.svg", width: 65 },
  {
    name: "Paper Airplane",
    svgSrc: "/assets/PaperAirplane.svg",
    width: 65,
  },
  { name: "Paperclip", svgSrc: "/assets/Paperclip.svg", width: 20 },
  { name: "Pen Blue", svgSrc: "/assets/PenBlue.svg", width: 15 },
  { name: "Pen Red", svgSrc: "/assets/PenRed.svg", width: 15 },
  { name: "Pencil", svgSrc: "/assets/Pencil.svg", width: 15 },
  { name: "Pencil Cup", svgSrc: "/assets/PencilCup.svg", width: 50 },
  {
    name: "Pencil Pouch Blue",
    svgSrc: "/assets/PencilPouchBlue.svg",
    width: 80,
  },
  {
    name: "Pencil Pouch Red",
    svgSrc: "/assets/PencilPouchRed.svg",
    width: 80,
  },
  {
    name: "Pencil Sharpener",
    svgSrc: "/assets/Pencil Sharpener.svg",
    width: 45,
  },
  { name: "Reading", svgSrc: "/assets/Reading.svg", width: 75 },
  {
    name: "Ruler Protractor",
    svgSrc: "/assets/RulerProtractor.svg",
    width: 80,
  },
  { name: "Ruler Stick", svgSrc: "/assets/RulerStick.svg", width: 110 },
  {
    name: "Ruler Triangle",
    svgSrc: "/assets/RulerTriangle.svg",
    width: 65,
  },
  {
    name: "School Building",
    svgSrc: "/assets/SchoolBuilding.svg",
    width: 200,
  },
  { name: "School Bus", svgSrc: "/assets/SchoolBus.svg", width: 175 },
  { name: "Science", svgSrc: "/assets/Science.svg", width: 60 },
  { name: "Scissors", svgSrc: "/assets/Scissors.svg", width: 55 },
  {
    name: "Staple Remover",
    svgSrc: "/assets/StapleRemover.svg",
    width: 40,
  },
  { name: "Stapler", svgSrc: "/assets/Stapler.svg", width: 70 },
  { name: "Star", svgSrc: "/assets/Star.svg", width: 45 },
  { name: "Star Student", svgSrc: "/assets/StarStudent.svg", width: 60 },
  {
    name: "Sticky Note Green",
    svgSrc: "/assets/StickyNoteGreen.svg",
    width: 55,
  },
  {
    name: "Sticky Note Yellow",
    svgSrc: "/assets/StickyNoteYellow.svg",
    width: 55,
  },
  {
    name: "Tape Dispenser Blue",
    svgSrc: "/assets/TapeDispenserBlue.svg",
    width: 65,
  },
  {
    name: "Tape Dispenser Purple",
    svgSrc: "/assets/TapeDispenserPurple.svg",
    width: 65,
  },
  {
    name: "Thought Bubble",
    svgSrc: "/assets/ThoughtBubble.svg",
    width: 85,
  },
  { name: "Thumbtack", svgSrc: "/assets/Thumbtack.svg", width: 30 },
  { name: "Tissue Box", svgSrc: "/assets/TissueBox.svg", width: 60 },
  { name: "USB Drive", svgSrc: "/assets/USBDrive.svg", width: 35 },
  {
    name: "Water Bottle Blue",
    svgSrc: "/assets/WaterBottleBlue.svg",
    width: 45,
  },
  {
    name: "Water Bottle Pink",
    svgSrc: "/assets/WaterBottlePink.svg",
    width: 45,
  },
  { name: "Watercolors", svgSrc: "/assets/Watercolors.svg", width: 80 },
  { name: "Welcome Class", svgSrc: "/assets/WelcomeClass.svg", width: 110 },
  { name: "Whiteboard", svgSrc: "/assets/Whiteboard.svg", width: 170 },
  {
    name: "Whiteboard Eraser",
    svgSrc: "/assets/WhiteboardEraser.svg",
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
