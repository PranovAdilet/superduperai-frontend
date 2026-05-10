#!/bin/bash
# Скрипт для загрузки статических файлов Next.js в Cloudflare R2 через Wrangler

# Проверка, установлен ли глобально wrangler
if ! command -v wrangler &> /dev/null; then
    echo "Wrangler не установлен. Устанавливаем глобально..."
    npm install -g wrangler
fi

# Настройки R2
BUCKET_NAME="superduperai"
R2_TOKEN=
CDN_DOMAIN="https://cdn.superduperai.co"

# Директория со статическими файлами
STATIC_DIR=".next/static"

echo "Загрузка статических файлов в Cloudflare R2..."

# Устанавливаем переменную окружения для аутентификации Wrangler
export CLOUDFLARE_API_TOKEN="$R2_TOKEN"

# Находим все файлы в директории .next/static и загружаем в R2
find "$STATIC_DIR" -type f | while read -r file; do
  # Получаем относительный путь файла от .next/static
  rel_path="${file#$STATIC_DIR/}"
  # Формируем путь назначения в R2
  r2_path="_next/static/$rel_path"
  
  echo "Загрузка $file в $r2_path"
  wrangler r2 object put "$BUCKET_NAME/$r2_path" --file="$file" --remote
done

echo "Загрузка завершена!"
echo "Статические файлы доступны по адресу: $CDN_DOMAIN/_next/static/" 