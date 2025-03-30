import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to our backend server
      '/api': {
        target: 'http://localhost:5001', // Your backend server address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Optional: Set to false if your backend server uses http
        // Optional: You might not need rewrite if your backend routes already start with /api
        // rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix before forwarding
      }
    }
  }
})
