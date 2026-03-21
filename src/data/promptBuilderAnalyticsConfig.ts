/** Конструктор промптов: AI-анализ данных — единый структурированный промпт */

export interface AnalyticsPromptOption {
  id: string;
  text: string;
}

export interface AnalyticsPromptField {
  id: string;
  label: string;
  options: AnalyticsPromptOption[];
}

export interface AnalyticsPromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: AnalyticsPromptField[];
}

export const ANALYTICS_QUALITY_OPTIONS: { id: string; text: string }[] = [
  { id: 'q1', text: 'учитывать пропуски в данных' },
  { id: 'q2', text: 'проверять выбросы' },
  { id: 'q3', text: 'не путать корреляцию и причинно-следственные связи' },
  { id: 'q4', text: 'не делать выводы на малой выборке' },
  { id: 'q5', text: 'обеспечивать интерпретируемость результатов' },
];

export const ANALYTICS_NEGATIVE_OPTIONS: { id: string; text: string }[] = [
  { id: 'n1', text: 'overfitting' },
  { id: 'n2', text: 'data leakage' },
  { id: 'n3', text: 'p-hacking' },
  { id: 'n4', text: 'игнорирование пропусков' },
  { id: 'n5', text: 'манипулятивные визуализации' },
  { id: 'n6', text: 'необоснованные выводы' },
];

export const analyticsVizOptions: { id: string; text: string }[] = [
  { id: 'v1', text: 'таблицы' },
  { id: 'v2', text: 'столбчатые и линейные графики' },
  { id: 'v3', text: 'распределения (гистограммы, боксплоты)' },
  { id: 'v4', text: 'дашборд' },
];

export const analyticsPromptSections: AnalyticsPromptSection[] = [
  {
    id: 'role',
    label: 'Контекст и роль',
    icon: '🔴',
    why: 'Сфера задаёт язык метрик и ограничения (образование ≠ бизнес).',
    fields: [
      {
        id: 'role',
        label: 'Роль / сфера',
        options: [
          { id: 'r1', text: 'образования' },
          { id: 'r2', text: 'госуправления' },
          { id: 'r3', text: 'бизнеса' },
          { id: 'r4', text: 'науки' },
        ],
      },
    ],
  },
  {
    id: 'goal',
    label: 'Цель анализа',
    icon: '🟠',
    why: 'Зачем анализ — от этого зависят методы и проверки гипотез.',
    fields: [
      {
        id: 'goal',
        label: 'Цель',
        options: [
          { id: 'g1', text: 'выявить проблемные зоны' },
          { id: 'g2', text: 'сравнить группы' },
          { id: 'g3', text: 'найти факторы влияния' },
          { id: 'g4', text: 'сегментировать данные' },
          { id: 'g5', text: 'оценить эффективность' },
          { id: 'g6', text: 'спрогнозировать тренды' },
        ],
      },
    ],
  },
  {
    id: 'depth',
    label: 'Глубина анализа',
    icon: '🟡',
    why: 'Уровень статистики и моделей — от описания до прогноза.',
    fields: [
      {
        id: 'depth',
        label: 'Глубина',
        options: [
          { id: 'd1', text: 'базовый (описательный анализ)' },
          { id: 'd2', text: 'диагностический (поиск связей)' },
          { id: 'd3', text: 'продвинутый (модели и прогноз)' },
        ],
      },
    ],
  },
  {
    id: 'format',
    label: 'Формат результата',
    icon: '🟢',
    why: 'Как представить выводы — влияет на структуру ответа.',
    fields: [
      {
        id: 'format',
        label: 'Формат',
        options: [
          { id: 'f1', text: 'краткая справка' },
          { id: 'f2', text: 'аналитическая записка' },
          { id: 'f3', text: 'презентация' },
          { id: 'f4', text: 'рекомендации (чек-лист действий)' },
          { id: 'f5', text: 'дашборд' },
        ],
      },
    ],
  },
  {
    id: 'viz',
    label: 'Визуализация',
    icon: '🔵',
    why: 'Как показать данные — согласуй с форматом и аудиторией.',
    fields: [],
  },
  {
    id: 'style',
    label: 'Стиль вывода',
    icon: '🟣',
    why: 'Тон и плотность текста: от executive summary до практических шагов.',
    fields: [
      {
        id: 'style',
        label: 'Стиль',
        options: [
          { id: 's1', text: 'краткий (executive summary)' },
          { id: 's2', text: 'аналитический (нейтральный)' },
          { id: 's3', text: 'практико-ориентированный' },
        ],
      },
    ],
  },
];

export function buildAnalyticsPrompt(params: {
  values: Record<string, string>;
  custom: Record<string, string>;
  vizIds: string[];
  qualityIds: string[];
  negativeIds: string[];
  enhance?: boolean;
}): string {
  const { values, custom, vizIds, qualityIds, negativeIds, enhance } = params;

  const v = (fieldId: string, fallback = '') => {
    const c = custom[fieldId]?.trim();
    if (c) return c;
    return values[fieldId]?.trim() || fallback;
  };

  const role = v('role');
  const goal = v('goal');
  const depth = v('depth');
  const format = v('format');
  const style = v('style');

  const vizLabels = analyticsVizOptions.filter((o) => vizIds.includes(o.id)).map((o) => o.text);
  const vizLine = vizLabels.length ? vizLabels.join(', ') : 'таблицы и графики по смыслу задачи';

  const qualityExtra = ANALYTICS_QUALITY_OPTIONS.filter((q) => qualityIds.includes(q.id)).map(
    (q) => `- ${q.text}`
  );

  let rulesBlock = `=== ПРАВИЛА ===
- не путай корреляцию и причинность
- учитывай пропуски
- избегай переобучения и утечки данных
- делай выводы только на основе данных
- пиши кратко и понятно`;

  if (qualityExtra.length) {
    rulesBlock += '\n' + qualityExtra.join('\n');
  }

  if (enhance) {
    rulesBlock += '\n- усиль проверку устойчивости выводов и явно укажи ограничения данных';
  }

  const negTexts = ANALYTICS_NEGATIVE_OPTIONS.filter((n) => negativeIds.includes(n.id)).map(
    (n) => n.text
  );
  const negLine = negTexts.length ? negTexts.join(', ') : 'не задано';

  const partBeforeRules = `Ты — аналитик данных в области ${role}.

Цель анализа: ${goal}.
Глубина: ${depth}.
Формат результата: ${format}.
Стиль: ${style}.
Визуализация: ${vizLine}.

Проанализируй загруженный файл и выполни анализ по шагам:

=== 1. ДИАГНОСТИКА ДАННЫХ ===
- структура данных (поля и типы)
- пропуски (% по ключевым переменным)
- дубликаты
- выбросы (метод IQR или аналог)
- первичные наблюдения

=== 2. АНАЛИЗ ===
В зависимости от цели:

- сравнение → группировки и статистические тесты
- факторы → корреляции или регрессия
- сегментация → группы или кластеры
- динамика → тренды и изменения

Для каждого вывода:
[Наблюдение] → [Данные] → [Интерпретация]

=== 3. ВАЛИДАЦИЯ ===
- проверка репрезентативности
- устойчивость выводов
- ограничения данных

=== 4. РЕЗУЛЬТАТЫ ===
1. Ключевые инсайты (3–5)
2. Метрики (таблица + краткая интерпретация)
3. Визуализации (2–4)
4. Рекомендации (Действие → Обоснование → Эффект)

`;

  const full = `${partBeforeRules}
${rulesBlock}

Исключить: ${negLine}`;

  return full.trim();
}

export function getInitialAnalyticsSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of analyticsPromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) s[field.id] = field.options[0].text;
    }
  }
  return s;
}
