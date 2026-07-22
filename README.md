# ИИ Каталог

Каталог промптов и ИИ-инструментов с интерактивными конструкторами промптов.

**Production:** https://aihub-three-kappa.vercel.app

## Запуск локально

**Требования:** Node.js 18+

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
3. Откройте http://localhost:3000

## Сборка

```bash
npm run build
npm run preview
```

## Встраивание через iframe

```html
<iframe
  src="https://aihub-three-kappa.vercel.app/designer/prompt-builder"
  allow="clipboard-write"
  width="100%"
  height="800"
  style="border:0;"
></iframe>
```

При использовании `sandbox` добавьте `allow-scripts allow-same-origin allow-forms`.

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер на порту 3000 |
| `npm run build` | Production-сборка в `dist/` |
| `npm run lint` | Проверка TypeScript |
| `npm run lint:all` | TypeScript + ESLint |
| `npm run format` | Prettier |
