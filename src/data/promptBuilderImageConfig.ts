/** Конструктор промптов для изображений: категории → значения → шаблон */

export interface ImagePromptOption {
  id: string;
  text: string;
}

export interface ImagePromptField {
  id: string;
  label: string;
  options: ImagePromptOption[];
}

export interface ImagePromptSection {
  id: string;
  label: string;
  icon: string;
  /** Подсказка «Зачем это нужно» */
  why: string;
  fields: ImagePromptField[];
}

export const NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'faces', text: 'искажённые лица' },
  { id: 'fingers', text: 'лишние пальцы' },
  { id: 'text', text: 'текст на изображении' },
  { id: 'watermark', text: 'водяные знаки' },
  { id: 'blur', text: 'размытость' },
  { id: 'noise', text: 'шум' },
];

export const imagePromptSections: ImagePromptSection[] = [
  {
    id: 'scene',
    label: 'Смысл сцены',
    icon: '🔴',
    why: 'Задаёт, кто и что происходит на кадре — без этого модель «угадывает», а не рассказывает вашу историю.',
    fields: [
      {
        id: 'subject',
        label: 'Субъект (кто)',
        options: [
          { id: 'sub_m', text: 'мужчина' },
          { id: 'sub_w', text: 'женщина' },
          { id: 'sub_c', text: 'ребёнок' },
          { id: 'sub_g', text: 'группа людей' },
          { id: 'sub_teacher', text: 'учитель' },
          { id: 'sub_student', text: 'ученик' },
          { id: 'sub_animal', text: 'животное' },
        ],
      },
      {
        id: 'context',
        label: 'Контекст (где)',
        options: [
          { id: 'ctx_class', text: 'школьном классе' },
          { id: 'ctx_school', text: 'школе' },
          { id: 'ctx_city', text: 'городе' },
          { id: 'ctx_village', text: 'деревне' },
          { id: 'ctx_nature', text: 'на природе' },
          { id: 'ctx_office', text: 'офисе' },
        ],
      },
      {
        id: 'action',
        label: 'Действие (что делает)',
        options: [
          { id: 'act_stand', text: 'стоит' },
          { id: 'act_walk', text: 'идёт' },
          { id: 'act_explain', text: 'объясняет' },
          { id: 'act_read', text: 'читает' },
          { id: 'act_pc', text: 'работает за компьютером' },
        ],
      },
      {
        id: 'mood',
        label: 'Настроение',
        options: [
          { id: 'mood_calm', text: 'спокойное' },
          { id: 'mood_joy', text: 'радостное' },
          { id: 'mood_inspire', text: 'вдохновляющее' },
          { id: 'mood_business', text: 'деловое' },
          { id: 'mood_tense', text: 'напряжённое' },
        ],
      },
    ],
  },
  {
    id: 'composition',
    label: 'Композиция',
    icon: '🟠',
    why: 'Определяет, как зритель смотрит на кадр — профессиональная картинка начинается с плана и ракурса.',
    fields: [
      {
        id: 'plan',
        label: 'План',
        options: [
          { id: 'pl_close', text: 'крупный план (портрет)' },
          { id: 'pl_mid', text: 'средний план' },
          { id: 'pl_wide', text: 'общий план' },
        ],
      },
      {
        id: 'angle',
        label: 'Ракурс',
        options: [
          { id: 'ang_eye', text: 'прямо (на уровне глаз)' },
          { id: 'ang_top', text: 'сверху' },
          { id: 'ang_bottom', text: 'снизу' },
        ],
      },
      {
        id: 'frameType',
        label: 'Тип кадра',
        options: [
          { id: 'ft_photo', text: 'как фотография' },
          { id: 'ft_cinema', text: 'как кино' },
          { id: 'ft_poster', text: 'как плакат' },
        ],
      },
    ],
  },
  {
    id: 'styleEra',
    label: 'Стиль и эпоха',
    icon: '🟡',
    why: 'Задаёт художественный язык и «время» сцены — от реализма до советского плаката.',
    fields: [
      {
        id: 'style',
        label: 'Стиль',
        options: [
          { id: 'st_real', text: 'реализм' },
          { id: 'st_soviet', text: 'советский плакат' },
          { id: 'st_illust', text: 'иллюстрация' },
          { id: 'st_modern', text: 'современная графика' },
          { id: 'st_min', text: 'минимализм' },
        ],
      },
      {
        id: 'era',
        label: 'Эпоха / атмосфера',
        options: [
          { id: 'er_now', text: 'современность' },
          { id: 'er_ussr', text: 'СССР' },
          { id: 'er_future', text: 'будущее' },
        ],
      },
      {
        id: 'reference',
        label: 'Референс',
        options: [
          { id: 'ref_none', text: 'без референса' },
          { id: 'ref_cinema', text: 'как в кино' },
          { id: 'ref_book', text: 'как в учебнике' },
        ],
      },
    ],
  },
  {
    id: 'light',
    label: 'Свет и атмосфера',
    icon: '🟢',
    why: 'Свет задаёт настроение и объём — один и тот же сюжет выглядит по-разному при дневном и вечернем свете.',
    fields: [
      {
        id: 'lightType',
        label: 'Тип света',
        options: [
          { id: 'lt_soft', text: 'мягкий' },
          { id: 'lt_natural', text: 'естественный' },
          { id: 'lt_contrast', text: 'контрастный' },
        ],
      },
      {
        id: 'timeOfDay',
        label: 'Время',
        options: [
          { id: 'tod_day', text: 'день' },
          { id: 'tod_evening', text: 'вечер' },
          { id: 'tod_sunset', text: 'закат' },
        ],
      },
      {
        id: 'colorTemp',
        label: 'Температура',
        options: [
          { id: 'ct_warm', text: 'тёплый' },
          { id: 'ct_neutral', text: 'нейтральный' },
          { id: 'ct_cold', text: 'холодный' },
        ],
      },
    ],
  },
  {
    id: 'quality',
    label: 'Качество и детали',
    icon: '🔵',
    why: 'Технические требования к картинке — резкость, детализация и тип рендера.',
    fields: [
      {
        id: 'imageType',
        label: 'Тип изображения',
        options: [
          { id: 'it_photo', text: 'фотореализм' },
          { id: 'it_illust', text: 'иллюстрация' },
          { id: 'it_poster', text: 'постер' },
        ],
      },
      {
        id: 'detail',
        label: 'Детализация',
        options: [
          { id: 'det_norm', text: 'обычная' },
          { id: 'det_high', text: 'высокая' },
        ],
      },
      {
        id: 'effects',
        label: 'Эффекты',
        options: [
          { id: 'ef_focus', text: 'чёткий фокус' },
          { id: 'ef_bokeh', text: 'размытый фон' },
          { id: 'ef_dof', text: 'глубина резкости' },
        ],
      },
    ],
  },
];

/** Собирает промпт по шаблону из выбранных значений и кастомных строк */
export function buildImagePrompt(params: {
  values: Record<string, string>;
  custom: Record<string, string>;
  negativeIds: string[];
  enhance?: boolean;
}): string {
  const { values, custom, negativeIds, enhance } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const subject = v('subject');
  const context = v('context');
  const action = v('action');
  const mood = v('mood');
  const plan = v('plan');
  const angle = v('angle');
  const frameType = v('frameType');
  const style = v('style');
  const era = v('era');
  const reference = v('reference');
  let lightType = v('lightType');
  let timeOfDay = v('timeOfDay');
  const colorTemp = v('colorTemp');
  let imageType = v('imageType');
  const detail = v('detail');
  let effects = v('effects');

  if (enhance) {
    const ef = effects.toLowerCase();
    if (!ef.includes('фокус')) {
      effects = effects ? `${effects}, чёткий фокус` : 'чёткий фокус';
    }
    const lt = lightType.toLowerCase();
    if (!lt.includes('реалистич')) {
      lightType = lightType ? `${lightType}, реалистичный свет` : 'реалистичный свет';
    }
    if (!timeOfDay.trim() && !custom.timeOfDay?.trim()) timeOfDay = 'день';
    if (!imageType.trim() && !custom.imageType?.trim()) imageType = 'фотореализм';
  }

  const refLine =
    reference && reference !== 'без референса'
      ? `, референс: ${reference}`
      : '';

  const negTexts = NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map((n) => n.text);
  const negativeLine = negTexts.length ? negTexts.join(', ') : '';

  let line1 = '';
  if (subject || context || action || mood) {
    const core: string[] = [];
    if (subject && context) core.push(`${subject} в ${context}`);
    else if (subject) core.push(subject);
    else if (context) core.push(`в ${context}`);
    if (action) core.push(action);
    const moodPart = mood ? `настроение: ${mood}` : '';
    line1 = [...core, moodPart].filter(Boolean).join(', ');
  }

  const line2 =
    [plan, angle && `ракурс: ${angle}`, frameType && `стиль кадра: ${frameType}`]
      .filter(Boolean)
      .join(', ') || '';

  const line3 = [style && `стиль: ${style}`, era && `эпоха: ${era}${refLine}`].filter(Boolean).join(', ');

  const line4 = [
    lightType && `освещение: ${lightType}`,
    timeOfDay && `время: ${timeOfDay}`,
    colorTemp && `цветовая температура: ${colorTemp}`,
  ]
    .filter(Boolean)
    .join(', ');

  const line5 = [
    imageType && `тип изображения: ${imageType}`,
    detail && `детализация: ${detail}`,
    effects && effects,
  ]
    .filter(Boolean)
    .join(', ');

  const blocks = [line1, line2, line3, line4, line5].filter((b) => b && b.trim());
  let out = blocks.join('\n\n');

  if (negativeLine) {
    out += `\n\nnegative: ${negativeLine}`;
  }

  return out.trim() || 'Выберите параметры или введите свой вариант в полях ниже.';
}
