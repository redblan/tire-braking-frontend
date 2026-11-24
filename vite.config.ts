import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    // обратный прокси: браузер ходит только на адрес фронтенда, ограничения CORS нет
    proxy: {
      // веб-сервис на Go
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      // файлы по умолчанию с сервера Go (картинка и 3D модель)
      '/static': { target: 'http://localhost:8080', changeOrigin: true },
      // S3 (Minio), бакет brakes: изображения и 3D модели услуг
      '/brakes': { target: 'http://localhost:9000', changeOrigin: true },
    },
  },
  plugins: [react()],
  // воркер поиска по изображению импортирует transformers.js как ES-модуль
  worker: { format: 'es' },
})
