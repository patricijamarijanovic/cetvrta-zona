//kod kopiran s https://github.com/progi-devops/progi-monorepo:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "http://${BACK_URL}",
        changeOrigin: true
      },
    },
  },
})