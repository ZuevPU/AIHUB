/** Конструктор промптов: одностраничные приложения (SPA) — единый структурированный промпт */

import { artifactsConfig } from './artifactsConfig';

export interface SpaPromptOption {
  id: string;
  text: string;
}

export interface SpaPromptField {
  id: string;
  label: string;
  options: SpaPromptOption[];
}

export interface SpaPromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: SpaPromptField[];
}

/** Значения плейсхолдеров шаблонов артефактов (кроме topic/style — задаются отдельно) */
export const SPA_DEFAULT_TEMPLATE_OPTIONS: Record<string, string> = {
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

/** Подписи к полям параметров шаблона (динамические) */
export const SPA_PLACEHOLDER_LABELS: Record<string, string> = {
  questionsCount: 'Количество вопросов',
  quizFormat: 'Формат вопросов / ответов',
  cardsCount: 'Количество карточек',
  gridSize: 'Размер сетки',
  events: 'События / этапы',
  list1: 'Первый список',
  list2: 'Второй список',
  categories: 'Категории',
  units: 'Единицы измерения',
  wordsCount: 'Количество слов',
  piecesCount: 'Количество элементов',
  metrics: 'Метрики',
  data: 'Данные для графиков',
  columns: 'Колонки канбана',
  centralIdea: 'Центральная идея',
  currency: 'Валюта / ресурс',
  upgrades: 'Улучшения',
  stages: 'Этапы',
  period: 'Период',
  chaptersCount: 'Количество глав',
  termsCount: 'Количество терминов',
  stepsCount: 'Количество шагов',
  slidesCount: 'Количество слайдов',
  formulas: 'Формулы',
  inputs: 'Входные параметры',
  description: 'Описание / сцена',
  ideasCount: 'Количество идей',
  plansCount: 'Количество планов',
  parameters: 'Параметры',
};

export const SPA_TECH_REQUIREMENTS_VANILLA = `=== ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ (VANILLA) ===
• Один HTML-файл (HTML + CSS + JS), без CDN, React, Vue и внешних шрифтов/картинок
• Mobile-first от ~320px; семантика (main, button), ARIA и :focus-visible где нужно
• Без eval(); не использовать innerHTML для пользовательского ввода
• Формы и «отправка» — только клиентская валидация и UI (alert/экран «Спасибо»), без API и серверов
• localStorage — только если нужен прогресс; не обязателен для разового прохождения`;

export const SPA_FILE_STRUCTURE = `=== СТРУКТУРА ФАЙЛА ===
• CSS: переменные (:root), layout, компоненты (кнопки, карточки), состояния
• HTML: контейнер #app (можно пустой) — основной UI рендерится из JS
• JS: constants → state → render() → handlers → init(); короткие комментарии у логики экранов`;

/** Пресеты визуального стиля UI для промпта (плейсхолдер {style}) */
export interface SpaUiStylePreset {
  id: string;
  name: string;
  hint: string;
  value: string;
}

export const SPA_UI_STYLE_PRESETS: SpaUiStylePreset[] = [
  {
    id: 'apple',
    name: 'Apple-like',
    hint: 'воздух, zinc, спокойные акценты',
    value:
      'спокойный Apple-like UI: много белого пространства, system-ui, скругления 12–16px, мягкие тени, палитра zinc/slate, один акцент синий, без визуального шума',
  },
  {
    id: 'cyberpunk',
    name: 'Киберпанк',
    hint: 'неон, тёмный фон, glow',
    value:
      'киберпанк: тёмный фон (#0a0a12), неон cyan и magenta, glow на интерактиве, акценты monospace в заголовках, высокий контраст, карточки с неоновой обводкой',
  },
  {
    id: 'strict',
    name: 'Строгий',
    hint: 'сетка, деловой минимализм',
    value:
      'строгий деловой стиль: светлый фон, чёткая сетка, скругления 4–6px, текст чёрный/серый, акцент navy, без лишних анимаций и декора',
  },
  {
    id: 'light',
    name: 'Светлая',
    hint: 'классическая светлая тема',
    value: 'светлая тема, акцентный цвет синий, контрастные кнопки',
  },
  {
    id: 'dark',
    name: 'Тёмная',
    hint: 'тёмный фон, тёплый акцент',
    value: 'тёмная тема, акцентный цвет оранжевый, светлый текст',
  },
  {
    id: 'minimal',
    name: 'Минимализм',
    hint: 'чёрно-белая база',
    value: 'минимализм, светлая тема, акцент чёрный, максимум типографики',
  },
];

export function resolveSpaUiStyle(styleId: string, styleCustom?: string): string {
  const custom = styleCustom?.trim();
  if (custom) return custom;
  const preset = SPA_UI_STYLE_PRESETS.find((s) => s.id === styleId);
  if (preset) return preset.value;
  const legacy = artifactsConfig.defaults.styles.find((s) => s.id === styleId);
  return legacy?.value ?? SPA_UI_STYLE_PRESETS[0].value;
}

export const SPA_QUALITY_OPTIONS: { id: string; text: string }[] = [
  { id: 'sq2', text: 'валидация форм и понятные сообщения об ошибках' },
  { id: 'sq3', text: 'localStorage для прогресса, если сценарий это предполагает' },
  { id: 'sq5', text: 'понятные пустые состояния и граничные случаи (нет данных, сброс)' },
  { id: 'sq6', text: 'touch targets не менее 44px на мобильных' },
];

/** Быстрые пресеты сценария (категория, тип, мета, тема по умолчанию) */
export interface SpaQuickPreset {
  id: string;
  label: string;
  description: string;
  category: string;
  type: string;
  style: string;
  topic: string;
  meta: Record<string, string>;
}

export const SPA_QUICK_PRESETS: SpaQuickPreset[] = [
  {
    id: 'trainer',
    label: 'Тренажёр',
    description: 'Тест с баллами и обратной связью',
    category: 'education',
    type: 'quiz',
    style: 'apple',
    topic: 'Цифровая грамотность: безопасность в интернете',
    meta: {
      role: 'ученика (тренажёр, самопроверка)',
      goal: 'обучение и проверка знаний',
      complexity: 'средняя (расширенные функции, 3–5 блоков)',
    },
  },
  {
    id: 'landing',
    label: 'Лендинг',
    description: 'Продукт или мероприятие, секции и форма',
    category: 'business',
    type: 'product_landing',
    style: 'minimal',
    topic: 'Образовательная платформа для педагогов',
    meta: {
      role: 'широкой аудитории (лендинг, квиз)',
      goal: 'демонстрация и вовлечение',
      complexity: 'средняя (расширенные функции, 3–5 блоков)',
    },
  },
  {
    id: 'event',
    label: 'Страница мероприятия',
    description: 'Программа, регистрация, таймер',
    category: 'marketing',
    type: 'event_landing',
    style: 'apple',
    topic: 'Мастер-класс по работе с нейросетями',
    meta: {
      role: 'широкой аудитории (лендинг, квиз)',
      goal: 'демонстрация и вовлечение',
      complexity: 'высокая (полный функционал, много секций)',
    },
  },
  {
    id: 'dashboard',
    label: 'Дашборд',
    description: 'Метрики и фильтры на demo-данных',
    category: 'data',
    type: 'dashboard',
    style: 'corporate',
    topic: 'Показатели образовательного проекта',
    meta: {
      role: 'команды (рабочий инструмент)',
      goal: 'презентация данных или отчёта',
      complexity: 'высокая (полный функционал, много секций)',
    },
  },
];

export const SPA_NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'sn1', text: 'внешние API, ключи и запросы к сторонним сервисам' },
  { id: 'sn2', text: 'eval() и небезопасный innerHTML с пользовательским вводом' },
  { id: 'sn3', text: 'React, Vue, фреймворки и подключение через CDN' },
  { id: 'sn4', text: 'заглушки TODO вместо рабочей логики' },
  { id: 'sn5', text: 'зависимость от внешних шрифтов и картинок (кроме data URI при необходимости)' },
];

export const spaPromptSections: SpaPromptSection[] = [
  {
    id: 'role',
    label: 'Аудитория контента',
    icon: '🔴',
    why: 'Для кого материал на странице — тон текстов, примеры и плотность UI.',
    fields: [
      {
        id: 'role',
        label: 'Кто пользователь',
        options: [
          { id: 'r1', text: 'преподавателя (урок, демонстрация)' },
          { id: 'r2', text: 'ученика (тренажёр, самопроверка)' },
          { id: 'r3', text: 'команды (рабочий инструмент)' },
          { id: 'r4', text: 'широкой аудитории (лендинг, квиз)' },
        ],
      },
    ],
  },
  {
    id: 'goal',
    label: 'Цель продукта',
    icon: '🟠',
    why: 'Зачем страница — обучение, демо или прикладная задача.',
    fields: [
      {
        id: 'goal',
        label: 'Цель',
        options: [
          { id: 'g1', text: 'обучение и проверка знаний' },
          { id: 'g2', text: 'демонстрация и вовлечение' },
          { id: 'g3', text: 'рабочий инструмент (данные, задачи)' },
          { id: 'g4', text: 'презентация данных или отчёта' },
        ],
      },
    ],
  },
  {
    id: 'complexity',
    label: 'Сложность реализации',
    icon: '🟡',
    why: 'Задаёт объём кода в промпте. Не скрывает типы приложений: «Своя игра» и «Миллионер» остаются в списке Игр на любой сложности.',
    fields: [
      {
        id: 'complexity',
        label: 'Уровень',
        options: [
          { id: 'c1', text: 'простая (базовые функции, мало блоков)' },
          { id: 'c2', text: 'средняя (расширенные функции, 3–5 блоков)' },
          { id: 'c3', text: 'высокая (полный функционал, много секций)' },
        ],
      },
    ],
  },
];

export function extractPlaceholderKeys(template: string): string[] {
  const re = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) {
    set.add(m[1]);
  }
  return [...set];
}

/** Поля шаблона, которые задаются глобально (не в блоке «Параметры типа») */
const GLOBAL_PLACEHOLDER_KEYS = new Set(['topic', 'style']);

export function getTemplateOptionKeysForUi(template: string): string[] {
  return extractPlaceholderKeys(template).filter((k) => !GLOBAL_PLACEHOLDER_KEYS.has(k));
}

function getStyleValue(styleId: string, styleCustom?: string): string {
  return resolveSpaUiStyle(styleId, styleCustom);
}

function complexityTextToKey(text: string): 'simple' | 'medium' | 'complex' {
  if (text.includes('средняя')) return 'medium';
  if (text.includes('высокая')) return 'complex';
  return 'simple';
}

export function getComplexityKeyFromMeta(complexityText: string): 'simple' | 'medium' | 'complex' {
  return complexityTextToKey(complexityText);
}

export const COMPLEXITY_OPTION_TEXT: Record<'simple' | 'medium' | 'complex', string> = {
  simple: 'простая (базовые функции, мало блоков)',
  medium: 'средняя (расширенные функции, 3–5 блоков)',
  complex: 'высокая (полный функционал, много секций)',
};

/** Список типов категории всегда полный. Сложность не прячет карточки. */
export function filterArtifactTypesByComplexity<
  T extends { id: string; complexity: ('simple' | 'medium' | 'complex')[] },
>(types: T[]): T[] {
  return types;
}

const TYPE_ACCEPTANCE_HINT: Partial<Record<string, string>> = {
  quiz: 'Ответы проверяются, баллы и итоговый результат считаются корректно.',
  matching: 'Сопоставление пар работает; есть обратная связь по результату.',
  timeline: 'Порядок событий можно восстановить; подсказки или проверка логичны.',
  flashcards: 'Переворот карточек и прогресс отображаются корректно.',
  crossword: 'Ввод букв и проверка слов соответствуют сетке.',
  worksheet: 'Разные типы заданий проверяются; итоговый счёт верен.',
  calculator: 'Формулы дают ожидаемый результат на тестовых вводах.',
  dashboard: 'Метрики и фильтры (если есть) обновляют отображение без ошибок.',
  charts: 'Диаграммы отражают переданные данные; подсказки не ломают вёрстку.',
  kanban: 'Drag-and-drop между колонками работает; состояние сохраняется при необходимости.',
  memory: 'Пары совпадают; счётчик ходов и окончание игры корректны.',
  jeopardy: 'Выбор ячейки открывает вопрос; очки суммируются.',
  clicker: 'Ресурсы и улучшения не уходят в отрицательные значения без задумки.',
  survey: 'Ответы сохраняются локально или экспортируются в текст/JSON без API.',
  quiz_landing: 'Шаги квиза и форма на финале работают; email — только клиентская валидация.',
  product_landing: 'Якорная навигация и форма заявки работают на мобильном (без отправки на сервер).',
  converter: 'Пересчёт единиц совпадает с ожидаемыми коэффициентами.',
};

function getAcceptanceLines(typeId: string): string[] {
  const specific = TYPE_ACCEPTANCE_HINT[typeId];
  const base = [
    'Приложение работает в одном HTML-файле без подключения внешних скриптов.',
    'В консоли браузера нет ошибок при основном сценарии использования.',
    'Вёрстка читаема на ширине ~320px и на широком экране.',
  ];
  if (specific) {
    return [...base, specific];
  }
  return [...base, 'Основной пользовательский сценарий выполняется полностью, без «заглушек».'];
}

export function buildSpaPrompt(params: {
  category: string;
  type: string;
  styleId: string;
  styleCustom?: string;
  topic: string;
  /** Переопределения плейсхолдеров шаблона (кроме topic/style в шаблоне — topic берётся отдельно) */
  templateOptions: Record<string, string>;
  values: Record<string, string>;
  custom: Record<string, string>;
  enhance?: boolean;
}): string {
  const { category, type, styleId, styleCustom, topic, templateOptions, values, custom, enhance } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const categoryData = artifactsConfig.categories.find((c) => c.id === category);
  const typeData = categoryData?.types.find((t) => t.id === type);

  if (!typeData) {
    return 'Ошибка: тип артефакта не найден';
  }

  const audience = v('role', 'ученика (тренажёр, самопроверка)');
  const goal = v('goal', 'обучение и проверка знаний');
  const complexityText = v('complexity', 'средняя (расширенные функции, 3–5 блоков)');
  const cKey = complexityTextToKey(complexityText);
  const cDef = artifactsConfig.defaults.complexity[cKey];
  const complexityLine = `уровень: ${complexityText}; ориентир: секций ~${cDef.sections}, ${cDef.features} возможности`;

  const styleValue = getStyleValue(styleId, styleCustom);

  const merged = { ...SPA_DEFAULT_TEMPLATE_OPTIONS, ...templateOptions };
  const topicResolved = topic.trim() || merged.topic;

  let taskBlock = typeData.promptTemplate;
  taskBlock = taskBlock.replace(/\{topic\}/g, topicResolved);
  taskBlock = taskBlock.replace(/\{style\}/g, styleValue);

  for (const [key, val] of Object.entries(merged)) {
    if (key !== 'topic') {
      taskBlock = taskBlock.replace(new RegExp(`\\{${key}\\}`, 'g'), val);
    }
  }

  const qualityExtra = SPA_QUALITY_OPTIONS.map((q) => `- ${q.text}`);
  const negLine = SPA_NEGATIVE_OPTIONS.map((n) => n.text).join(', ');

  let rulesBlock = `=== ПРАВИЛА ===
- Пиши только рабочий код; не оставляй нереализованные критичные части
- Не подключай фреймворки и CDN; один файл
- Учитывай ограничения сложности: ${complexityLine}`;

  if (qualityExtra.length) {
    rulesBlock += '\n' + qualityExtra.join('\n');
  }

  if (enhance) {
    rulesBlock +=
      '\n- Усиль UX: экран «Старт» и финал с итогом где уместно; граничные случаи; комментарии к state/render';
  }

  const acceptanceLines = getAcceptanceLines(type).map((line) => `- ${line}`).join('\n');

  const outputInstruction =
    type === 'quiz' || type === 'worksheet' || type === 'flashcards'
      ? '\nСначала выведи готовый полный код одного HTML-файла. Без пояснений до кода.\n'
      : '';

  const header = `Ты — senior frontend-разработчик одностраничных образовательных приложений (vanilla HTML/CSS/JS). Пишешь один автономный файл для предпросмотра в браузере / режима «Артефакты».

Аудитория контента: ${audience}.
Цель продукта: ${goal}.
Сложность: ${complexityLine}
Визуальный стиль UI: ${styleValue}.
Тема / предметная область: ${topicResolved}.
Формат: ${categoryData?.name ?? category} → ${typeData.name}.

`;

  const partCore = `${header}=== ЗАДАЧА ===
${taskBlock}

${SPA_TECH_REQUIREMENTS_VANILLA}

${SPA_FILE_STRUCTURE}

=== КРИТЕРИИ ПРИЁМКИ ===
${acceptanceLines}

`;

  const full = `${partCore}${rulesBlock}

Исключить: ${negLine}${outputInstruction}`;

  return full.trim();
}

export function getInitialSpaSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of spaPromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) {
        s[field.id] = field.options[0].text;
      }
    }
  }
  return s;
}
