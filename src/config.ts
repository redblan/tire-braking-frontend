// Нативное приложение Tauri: окно приложения, а не вкладка браузера
export const IS_TAURI = "__TAURI_INTERNALS__" in window;

// IP компьютера с бэкендом в локальной сети (не localhost). Узнать: ipconfig getifaddr en0
export const BACKEND_IP = "172.16.226.48";

// Адрес веб-сервиса и S3 (Minio).
// В браузере пусто: запросы идут на адрес фронтенда и дальше через прокси Vite.
// Собранное приложение Tauri прокси не имеет, поэтому обращается к бэкенду напрямую по IP локальной сети
export const API_BASE_URL = IS_TAURI ? `http://${BACKEND_IP}:8080` : "";
export const S3_BASE_URL = IS_TAURI ? `http://${BACKEND_IP}:9000` : "";

// сколько карточек на одной странице плитки
export const PAGE_LIMIT = 10;

// как часто лента переспрашивает услугу у бэкенда (Short Polling), мс
export const POLL_INTERVAL = 2000;

// Поиск похожих карточек по изображению (среди карточек текущей страницы):
// порог относительной близости (0–1) и максимальное количество результатов
export const SEARCH_THRESHOLD = 0.6;
export const SEARCH_TOP_K = 3;

export const DEFAULT_IMAGE = "/DefaultImage.jpg";
export const DEFAULT_MODEL = "/DefaultModel.glb";

const S3_ORIGIN = "http://localhost:9000";

// Ссылка на файл услуги: пустая — файл по умолчанию из проекта;
// ссылка на Minio (http://localhost:9000/brakes/...) — в браузере /brakes/... через прокси, в Tauri — по IP;
// файл с веб-сервиса (/static/...) — через прокси или по IP
export const mediaUrl = (url: string | undefined, fallback: string): string => {
  if (!url) return fallback;
  if (url.startsWith(S3_ORIGIN)) return S3_BASE_URL + url.slice(S3_ORIGIN.length);
  if (url.startsWith("/")) return API_BASE_URL + url;
  return url;
};
