import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const sourceHtml = fileURLToPath(new URL("./index.source.html", import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: sourceHtml,
      output: {
        entryFileNames: "assets/app.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "assets/app.css";
          }

          return "assets/[name][extname]";
        },
      },
    },
  },
  plugins: [react()],
});
