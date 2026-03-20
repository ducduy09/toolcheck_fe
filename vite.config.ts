import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  base: "/",
  resolve: {
    alias: {
      '@component': path.resolve(__dirname,'src/component'),
      '@axios': path.resolve(__dirname, 'src/setup/axios'),
      // '@container': path.resolve(__dirname, 'src/container'),
      '@navigator': path.resolve(__dirname, 'src/setup/navigator'),
      '@setup_assets': path.resolve(__dirname, 'src/setup/assets'),
      '@redux': path.resolve(__dirname, 'src/setup/redux'),
      '@type': path.resolve(__dirname, 'src/setup/type'),
      '@constants': path.resolve(__dirname, 'src/setup/constants'),
      '@functions': path.resolve(__dirname, 'src/setup/func'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173
  }
})
