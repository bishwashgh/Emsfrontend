import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Server configuration for development
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests to your backend during development
      '/api': {
        target: 'https://ems.bishwasghimire.com.np',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize chunk splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
})