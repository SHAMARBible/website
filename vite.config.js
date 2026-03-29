import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Add this

export default defineConfig(({ command }) => {
  return {
    // If we are deploying via Github Actions without a custom domain, 
    // we need to set the base to the repository name for GitHub Pages to resolve assets correctly.
    base: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` : '/',
    plugins: [
      react(),
      tailwindcss(), // Add this
    ],
  }
})