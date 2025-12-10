import { defineConfig } from 'vite'
import vue from '@vuejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    base: '/weather/', // Убедитесь, что это именно так
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name === 'index.css') return 'assets/style.css'
                    return 'assets/[name]-[hash][extname]'
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js'
            }
        }
    }
})