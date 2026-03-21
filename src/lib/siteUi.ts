/**
 * Единые токены UI (Tailwind-классы) для согласованного вида по проекту.
 * Акцент интерактива: blue; нейтраль: zinc.
 */

export const siteUi = {
  /** Основная оболочка внутренних страниц (конструкторы, детали) */
  page: 'container mx-auto px-4 py-8 md:px-6 max-w-6xl',
  /** Каталог — тот же горизонтальный ритм, единый вертикальный отступ */
  pageWide: 'container mx-auto px-4 py-8 md:px-6',

  backLink: 'inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors',

  sectionCard: 'rounded-xl border border-zinc-200 bg-white p-5 shadow-sm',
  sidebarCard: 'rounded-2xl border border-zinc-200 bg-white p-5',

  /** Подсказка «Зачем это нужно» */
  whyHint: 'mt-2 text-sm text-zinc-800 bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100',

  sectionHeading: 'font-semibold text-zinc-900 text-base flex items-center gap-2',

  chipBase: 'px-3 py-1.5 rounded-lg text-xs transition-all border',
  chipOn: 'border-blue-500 bg-blue-50 text-zinc-900',
  chipOff: 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600',

  /** Крупные переключатели (категории, стили UI) */
  navPillOn: 'bg-zinc-900 text-white',
  navPillOff: 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200',
  navPillBase: 'px-4 py-2 rounded-xl text-sm font-medium transition-all',

  /** Карточка выбора типа (две колонки) */
  typeTileOn: 'border-blue-500 bg-blue-50 text-zinc-900',
  typeTileOff: 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-700',

  /** Основная ссылка-кнопка (CTA) */
  ctaButton:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors',

  input:
    'w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300',
  inputRoundedXl:
    'w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300',

  checkboxLabelBase: 'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
  checkboxOn: 'border-blue-500 bg-blue-50 text-zinc-900',
  checkboxOff: 'border-zinc-200 bg-white text-zinc-600',
  checkboxInput: 'rounded border-zinc-300 text-blue-600 focus:ring-blue-500',

  /** Кнопка копирования / основное действие */
  primaryButton:
    'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all bg-zinc-900 text-white hover:bg-zinc-800',
  primaryButtonSuccess: 'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all bg-emerald-500 text-white',

  /** «Сделать сильнее» и аналоги */
  secondaryButton:
    'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 border-zinc-200 bg-zinc-50 text-zinc-900 hover:bg-zinc-100 transition-colors',

  iconButton: 'p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors',

  textareaPrompt:
    'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-y min-h-[280px] focus:outline-none focus:ring-2 focus:ring-zinc-300 whitespace-pre-wrap font-mono',
  textareaPromptTall:
    'w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-y min-h-[400px] focus:outline-none focus:ring-2 focus:ring-zinc-300 whitespace-pre-wrap font-mono',

  enhanceNote: 'text-xs text-blue-800 bg-blue-50 rounded-lg px-3 py-2 mb-2 border border-blue-100',

  linkOutbound:
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition-colors',

  /** Блок этики / предупреждения */
  calloutWarning: 'rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5',
  /** Нейтральный выделенный блок (инфо, баннер Qwen) */
  calloutInfo: 'rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6',

  technicalCollapse: 'rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-5',

  fieldLabel: 'text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2',

  /** Карточка «Собери промпт» на главной / в каталоге */
  bentoPromptCard:
    'text-left rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer',
} as const;
