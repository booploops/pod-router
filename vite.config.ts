import vue from '@vitejs/plugin-vue'
/// <reference types="vitest/config" />
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './playground',
  plugins: [
    vue(),
  ],
})
