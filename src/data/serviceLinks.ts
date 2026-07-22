export interface ServiceLink {
  id: string;
  label: string;
  url: string;
}

export const SERVICE_LINKS = {
  image: [
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
    { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  ],
  video: [
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
    { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  ],
  presentation: [
    { id: 'gamma', label: 'Gamma', url: 'https://gamma.app/' },
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  ],
  analytics: [
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
    { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
    { id: 'alicepro', label: 'Алиса Про', url: 'https://alicepro.yandex.ru/expert' },
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
    { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  ],
  editor: [
    { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
    { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
    { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/' },
  ],
  developer: [
    { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
    { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
    { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
    { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  ],
} as const satisfies Record<string, readonly ServiceLink[]>;

export type ServiceLinksKey = keyof typeof SERVICE_LINKS;

export const DEVELOPER_ALGORITHM_STEPS = [
  'Откройте интерфейс Qwen',
  'Выберите режим: «Веб-разработка» или «Артефакты»',
  'Добавьте задачу: прикрепите файл при необходимости',
  'Введите промпт и дождитесь генерации — ИИ создаст HTML/CSS/JS код',
  'Нажмите «Предварительный просмотр» или «Запустить», чтобы увидеть приложение прямо в чате',
  'Протестируйте приложение: проверьте работу кнопок и полей ввода, убедитесь, что логика верна — математическая и алгоритмическая',
  'Напишите правки агенту: «Исправь ошибку в расчёте» или «Сделай кнопку больше»',
  'Нажмите «Развернуть», чтобы открыть приложение на весь экран без интерфейса чата',
  'Скопируйте ссылку из адресной строки или через вкладку «Поделиться»',
  'Отправьте готовый продукт или разместите у себя на хостинге (это уже совсем другая история)',
] as const;

export const EXAMPLE_CAPTIONS: Record<string, string> = {
  prompt_008: 'Пример ответа нейросети Qwen по промпту «12 углов подачи темы»',
  prompt_009: 'Пример ответа нейросети Qwen по промпту «3 структуры сценария»',
  prompt_010: 'Пример ответа нейросети Qwen по промпту «10 альтернативных подач без клише»',
};

export const BUILDER_ROUTES: Record<string, string> = {
  prompt_007: '/manager/analytics-prompt-builder',
  prompt_012: '/designer/video-prompt-builder',
  prompt_020: '/designer/presentation-prompt-builder',
  prompt_036: '/designer/prompt-builder',
  prompt_030: '/developer/single-page-apps',
  prompt_031: '/developer/single-page-apps',
  prompt_032: '/developer/single-page-apps',
  prompt_033: '/developer/single-page-apps',
  prompt_034: '/developer/single-page-apps',
  prompt_035: '/developer/single-page-apps',
};
