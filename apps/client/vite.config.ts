import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    server: {
        port: 4577,
        proxy: {
            "/api": {
                target: "http://localhost:4576",
            },
        },
    },
    esbuild: {
        drop: mode === "production" ? ["console", "debugger"] : [],
    },
}));
