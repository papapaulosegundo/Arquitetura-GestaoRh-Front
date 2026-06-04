import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        mfePeople: 'http://localhost:4173/assets/remoteEntry.js',
        mfeDocuments: 'http://localhost:4174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: {
    port: 5173,
  },
  preview: {
    port: 4175,
  },
  build: {
    target: 'esnext',
  },
})
