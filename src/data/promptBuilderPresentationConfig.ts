/** Конструктор промптов для презентаций: цель → аудитория → содержание → структура → визуал → ТЗ */

export interface PresPromptOption {
  id: string;
  text: string;
}

export interface PresPromptField {
  id: string;
  label: string;
  options: PresPromptOption[];
}

export interface PresPromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: PresPromptField[];
}

export const PRESENTATION_NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'overload', text: 'перегруженные слайды' },
  { id: 'wall', text: 'много текста на слайде' },
  { id: 'read', text: 'плохая читаемость' },
  { id: 'fonts', text: 'более 2 шрифтов' },
];

export const presentationSlideContentOptions: { id: string; text: string }[] = [
  { id: 'txt', text: 'текст' },
  { id: 'img', text: 'изображения' },
  { id: 'chart', text: 'диаграммы' },
  { id: 'vid', text: 'видео' },
];

export const presentationPromptSections: PresPromptSection[] = [
  {
    id: 'purpose',
    label: 'Смысл и цель',
    icon: '🔴',
    why: 'Задаёт зачем презентация — без этого ИИ не знает, убеждать или обучать.',
    fields: [
      {
        id: 'presType',
        label: 'Тип',
        options: [
          { id: 'pt1', text: 'обучение' },
          { id: 'pt2', text: 'отчёт' },
          { id: 'pt3', text: 'презентация проекта' },
          { id: 'pt4', text: 'питч' },
        ],
      },
      {
        id: 'presGoal',
        label: 'Цель',
        options: [
          { id: 'pg1', text: 'объяснить материал' },
          { id: 'pg2', text: 'убедить аудиторию' },
          { id: 'pg3', text: 'показать результат' },
          { id: 'pg4', text: 'научить навыку' },
        ],
      },
    ],
  },
  {
    id: 'audience',
    label: 'Аудитория',
    icon: '🟠',
    why: 'Влияет на язык, плотность текста и размер шрифта.',
    fields: [
      {
        id: 'audienceWho',
        label: 'Кто',
        options: [
          { id: 'aw1', text: 'педагоги' },
          { id: 'aw2', text: 'руководители' },
          { id: 'aw3', text: 'родители учащихся' },
          { id: 'aw4', text: 'студенты' },
        ],
      },
      {
        id: 'audienceLevel',
        label: 'Уровень',
        options: [
          { id: 'al1', text: 'новичок' },
          { id: 'al2', text: 'средний' },
          { id: 'al3', text: 'эксперт' },
        ],
      },
      {
        id: 'audienceContext',
        label: 'Контекст',
        options: [
          { id: 'ac1', text: 'онлайн' },
          { id: 'ac2', text: 'офлайн' },
          { id: 'ac3', text: 'офлайн-просмотр' },
        ],
      },
    ],
  },
  {
    id: 'content',
    label: 'Содержание',
    icon: '🟡',
    why: 'Самый важный блок: формат подачи и опорные тезисы — структура мышления, не абстракция.',
    fields: [
      {
        id: 'deliveryFormat',
        label: 'Формат подачи',
        options: [
          { id: 'df1', text: '1 идея = 1 слайд' },
          { id: 'df2', text: 'тезисы' },
          { id: 'df3', text: 'кейсы' },
          { id: 'df4', text: 'пошаговое объяснение' },
        ],
      },
      {
        id: 'mainMessage',
        label: 'Главный месседж (кратко)',
        options: [
          { id: 'mm1', text: 'один чёткий тезис на всю презентацию' },
          { id: 'mm2', text: 'проблема и путь решения' },
          { id: 'mm3', text: 'результат и выгода для аудитории' },
        ],
      },
      {
        id: 'keyTheses',
        label: 'Ключевые тезисы',
        options: [
          { id: 'kt1', text: '3 ключевых тезиса' },
          { id: 'kt2', text: '5 ключевых тезисов' },
          { id: 'kt3', text: '3–5 тезисов' },
        ],
      },
    ],
  },
  {
    id: 'structure',
    label: 'Структура презентации',
    icon: '🟢',
    why: 'Как выстроен рассказ: от модуля до story — плюс логика начало / середина / конец.',
    fields: [
      {
        id: 'structureType',
        label: 'Тип структуры',
        options: [
          { id: 'st1', text: 'обучение (модульная): цели → теория → практика → рефлексия' },
          { id: 'st2', text: 'проблема → решение' },
          { id: 'st3', text: 'storytelling' },
          { id: 'st4', text: 'отчёт: итоги → метрики → выводы' },
        ],
      },
      {
        id: 'structureArc',
        label: 'Ход повествования',
        options: [
          { id: 'sa1', text: 'введение → развитие → завершение' },
          { id: 'sa2', text: 'захват внимания → раскрытие → призыв к действию' },
          { id: 'sa3', text: 'контекст → суть → следующие шаги' },
        ],
      },
    ],
  },
  {
    id: 'visual',
    label: 'Визуальный стиль',
    icon: '🔵',
    why: 'Общий характер картинки и сколько текста на слайде.',
    fields: [
      {
        id: 'visualStyle',
        label: 'Стиль',
        options: [
          { id: 'vs1', text: 'минимализм' },
          { id: 'vs2', text: 'образовательный' },
          { id: 'vs3', text: 'технологичный' },
          { id: 'vs4', text: 'инфографика' },
          { id: 'vs5', text: 'исторический' },
        ],
      },
      {
        id: 'density',
        label: 'Плотность текста',
        options: [
          { id: 'dn1', text: 'мало текста' },
          { id: 'dn2', text: 'средне' },
          { id: 'dn3', text: 'много текста' },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Оформление',
    icon: '🟣',
    why: 'Типографика, цвет и сетка — единый блок, без лишнего дробления.',
    fields: [
      {
        id: 'typography',
        label: 'Типографика',
        options: [
          { id: 'ty1', text: 'крупная' },
          { id: 'ty2', text: 'стандартная' },
        ],
      },
      {
        id: 'colorScheme',
        label: 'Цвет',
        options: [
          { id: 'cs1', text: 'светлая тема' },
          { id: 'cs2', text: 'тёмная тема' },
          { id: 'cs3', text: 'корпоративная палитра' },
          { id: 'cs4', text: 'светлая схема (синий + оранжевый акценты)' },
        ],
      },
      {
        id: 'composition',
        label: 'Композиция',
        options: [
          { id: 'cp1', text: 'с воздухом' },
          { id: 'cp2', text: 'плотная' },
          { id: 'cp3', text: 'сбалансированная' },
        ],
      },
    ],
  },
];

/** Технический блок (свёрнутый в UI) */
export const presentationTechnicalFields: PresPromptField[] = [
  {
    id: 'fileFormat',
    label: 'Формат файла',
    options: [
      { id: 'ff1', text: 'pptx' },
      { id: 'ff2', text: 'pdf' },
    ],
  },
  {
    id: 'aspectRatio',
    label: 'Размер (соотношение)',
    options: [
      { id: 'ar1', text: '16:9' },
      { id: 'ar2', text: '4:3' },
    ],
  },
  {
    id: 'fileWeight',
    label: 'Вес / оптимизация',
    options: [
      { id: 'fw1', text: 'лёгкий файл, оптимизация изображений' },
      { id: 'fw2', text: 'стандартный размер' },
      { id: 'fw3', text: 'без жёстких ограничений по весу' },
    ],
  },
];

export function buildPresentationPrompt(params: {
  values: Record<string, string>;
  custom: Record<string, string>;
  slideContentIds: string[];
  negativeIds: string[];
  includeTechnical: boolean;
  enhance?: boolean;
}): string {
  const { values, custom, slideContentIds, negativeIds, includeTechnical, enhance } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const topicTheme = custom.topicTheme?.trim() || '';

  const presType = v('presType');
  const presGoal = v('presGoal');
  const audienceWho = v('audienceWho');
  const audienceLevel = v('audienceLevel');
  const audienceContext = v('audienceContext');
  const deliveryFormat = v('deliveryFormat');
  const mainMessage = v('mainMessage');
  const keyTheses = v('keyTheses');
  const structureType = v('structureType');
  const structureArc = v('structureArc');
  const visualStyle = v('visualStyle');
  const density = v('density');
  const typography = v('typography');
  const colorScheme = v('colorScheme');
  const composition = v('composition');

  const fileFormat = v('fileFormat');
  const aspectRatio = v('aspectRatio');
  const fileWeight = v('fileWeight');

  const slideLabels = presentationSlideContentOptions
    .filter((o) => slideContentIds.includes(o.id))
    .map((o) => o.text);
  const slideContentLine = slideLabels.length ? slideLabels.join(', ') : 'текст, изображения';

  let structureLine = structureType;
  if (structureArc) {
    structureLine = `${structureType}; ход: ${structureArc}`;
  }

  if (enhance) {
    structureLine += ' (усилить нарратив: введение — кульминация — вывод; короткие формулировки на слайдах)';
  }

  let designLine = `типографика ${typography}, ${colorScheme}, композиция ${composition}`;
  if (enhance) {
    designLine += ', единый визуальный ритм';
  }

  const negTexts = PRESENTATION_NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map((n) => n.text);

  const parts: string[] = ['Создай презентацию.'];
  if (topicTheme) {
    parts.push(`Тема: ${topicTheme}`);
  }
  parts.push('');

  parts.push(`Цель: ${presType} — ${presGoal}`);
  parts.push('');
  parts.push(
    `Аудитория: ${audienceWho}, уровень: ${audienceLevel}, формат: ${audienceContext}`
  );
  parts.push('');
  parts.push(
    `Содержание: ${deliveryFormat}, главный месседж: ${mainMessage}, ключевые тезисы: ${keyTheses}`
  );
  parts.push('');
  parts.push(`Структура: ${structureLine}`);
  parts.push('');
  parts.push(`Визуальный стиль: ${visualStyle}, плотность: ${density}`);
  parts.push('');
  parts.push(`Оформление: ${designLine}`);
  parts.push('');
  parts.push(`Контент слайдов: ${slideContentLine}`);

  if (includeTechnical) {
    parts.push('');
    parts.push(
      `Технические требования: формат ${fileFormat}, ${aspectRatio}, ${fileWeight}`
    );
  }

  parts.push('');
  parts.push(`Исключить: ${negTexts.length ? negTexts.join(', ') : 'не задано'}`);

  if (enhance) {
    parts.push('');
    parts.push(
      '[Усиление] Добавь лёкий сторителлинг в подаче, усиль логику разделов, минимизируй воду в тексте слайдов.'
    );
  }

  return parts.join('\n').trim();
}

export function getInitialPresentationSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of presentationPromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) s[field.id] = field.options[0].text;
    }
  }
  for (const field of presentationTechnicalFields) {
    if (field.options.length > 0) s[field.id] = field.options[0].text;
  }
  return s;
}
