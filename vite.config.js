import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/vite-static-deploy/",
  define: {
    __BUILD_DATE__: new Date(),
  },
  plugins: [react()],
});
