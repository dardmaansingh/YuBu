import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxy /api requests to the backend so cookies work on the same origin during development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

