import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Learner-Files-v3.5/', // This is crucial for GitHub Pages!
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
