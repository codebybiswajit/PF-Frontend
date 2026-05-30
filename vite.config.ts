import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

// Create a custom logger to filter out noisy sourcemap warnings for web-llm
const logger = createLogger()
const originalWarn = logger.warn

logger.warn = (msg, options) => {
  if (msg.includes('points to missing source files') && msg.includes('web-llm')) {
    return
  }
  originalWarn(msg, options)
}

// https://vite.dev/config/
export default defineConfig({
  customLogger: logger,
  plugins: [
    react(),
    {
      name: 'remove-web-llm-sourcemap',
      transform(code, id) {
        const normalizedId = id.replace(/\\/g, '/');
        if (normalizedId.includes('@mlc-ai/web-llm') && normalizedId.endsWith('.js')) {
          return {
            code: code.replace(/\/\/# sourceMappingURL=.*/g, ''),
            map: null
          }
        }
      }
    }
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  preview: {
    allowedHosts: ['biswajit-mohapatra-portfolio.onrender.com']
  },
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm']
  }
})
