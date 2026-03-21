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
• Единый HTML-файл (HTML + CSS + JS в одном файле)
• Без внешних зависимостей, CDN и библиотек
• Адаптивность под мобильные устройства (от ~320px)
• Сохранение данных в localStorage, если нужно сохранять состояние
• Валидация полей форм, если есть ввод данных
• Плавные анимации и переходы там, где уместно
• Семантическая вёрстка и доступность (ARIA, фокус, контраст)`;

export const SPA_QUALITY_OPTIONS: { id: string; text: string }[] = [
  { id: 'sq1', text: 'семантическая вёрстка и доступность (ARIA)' },
  { id: 'sq2', text: 'валидация форм и понятные сообщения об ошибках' },
  { id: 'sq3', text: 'localStorage для прогресса и настроек, где уместно' },
  { id: 'sq4', text: 'адаптивная вёрстка под мобильные и десктоп' },
  { id: 'sq5', text: 'понятные состояния загрузки и пустых данных' },
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
    label: 'Контекст и роль',
    icon: '🔴',
    why: 'Для кого SPA — от этого зависят тон, сложность UX и примеры контента.',
    fields: [
      {
        id: 'role',
        label: 'Роль / аудитория',
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
    why: 'Согласовано с объёмом секций и функций в одном файле.',
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

function getStyleValue(styleId: string): string {
  const style = artifactsConfig.defaults.styles.find((s) => s.id === styleId);
  return style ? style.value : 'светлая тема, акцентный цвет синий';
}

function complexityTextToKey(text: string): 'simple' | 'medium' | 'complex' {
  if (text.includes('средняя')) return 'medium';
  if (text.includes('высокая')) return 'complex';
  return 'simple';
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
  survey: 'Ответы сохраняются или экспортируются согласно задумке.',
  quiz_landing: 'Все шаги квиза и форма на финале работают; валидация email (если есть).',
  product_landing: 'Якорная навигация и форма заявки работают на мобильном.',
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
  topic: string;
  /** Переопределения плейсхолдеров шаблона (кроме topic/style в шаблоне — topic берётся отдельно) */
  templateOptions: Record<string, string>;
  values: Record<string, string>;
  custom: Record<string, string>;
  qualityIds: string[];
  negativeIds: string[];
  enhance?: boolean;
}): string {
  const { category, type, styleId, topic, templateOptions, values, custom, qualityIds, negativeIds, enhance } =
    params;

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

  const role = v('role', 'разработчика');
  const goal = v('goal', 'создание рабочего прототипа');
  const complexityText = v('complexity', 'средняя (расширенные функции, 3–5 блоков)');
  const cKey = complexityTextToKey(complexityText);
  const cDef = artifactsConfig.defaults.complexity[cKey];
  const complexityLine = `уровень: ${complexityText}; ориентир: секций ~${cDef.sections}, ${cDef.features} возможности`;

  const topicValue = topic.trim() || SPA_DEFAULT_TEMPLATE_OPTIONS.topic;
  const styleValue = getStyleValue(styleId);

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

  const qualityExtra = SPA_QUALITY_OPTIONS.filter((q) => qualityIds.includes(q.id)).map((q) => `- ${q.text}`);
  const negTexts = SPA_NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map((n) => n.text);
  const negLine = negTexts.length ? negTexts.join(', ') : 'не задано';

  let rulesBlock = `=== ПРАВИЛА ===
- Пиши только рабочий код; не оставляй нереализованные критичные части
- Не подключай фреймворки и CDN; один файл
- Учитывай ограничения сложности: ${complexityLine}`;

  if (qualityExtra.length) {
    rulesBlock += '\n' + qualityExtra.join('\n');
  }

  if (enhance) {
    rulesBlock +=
      '\n- Усиль UX: пустые состояния, граничные случаи (ноль, максимум), краткие комментарии к ключевой логике в коде';
  }

  const acceptanceLines = getAcceptanceLines(type).map((line) => `- ${line}`).join('\n');

  const header = `Ты — разработчик одностраничного приложения (SPA) для контекста: ${role}.
Цель продукта: ${goal}.
Сложность: ${complexityLine}
Визуальный стиль UI: ${styleValue}.
Тема / предметная область: ${topicResolved}.
Категория артефакта: ${categoryData?.name ?? category}. Тип: ${typeData.name}.

`;

  const partCore = `${header}=== ЗАДАЧА ===
${taskBlock}

${SPA_TECH_REQUIREMENTS_VANILLA}

=== КРИТЕРИИ ПРИЁМКИ ===
${acceptanceLines}

`;

  const full = `${partCore}
${rulesBlock}

Исключить: ${negLine}`;

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
