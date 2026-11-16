import { defineConfig } from 'vite'

// Relative base so the built site works from any sub-path (e.g. /lab/).
export default defineConfig({
  base: './',
  build: { target: 'es2022', chunkSizeWarningLimit: 900 },
})
