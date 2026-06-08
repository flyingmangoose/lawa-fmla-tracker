import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev, run `npm run server` alongside `npm run dev`; Vite proxies /api to it.
const API_TARGET = process.env.API_TARGET || "http://localhost:3001";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist" },
  server: {
    proxy: {
      "/api": { target: API_TARGET, changeOrigin: true },
    },
  },
});
