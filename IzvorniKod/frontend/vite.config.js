//kod kopiran s https://github.com/progi-devops/progi-monorepo:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const BACK_URL = "backend-qns7.onrender.com";

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: `https://${BACK_URL}`,
        changeOrigin: true
      },
    },
  },
})