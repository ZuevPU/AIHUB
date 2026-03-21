/** Конструктор промптов: редактор смыслов и текстов — единый структурированный промпт */

export interface EditorPromptOption {
  id: string;
  text: string;
}

export interface EditorPromptField {
  id: string;
  label: string;
  options: EditorPromptOption[];
}

export interface EditorPromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: EditorPromptField[];
}

/** Пять пресетов по материалам prompt_008 … prompt_013 (категория editor) */
export const editorTaskTypes: {
  id: string;
  label: string;
  hint: string;
  /** Режим: идеи/структура или полноценный текст */
  outputMode: 'ideas' | 'skeleton' | 'full';
}[] = [
  {
    id: 'angles_12',
    label: '12 углов подачи темы',
    hint: 'Идеи заголовков и форматов, не готовая публикация',
    outputMode: 'ideas',
  },
  {
    id: 'script_3',
    label: '3 структуры сценария',
    hint: 'Скелет: хук, сцены, поворот, финал — без финального текста',
    outputMode: 'skeleton',
  },
  {
    id: 'cliche_10',
    label: '10 альтернативных подач без клише',
    hint: 'Заголовки и мысли по разным оптикам, не полный лонгрид',
    outputMode: 'ideas',
  },
  {
    id: 'event_smm',
    label: 'Анонс мероприятия (соцсети)',
    hint: 'Готовый текст анонса по структуре',
    outputMode: 'full',
  },
  {
    id: 'explain',
    label: 'Объяснение сложной темы',
    hint: 'Развёрнутое объяснение без жаргона',
    outputMode: 'full',
  },
];

export const EDITOR_QUALITY_OPTIONS: { id: string; text: string }[] = [
  { id: 'eq1', text: 'ясная структура ответа по разделам' },
  { id: 'eq2', text: 'соответствие тону и аудитории' },
  { id: 'eq3', text: 'без выдуманных фактов и цитат' },
  { id: 'eq4', text: 'конкретика вместо общих слов' },
  { id: 'eq5', text: 'проверяемость формулировок' },
];

export const EDITOR_NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'en1', text: 'кликбейт и вводящие в заблуждение заголовки' },
  { id: 'en2', text: 'токсичность и дискриминационные формулировки' },
  { id: 'en3', text: 'вода и штампы без смысла' },
  { id: 'en4', text: 'избыточный жаргон без пояснений' },
  { id: 'en5', text: 'подмена цели читателя рекламой без пометки' },
];

export const editorPromptSections: EditorPromptSection[] = [
  {
    id: 'writer',
    label: 'Роль автора',
    icon: '✍️',
    why: 'От роли зависят формулировки и глубина (креатив vs методист).',
    fields: [
      {
        id: 'writer',
        label: 'Кто пишет',
        options: [
          { id: 'w1', text: 'креативный редактор' },
          { id: 'w2', text: 'сценарный редактор' },
          { id: 'w3', text: 'специалист по SMM и образовательным коммуникациям' },
          { id: 'w4', text: 'эксперт-методист (простое объяснение сложного)' },
          { id: 'w5', text: 'редактор, ломающий клише' },
        ],
      },
    ],
  },
  {
    id: 'tone',
    label: 'Тон и плотность',
    icon: '🎚️',
    why: 'Единый голос текста и ожидаемый объём.',
    fields: [
      {
        id: 'tone',
        label: 'Тон',
        options: [
          { id: 't1', text: 'дружеский, но профессиональный' },
          { id: 't2', text: 'нейтральный, деловой' },
          { id: 't3', text: 'экспертный, спокойный' },
          { id: 't4', text: 'вдохновляющий, без пафоса' },
        ],
      },
      {
        id: 'density',
        label: 'Плотность',
        options: [
          { id: 'd1', text: 'кратко (тезисы и заголовки)' },
          { id: 'd2', text: 'средне (абзацы с пояснениями)' },
          { id: 'd3', text: 'развёрнуто (полноценные блоки текста)' },
        ],
      },
    ],
  },
];

function taskTypeBlock(
  taskId: string,
  topic: string,
  audience: string,
  readerGoal: string,
  details: string
): string {
  const d = details.trim();
  const detailsLine = d ? `\nДополнительные условия (дата, место, формат, платформа, хронометраж и т.д.): ${d}` : '';

  switch (taskId) {
    case 'angles_12':
      return `Тип задачи: 12 углов подачи темы (не готовая публикация — только варианты подачи).

Задача:
Дай 12 «углов» подачи темы «${topic}» для аудитории: ${audience}.
Цель читателя: ${readerGoal}.

Распределение:
- 4 практичных («сделай завтра»)
- 3 провокационных (без токсичности)
- 3 через личную мини-историю
- 2 через метафору или образ

Для каждого угла укажи: рабочий заголовок + 1 тезис + какой формат лучше (пост / письмо / скрипт / сторис).${detailsLine}`;

    case 'script_3':
      return `Тип задачи: три структуры сценария (только скелет и ритм, без финального текста ролика).

Задача:
Сделай 3 разные структуры сценария по теме «${topic}» для аудитории: ${audience}.
Цель зрителя/слушателя: ${readerGoal}.${detailsLine ? `\nФормат и хронометраж: ${d || 'указать в доп. условиях'}.` : ''}

Каждая структура должна включать:
- хук (первые 10 секунд / первая фраза)
- 3–5 ключевых сцен или блоков
- «поворот» (момент переосмысления)
- финал (что зритель должен унести с собой)
- 2 места для живого примера из реальной жизни (без выдуманных фактов)

Не пиши финальный связный текст — только скелет и ритм.`;

    case 'cliche_10':
      return `Тип задачи: 10 альтернативных подач без клише (не полный лонгрид).

Задача:
Тема: «${topic}». Аудитория: ${audience}. Что должен сделать читатель: ${readerGoal}.

Сделай 10 альтернативных подач или идей, используя разные оптики, например:
«контринтуитивно», «через ошибку», «через аналогию», «через вопрос», «через чек-лист» и другие уместные.

Для каждой: 1 заголовок + 2 ключевые мысли. Штампы и пустые общие слова не использовать.${detailsLine}`;

    case 'event_smm':
      return `Тип задачи: анонс мероприятия для социальных сетей (готовый текст по структуре).

Задача:
Напиши вовлекающий анонс.
Тема мероприятия: ${topic}
Аудитория: ${audience}
Ключевая польза для участника: ${readerGoal}${detailsLine}

Структура ответа:
1. Заголовок-хук (5–10 слов, цепляющий, без кликбейта)
2. Основной текст: проблема → решение → выгода (сторителлинг, ориентир 150–250 слов)
3. Практическая информация (дата, место, регистрация — кратко)
4. Один чёткий призыв к действию (со ссылкой или инструкцией, если есть)

Требования: абзацы и списки для сканирования; эмодзи умеренно (не больше 3–5), только для акцентов.`;

    case 'explain':
      return `Тип задачи: понятное объяснение сложной темы без жаргона (готовый связный текст).

Задача:
Тема: «${topic}»
Аудитория: ${audience}
Контекст использования: ${readerGoal}${detailsLine}

Структура ответа:
1. Определение простыми словами (1–2 предложения)
2. Ключевые компоненты (3–4 пункта, с аналогиями из жизни)
3. Как это работает на практике (2–3 примера)
4. Почему это важно именно этой аудитории
5. Что сделать дальше (первый шаг или ресурс)

Ориентир объёма: 300–500 слов. Язык доступный; термины только с пояснением в скобках.`;

    default:
      return `Тема: ${topic}. Аудитория: ${audience}. Цель: ${readerGoal}.${detailsLine}`;
  }
}

export function buildEditorPrompt(params: {
  taskTypeId: string;
  values: Record<string, string>;
  custom: Record<string, string>;
  topic: string;
  audience: string;
  readerGoal: string;
  details: string;
  qualityIds: string[];
  negativeIds: string[];
  enhance?: boolean;
}): string {
  const {
    taskTypeId,
    values,
    custom,
    topic,
    audience,
    readerGoal,
    details,
    qualityIds,
    negativeIds,
    enhance,
  } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const writer = v('writer', 'креативный редактор');
  const tone = v('tone', 'нейтральный, деловой');
  const density = v('density', 'средне (абзацы с пояснениями)');

  const taskMeta = editorTaskTypes.find((t) => t.id === taskTypeId);
  const taskLabel = taskMeta?.label ?? 'задача редактора';
  const outputMode = taskMeta?.outputMode ?? 'ideas';

  const topicT = topic.trim() || '[указать тему]';
  const audienceT = audience.trim() || '[указать аудиторию]';
  const goalT = readerGoal.trim() || '[что должен сделать или понять читатель]';
  const detailsT = details.trim();

  const coreBlock = taskTypeBlock(taskTypeId, topicT, audienceT, goalT, detailsT);

  const qualityExtra = EDITOR_QUALITY_OPTIONS.filter((q) => qualityIds.includes(q.id)).map((q) => `- ${q.text}`);
  const negTexts = EDITOR_NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map((n) => n.text);
  const negLine = negTexts.length ? negTexts.join(', ') : 'не задано';

  let rulesBlock = `=== ПРАВИЛА ===
- Пиши на русском, если не оговорено иное
- Согласуй объём с плотностью: ${density}
- Режим результата: ${outputMode === 'full' ? 'готовый текст по структуре' : outputMode === 'skeleton' ? 'только структура/скелет без финального связного текста' : 'идеи, заголовки и тезисы без полного лонгрида'}`;

  if (qualityExtra.length) {
    rulesBlock += '\n' + qualityExtra.join('\n');
  }

  if (enhance) {
    rulesBlock +=
      '\n- Усиль: добавь краткий чек-лист самопроверки для автора (3–5 пунктов) в конце ответа';
  }

  const header = `Ты — ${writer}.

Тон: ${tone}.
Тип задачи (пресет): ${taskLabel}.

`;

  const partBeforeRules = `${header}=== ВХОДНЫЕ ДАННЫЕ ===
- Тема: ${topicT}
- Аудитория: ${audienceT}
- Цель читателя / зрителя: ${goalT}
${detailsT ? `- Дополнительно: ${detailsT}` : ''}

=== ЗАДАЧА И ФОРМАТ ===
${coreBlock}

`;

  return `${partBeforeRules.trim()}

${rulesBlock}

Исключить: ${negLine}`.trim();
}

export function getInitialEditorSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of editorPromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) {
        s[field.id] = field.options[0].text;
      }
    }
  }
  return s;
}
