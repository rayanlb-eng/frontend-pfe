import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// OneDrive on Windows can break filesystem events, so force polling for HMR.
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
