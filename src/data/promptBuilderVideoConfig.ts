/** Конструктор видео-промптов: UI → логика → шаблон → результат */

export interface VideoPromptOption {
  id: string;
  text: string;
}

export interface VideoPromptField {
  id: string;
  label: string;
  options: VideoPromptOption[];
}

export interface VideoPromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: VideoPromptField[];
}

export const VIDEO_NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'artifacts', text: 'артефакты' },
  { id: 'distort', text: 'искажения' },
  { id: 'jitter', text: 'дёрганое движение' },
  { id: 'badq', text: 'плохое качество' },
  { id: 'text', text: 'текст на экране' },
];

export const videoPromptSections: VideoPromptSection[] = [
  {
    id: 'scene',
    label: 'Смысл сцены',
    icon: '🔴',
    why: 'Задаёт, что происходит в кадре — основа для драматургии и смысла ролика.',
    fields: [
      {
        id: 'subject',
        label: 'Субъект (кто)',
        options: [
          { id: 's1', text: 'учитель' },
          { id: 's2', text: 'ученик' },
          { id: 's3', text: 'человек' },
          { id: 's4', text: 'группа людей' },
        ],
      },
      {
        id: 'context',
        label: 'Контекст (где)',
        options: [
          { id: 'c1', text: 'школьном классе' },
          { id: 'c2', text: 'школе' },
          { id: 'c3', text: 'городе' },
          { id: 'c4', text: 'на природе' },
          { id: 'c5', text: 'офисе' },
        ],
      },
      {
        id: 'action',
        label: 'Действие (что делает)',
        options: [
          { id: 'a1', text: 'объясняет материал' },
          { id: 'a2', text: 'идёт' },
          { id: 'a3', text: 'говорит' },
          { id: 'a4', text: 'показывает' },
          { id: 'a5', text: 'работает за компьютером' },
        ],
      },
      {
        id: 'mood',
        label: 'Настроение',
        options: [
          { id: 'm1', text: 'вдохновляющее' },
          { id: 'm2', text: 'спокойное' },
          { id: 'm3', text: 'деловое' },
          { id: 'm4', text: 'динамичное' },
          { id: 'm5', text: 'напряжённое' },
        ],
      },
    ],
  },
  {
    id: 'dynamics',
    label: 'Динамика',
    icon: '🟠',
    why: 'Определяет, как развивается сцена — от статики до мини-истории.',
    fields: [
      {
        id: 'motionType',
        label: 'Тип движения',
        options: [
          { id: 'mt1', text: 'статично' },
          { id: 'mt2', text: 'лёгкое движение' },
          { id: 'mt3', text: 'активное движение' },
        ],
      },
      {
        id: 'whatMoves',
        label: 'Что движется',
        options: [
          { id: 'wm1', text: 'человек' },
          { id: 'wm2', text: 'камера' },
          { id: 'wm3', text: 'всё в кадре' },
        ],
      },
      {
        id: 'scenario',
        label: 'Сценарий',
        options: [
          { id: 'sc1', text: 'одно действие' },
          { id: 'sc2', text: 'начало → действие → завершение' },
          { id: 'sc3', text: 'мини-история' },
        ],
      },
    ],
  },
  {
    id: 'camera',
    label: 'Камера',
    icon: '🟡',
    why: 'План, ракурс и движение камеры — «киноязык», от которого зависит восприятие.',
    fields: [
      {
        id: 'plan',
        label: 'План',
        options: [
          { id: 'p1', text: 'крупный план' },
          { id: 'p2', text: 'средний план' },
          { id: 'p3', text: 'общий план' },
        ],
      },
      {
        id: 'angle',
        label: 'Ракурс',
        options: [
          { id: 'an1', text: 'на уровне глаз' },
          { id: 'an2', text: 'сверху' },
          { id: 'an3', text: 'снизу' },
        ],
      },
      {
        id: 'camMove',
        label: 'Движение камеры',
        options: [
          { id: 'cm1', text: 'статичная камера' },
          { id: 'cm2', text: 'плавный проезд' },
          { id: 'cm3', text: 'приближение' },
          { id: 'cm4', text: 'отдаление' },
          { id: 'cm5', text: 'следование за объектом' },
        ],
      },
    ],
  },
  {
    id: 'styleFormat',
    label: 'Стиль и формат',
    icon: '🟢',
    why: 'Визуальный жанр, ориентация кадра и темп — как ролик «чувствуется» зрителю.',
    fields: [
      {
        id: 'style',
        label: 'Стиль',
        options: [
          { id: 'st1', text: 'реалистичное видео' },
          { id: 'st2', text: 'кино' },
          { id: 'st3', text: 'образовательное видео' },
          { id: 'st4', text: 'рекламное' },
          { id: 'st5', text: 'соцреализм' },
        ],
      },
      {
        id: 'format',
        label: 'Формат',
        options: [
          { id: 'f1', text: 'горизонтальный' },
          { id: 'f2', text: 'вертикальный' },
          { id: 'f3', text: 'квадрат' },
        ],
      },
      {
        id: 'pace',
        label: 'Темп',
        options: [
          { id: 'pc1', text: 'медленный' },
          { id: 'pc2', text: 'средний' },
          { id: 'pc3', text: 'быстрый' },
        ],
      },
    ],
  },
  {
    id: 'light',
    label: 'Свет и атмосфера',
    icon: '🔵',
    why: 'Свет и настроение среды — насколько тепло или драматично выглядит видео.',
    fields: [
      {
        id: 'light',
        label: 'Свет',
        options: [
          { id: 'l1', text: 'мягкий' },
          { id: 'l2', text: 'естественный' },
          { id: 'l3', text: 'контрастный' },
        ],
      },
      {
        id: 'timeOfDay',
        label: 'Время',
        options: [
          { id: 't1', text: 'день' },
          { id: 't2', text: 'вечер' },
          { id: 't3', text: 'закат' },
        ],
      },
      {
        id: 'atmosphere',
        label: 'Атмосфера',
        options: [
          { id: 'at1', text: 'тёплая' },
          { id: 'at2', text: 'нейтральная' },
          { id: 'at3', text: 'холодная' },
          { id: 'at4', text: 'драматичная' },
        ],
      },
    ],
  },
  {
    id: 'quality',
    label: 'Качество и эффекты',
    icon: '🟣',
    why: 'Насколько «дорого» и кинематографично выглядит картинка и постобработка.',
    fields: [
      {
        id: 'quality',
        label: 'Качество',
        options: [
          { id: 'q1', text: 'обычное' },
          { id: 'q2', text: 'высокое' },
          { id: 'q3', text: 'кинематографичное' },
        ],
      },
      {
        id: 'effects',
        label: 'Эффекты',
        options: [
          { id: 'e1', text: 'глубина резкости' },
          { id: 'e2', text: 'размытый фон' },
          { id: 'e3', text: 'плавное движение' },
          { id: 'e4', text: 'cinematic look' },
        ],
      },
    ],
  },
];

/** Технический блок (отдельно — раскрывается в UI) */
export const videoTechnicalFields: VideoPromptField[] = [
  {
    id: 'duration',
    label: 'Длительность',
    options: [
      { id: 'd1', text: '5 сек' },
      { id: 'd2', text: '10 сек' },
      { id: 'd3', text: '15 сек' },
    ],
  },
  {
    id: 'fps',
    label: 'FPS',
    options: [
      { id: 'fps1', text: '24' },
      { id: 'fps2', text: '30' },
      { id: 'fps3', text: '60' },
    ],
  },
  {
    id: 'resolution',
    label: 'Разрешение',
    options: [
      { id: 'r1', text: '720p' },
      { id: 'r2', text: '1080p' },
      { id: 'r3', text: '4K' },
    ],
  },
  {
    id: 'genMode',
    label: 'Режим генерации',
    options: [
      { id: 'g1', text: 'стабильный' },
      { id: 'g2', text: 'сбалансированный' },
      { id: 'g3', text: 'креативный' },
    ],
  },
];

export function buildVideoPrompt(params: {
  values: Record<string, string>;
  custom: Record<string, string>;
  negativeIds: string[];
  includeTechnical: boolean;
  enhance?: boolean;
}): string {
  const { values, custom, negativeIds, includeTechnical, enhance } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const subject = v('subject');
  const context = v('context');
  const action = v('action');
  const mood = v('mood');
  const motionType = v('motionType');
  const whatMoves = v('whatMoves');
  const scenario = v('scenario');
  const plan = v('plan');
  const angle = v('angle');
  const camMove = v('camMove');
  const style = v('style');
  const format = v('format');
  const pace = v('pace');
  const light = v('light');
  const timeOfDay = v('timeOfDay');
  const atmosphere = v('atmosphere');
  const quality = v('quality');
  let effects = v('effects');

  const duration = v('duration');
  const fps = v('fps');
  const resolution = v('resolution');
  const genMode = v('genMode');

  if (enhance) {
    if (!effects.toLowerCase().includes('cinematic')) {
      effects = effects ? `${effects}, cinematic look, плавное движение` : 'cinematic look, плавное движение';
    }
  }

  let line1 = '';
  if (subject || context || action || mood) {
    const core: string[] = [];
    if (subject && context) core.push(`${subject} в ${context}`);
    else if (subject) core.push(subject);
    else if (context) core.push(`в ${context}`);
    if (action) core.push(action);
    const moodPart = mood ? `${mood} настроение` : '';
    line1 = [...core, moodPart].filter(Boolean).join(', ');
  }
  if (line1) line1 = `Сцена: ${line1}`;

  const line2 =
    motionType || whatMoves || scenario
      ? `Динамика: ${motionType}, движется: ${whatMoves}, сценарий: ${scenario}`
      : '';

  const line3 =
    plan || angle || camMove
      ? `Камера: ${plan}, ракурс: ${angle}, движение камеры: ${camMove}`
      : '';

  const line4 =
    style || format || pace
      ? `Стиль: ${style}, формат: ${format}, темп: ${pace}`
      : '';

  const timeLabel =
    timeOfDay === 'день'
      ? 'дневное время'
      : timeOfDay === 'вечер'
        ? 'вечернее время'
        : timeOfDay === 'закат'
          ? 'закат'
          : timeOfDay;
  const atmText =
    atmosphere && !atmosphere.includes('атмосфер')
      ? `${atmosphere} атмосфера`
      : atmosphere;

  const line5 =
    light || timeOfDay || atmosphere
      ? `Освещение: ${light} свет, время: ${timeLabel}, атмосфера: ${atmText}`
      : '';

  const line6 =
    quality || effects ? `Качество: ${quality}, эффекты: ${effects}` : '';

  let line7 = '';
  if (includeTechnical && (duration || fps || resolution || genMode)) {
    const durPretty = duration ? duration.replace(/\s*сек$/, ' секунд') : '';
    line7 = `Технические параметры: длительность ${durPretty}, ${fps} fps, разрешение ${resolution}, ${genMode} режим`;
  }

  const negTexts = VIDEO_NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map((n) => n.text);
  const negLine = negTexts.length ? `negative: ${negTexts.join(', ')}` : '';

  const blocks = [line1, line2, line3, line4, line5, line6, line7].filter((b) => b && b.trim());
  let out = blocks.join('\n\n');
  if (negLine) out += `\n\n${negLine}`;

  return out.trim() || 'Выберите параметры или введите свой вариант в полях ниже.';
}

export function getInitialVideoSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of videoPromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) s[field.id] = field.options[0].text;
    }
  }
  for (const field of videoTechnicalFields) {
    if (field.options.length > 0) s[field.id] = field.options[0].text;
  }
  return s;
}
