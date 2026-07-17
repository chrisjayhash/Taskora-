import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    /*allowedHosts: [
      'patch-subscriptions-still-hardware.trycloudflare.com'
      // You can also use '*' here if you want to allow all hosts
    ]*/
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})