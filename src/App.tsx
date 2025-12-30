import { NewApp } from "./NewApp/NewApp";
import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";

export default function App() {
  return (
    <div className="p-4">
      <MantineProvider defaultColorScheme="dark">
        <NewApp />
      </MantineProvider>
    </div>
  );
}
