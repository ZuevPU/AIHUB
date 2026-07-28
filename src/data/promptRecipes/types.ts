/**
 * Промпт-рецепты: готовый промпт, в котором меняются только смысловые слоты.
 * Отличие от PromptSection-конструкторов: пользователь не собирает промпт с нуля,
 * а правит 2-3 чипа прямо внутри готового текста.
 */

export type RecipeBlock = 'docflow' | 'analytics' | 'hiring' | 'assessment'

export type PdRisk = 'none' | 'low' | 'high'

export type AiModel = 'gigachat' | 'yandex' | 'qwen' | 'deepseek'

export type ProfileField = 'level' | 'area' | 'headcount'

export interface PromptSlot {
  id: string
  label: string
  type: 'select' | 'text'
  /** Варианты для type: 'select'. Первый — значение по умолчанию. */
  options?: string[]
  defaultValue: string
  placeholder?: string
  hint?: string
  /** Слот подставляется из профиля участника и не редактируется в карточке. */
  fromProfile?: ProfileField
}

export interface PromptRecipe {
  id: string
  title: string
  block: RecipeBlock
  /** Рутина, которую промпт убирает. Показывается в шапке карточки. */
  pain: string
  /** Что остаётся после. Пара pain/gain — главный аргумент на мероприятии. */
  gain: string
  pdRisk: PdRisk
  /** Текст промпта с плейсхолдерами вида {{slot_id}}. */
  template: string
  slots: PromptSlot[]
  /** Что участник обязан проверить руками. Рендерится под промптом. */
  manualCheck: string[]
}

export interface HrProfile {
  level: string
  /** Если не пусто — подставляется вместо level во все промпты. */
  levelCustom: string
  area: string
  headcount: string
  model: AiModel
}

export function resolveProfileLevel(profile: HrProfile): string {
  const custom = profile.levelCustom.trim()
  return custom || profile.level
}

export const BLOCK_LABELS: Record<RecipeBlock, string> = {
  docflow: 'Документооборот',
  analytics: 'Аналитика',
  hiring: 'Подбор и адаптация',
  assessment: 'Оценка и обучение',
}

export const PD_RISK_LABELS: Record<PdRisk, string> = {
  none: 'Без персональных данных',
  low: 'Проверьте обезличивание',
  high: 'Только обезличенные данные',
}

export const MODEL_LABELS: Record<AiModel, string> = {
  gigachat: 'GigaChat',
  yandex: 'YandexGPT / Алиса',
  qwen: 'Qwen',
  deepseek: 'DeepSeek',
}

/** Подсказка под конкретную модель — показывается рядом с кнопкой копирования. */
export const MODEL_HINTS: Record<AiModel, string> = {
  gigachat:
    'GigaChat лучше держит короткие пошаговые инструкции. Если ответ поплыл — отправьте промпт частями: сначала структура, потом наполнение.',
  yandex:
    'YandexGPT хорошо работает с явным форматом ответа. Оставляйте блок «Формат ответа» и не сокращайте его.',
  qwen: 'Qwen склонен добавлять свои разделы. Добавьте в конец: «Не добавляй разделы, которых нет в требованиях».',
  deepseek:
    'DeepSeek подробно рассуждает. Если нужен только результат — допишите: «Без рассуждений, сразу итоговый документ».',
}
