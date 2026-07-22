import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/v1": "http://127.0.0.1:3001",
      "/sitemap.xml": {
        target: "http://127.0.0.1:3001",
        rewrite: () => "/v1/content/sitemap.xml",
      },
    },
  },
});
