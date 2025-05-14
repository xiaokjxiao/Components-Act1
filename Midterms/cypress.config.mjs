import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173', // Set this to your actual development server port
    setupNodeEvents(on, config) {
    },
  },
})