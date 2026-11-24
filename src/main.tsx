import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import { IS_TAURI } from './config'
import { store } from './store'
import './Native.css'

// Нативное приложение: своя раскладка на всё окно (класс native) и тема как в системе — светлая или тёмная
if (IS_TAURI) {
  document.documentElement.classList.add('native')
  const dark = window.matchMedia('(prefers-color-scheme: dark)')
  const applyTheme = () => document.documentElement.setAttribute('data-bs-theme', dark.matches ? 'dark' : 'light')
  applyTheme()
  dark.addEventListener('change', applyTheme)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
