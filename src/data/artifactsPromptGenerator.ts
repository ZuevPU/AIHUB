import { artifactsConfig } from './artifactsConfig';

export interface ArtifactSelections {
  category: string;
  type: string;
  style: string;
  topic: string;
  options?: Record<string, string>;
}

const DEFAULT_OPTIONS: Record<string, string> = {
  topic: 'указанная тема',
  questionsCount: '10',
  cardsCount: '20',
  gridSize: '15x15',
  events: 'ключевые события',
  list1: 'первый список',
  list2: 'второй список',
  categories: '5 категорий',
  units: 'основные единицы',
  ideasCount: '50',
  wordsCount: '30',
  piecesCount: '16',
  metrics: 'ключевые метрики',
  data: 'пример данных',
  columns: 'Нужно сделать, В работе, Готово',
  centralIdea: 'центральная идея',
  currency: 'монеты',
  upgrades: '5 улучшений',
  stages: '5 этапов',
  plansCount: '3',
  period: 'месяц',
  chaptersCount: '10',
  termsCount: '50',
  stepsCount: '10',
  slidesCount: '8',
  parameters: 'основные параметры',
  formulas: 'необходимые формулы',
  inputs: 'входные параметры',
  quizFormat: 'выбор одного правильного ответа из 4 вариантов',
  description: 'описание сцены',
};

function getStyleValue(styleId: string): string {
  const style = artifactsConfig.defaults.styles.find((s) => s.id === styleId);
  return style ? style.value : 'светлая тема, акцентный цвет синий';
}

export function generatePrompt(selections: ArtifactSelections): string {
  const { category, type, style, topic, options = {} } = selections;

  const categoryData = artifactsConfig.categories.find((c) => c.id === category);
  const typeData = categoryData?.types.find((t) => t.id === type);

  if (!typeData) return 'Ошибка: тип артефакта не найден';

  let prompt = typeData.promptTemplate;

  const merged = { ...DEFAULT_OPTIONS, ...options };
  const topicValue = topic.trim() || merged.topic;
  const styleValue = getStyleValue(style);

  prompt = prompt.replace(/\{topic\}/g, topicValue);
  prompt = prompt.replace(/\{style\}/g, styleValue);

  for (const [key, value] of Object.entries(merged)) {
    if (key !== 'topic') {
      prompt = prompt.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
  }

  prompt += '\n\nТехнические требования:';
  prompt += '\n• Единый HTML-файл (HTML + CSS + JS в одном файле)';
  prompt += '\n• Без внешних зависимостей и библиотек';
  prompt += '\n• Адаптивность под мобильные устройства';
  prompt += '\n• Сохранение данных в localStorage (если применимо)';
  prompt += '\n• Валидация форм (если есть формы)';
  prompt += '\n• Плавные анимации и переходы';
  prompt += '\n• Семантическая вёрстка, доступность (ARIA)';

  return prompt;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function randomizeSelections(): ArtifactSelections {
  const categories = artifactsConfig.categories;
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomType = randomCategory.types[Math.floor(Math.random() * randomCategory.types.length)];
  const styles = artifactsConfig.defaults.styles;
  const randomStyle = styles[Math.floor(Math.random() * styles.length)].id;

  return {
    category: randomCategory.id,
    type: randomType.id,
    style: randomStyle,
    topic: '',
  };
}
