import { defineConfig, transformWithEsbuild, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, path.resolve(__dirname, '..'))};

  return defineConfig({
    plugins: [
      tailwindcss(),
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/)) return null;
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      react(),
    ],
    server: {
      port: 3000,
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    build: {
      outDir: "../public",
    },
  });
};