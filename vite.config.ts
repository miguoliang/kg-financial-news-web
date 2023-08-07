import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import macrosPlugin from "vite-plugin-babel-macros";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    macrosPlugin(),
    react(),
  ],
  build: {
    outDir: "build",
    sourcemap: process.env.NODE_ENV !== "production",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules/echarts") || id.includes("node_modules/zrender")) {
            return "vendors-echarts";
          } else if (id.includes("node_modules/@chakra-ui") ||
            id.includes("node_modules/@emotion") ||
            id.includes("node_modules/framer-motion") ||
            id.includes("node_modules/@popperjs") ||
            id.includes("node_modules/lodash.mergewith") ||
            id.includes("node_modules/@tanstack") ||
            id.includes("node_modules/react-select") ||
            id.includes("node_modules/react-icons")) {
            return "vendors-ui";
          } else if (id.includes("node_modules")) {
            return "vendors-misc";
          } else if (id.includes("src/")) {
            return "app";
          }
        },
      },
    },
  },
  server: {
    port: 3000, watch: {
      usePolling: true,
    },
  },
  define: {
    "process.env": `"{}"`,
  },
  resolve: {
    alias: [
      {
        find: /^assets(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/assets/") + "$1",
      },
      {
        find: /^components(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/components/") + "$1",
      },
      {
        find: /^configs(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/configs/") + "$1",
      },
      {
        find: /^mock(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/mock/") + "$1",
      },
      {
        find: /^services(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/services/") + "$1",
      },
      {
        find: /^hooks(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/hooks/") + "$1",
      },
      {
        find: /^views(\/(.+)|$)/,
        replacement: resolve(__dirname, "src/views/") + "$1",
      },
    ],
  },
});
