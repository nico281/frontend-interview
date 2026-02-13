import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "./src/test/setup.ts",
	},
	resolve: {
		alias: {
			"@": "/src",
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:4000",
				changeOrigin: true,
			},
		},
	},
});
