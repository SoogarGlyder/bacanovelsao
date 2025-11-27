import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', 
  root: '.', 
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3030',
        changeOrigin: true, 
        secure: false,
      },
    },
  },
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    
    rollupOptions: {
        input: {
            main: 'packages/client/index.html',
            admin: 'packages/client/admin.html',
        }
    }
  }  
})