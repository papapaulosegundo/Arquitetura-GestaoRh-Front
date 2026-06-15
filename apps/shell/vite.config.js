import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        remotes: {
          mfePeople: env.VITE_REMOTE_PEOPLE_URL ?? 'http://localhost:4183/assets/remoteEntry.js',
          mfeDocuments: env.VITE_REMOTE_DOCUMENTS_URL ?? 'http://localhost:4184/assets/remoteEntry.js',
        },
        shared: ['react', 'react-dom', 'react-router-dom'],
      }),
    ],
    server: {
      port: 5173,
      strictPort: true,
    },
    preview: {
      port: 4175,
      strictPort: true,
    },
    build: {
      target: 'esnext',
    },
  }
})
