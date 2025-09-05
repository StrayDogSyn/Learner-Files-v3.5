import { defineConfig } from 'vite'

// Vite configuration for Marvel Quiz Game
// Disables automatic .env file loading to prevent security restrictions
export default defineConfig({
  // Disable automatic .env file loading
  envDir: false,
  
  // Configure server settings
  server: {
    port: 3001,
    host: true,
    fs: {
      // Allow serving files from the project root
      allow: ['..'],
      // Strict mode to prevent access to files outside allowed directories
      strict: true
    }
  },
  
  // Set base path for proper asset loading
  base: './',
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': new URL('./assets', import.meta.url).pathname
    }
  },
  
  // Define configuration to prevent Vite from looking for .env files
  define: {
    // Prevent process.env access
    'process.env': {},
    // Prevent import.meta.env automatic loading
    'import.meta.env.VITE_*': 'undefined'
  },
  
  // Explicitly disable environment variable loading
  envPrefix: [],
  
  // Preview configuration
  preview: {
    port: 4174,
    host: true
  }
})