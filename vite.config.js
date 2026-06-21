import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ems.bishwasghimire.com.np',
        changeOrigin: true,
        secure: true,
      }
    }
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Group vendor packages
          if (id.includes('node_modules')) {
            // React and React DOM
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            // React Router
            if (id.includes('react-router-dom')) {
              return 'vendor-router'
            }
            // Other node_modules
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  
  envPrefix: 'VITE_',
})