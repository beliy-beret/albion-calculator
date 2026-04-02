import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/albion-calculator/',

  server: {
    port: 3000,
    open: true
  },
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  }
})