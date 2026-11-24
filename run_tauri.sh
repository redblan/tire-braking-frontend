#!/bin/bash
# Сборка нативного приложения Tauri (не dev) с IP компьютера в локальной сети.
# Запуск:  bash run_tauri.sh     (из папки tire-braking-frontend)
# Весь вывод пишется в tauri_run.log рядом со скриптом.

cd "$(dirname "$0")" || exit 1
exec > >(tee tauri_run.log) 2>&1

step() { echo; echo "=================== $* ==================="; }

step "0. Окружение"
date
node -v
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"
if ! command -v cargo >/dev/null 2>&1; then
  echo "RUST НЕ УСТАНОВЛЕН. Установи его сам командой с https://rustup.rs :"
  echo "  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
  echo "потом открой новый терминал и запусти скрипт ещё раз"
  exit 1
fi
cargo --version
rustc --version
xcode-select -p || echo "НЕТ Xcode Command Line Tools: xcode-select --install"

step "1. IP в локальной сети"
IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null)"
if [ -z "$IP" ]; then
  echo "IP НЕ НАЙДЕН: подключись к Wi-Fi (или раздай интернет с телефона) и запусти скрипт ещё раз"
  exit 1
fi
echo "IP компьютера: $IP"
sed -i '' -E "s/(export const BACKEND_IP = \")[^\"]*/\1$IP/" src/config.ts
grep -n "BACKEND_IP = " src/config.ts
echo "--- бэкенд по IP (должен быть запущен: go run ./cmd/tire-braking)"
curl -s -m 5 -o /dev/null -w 'API  http://'"$IP"':8080 -> HTTP %{http_code}\n' "http://$IP:8080/api/tire-conditions?limit=1" || echo "API ПО IP НЕДОСТУПЕН"
curl -s -m 5 -D - -o /dev/null -H 'Origin: tauri://localhost' "http://$IP:8080/api/tire-conditions?limit=1" | grep -i "access-control-allow-origin" || echo "НЕТ ЗАГОЛОВКА CORS: перезапусти бэкенд"
curl -s -m 5 "http://$IP:8080/api/tire-conditions?limit=1" | grep -o '"description_en":"[^"]*"' || echo "В ОТВЕТЕ НЕТ description_en: сначала bash run_dops.sh в бэкенде и перезапуск сервера"

step "2. Зависимости"
npm install --no-audit --no-fund || exit 1

step "3. Кодогенерация API из swagger"
if grep -q description_en ../tire-braking-backend/docs/swagger.json; then
  npx swagger-typescript-api generate -p ../tire-braking-backend/docs/swagger.json -o ./src/api -n Api.ts --axios | tail -3
else
  echo "в swagger.json нет description_en — оставляю текущий src/api/Api.ts"
fi

step "4. Сборка Tauri (первая сборка — несколько минут)"
npm run tauri build || { echo "TAURI BUILD FAILED"; exit 1; }

step "5. Готово"
APP="src-tauri/target/release/bundle/macos/BrakePath.app"
ls -d "$APP" && du -sh "$APP"
echo "Запуск: open \"$(pwd)/$APP\""
