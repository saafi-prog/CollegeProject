import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:44378", // the port of the backend.
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
