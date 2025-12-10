import { defineConfig } from 'vite'
import vue from '@vuejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/weather/', // Должно быть именно так
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true
    }
})