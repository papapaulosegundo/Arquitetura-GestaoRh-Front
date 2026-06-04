import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeDocuments',
      filename: 'remoteEntry.js',
      exposes: {
        './DocumentsApp': './src/bootstrap.jsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: {
    port: 4174,
  },
  preview: {
    port: 4184,
  },
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})
