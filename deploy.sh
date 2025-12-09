#!/bin/bash

# Сборка проекта
npm run build

# Создание файла .nojekyll (важно для SPA)
touch dist/.nojekyll

# Переход в директорию сборки
cd dist

# Инициализация git в папке dist
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# Отправка в ветку gh-pages
git push -f git@github.com:YOUR_USERNAME/weather-dashboard.git main:gh-pages

cd -