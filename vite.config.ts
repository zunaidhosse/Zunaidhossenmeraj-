import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This base path is crucial for deploying to a subdirectory on GitHub Pages.
  // It must match the name of your GitHub repository.
  // Correcting the repository name based on your provided URL.
  base: "/Zunaidhossenmeraj-/",
})