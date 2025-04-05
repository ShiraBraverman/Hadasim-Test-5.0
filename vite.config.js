import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "src/part4/frontend",
  build: {
    outDir: "../../dist",
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
