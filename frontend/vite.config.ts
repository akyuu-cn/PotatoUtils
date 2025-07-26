import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
    plugins: [react(), tailwindcss(), visualizer({ open: true })],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    base: '/', // 如果部署在非根路径请调整
    server: {
        port: 5173,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('recharts')) return 'recharts'
                        if (id.includes('react')) return 'react'
                        if (id.includes('crypto-js')) return 'crypto-js'
                        if (id.includes('luxon')) return 'luxon'
                        if (id.includes('lodash')) return 'lodash'
                        return 'vender'
                    }
                }
            }
        }
    }
})
