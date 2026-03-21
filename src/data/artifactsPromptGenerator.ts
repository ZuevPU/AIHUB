import { artifactsConfig } from './artifactsConfig';
import {
  buildSpaPrompt,
  getInitialSpaSelections,
  SPA_DEFAULT_TEMPLATE_OPTIONS,
  SPA_NEGATIVE_OPTIONS,
  SPA_QUALITY_OPTIONS,
} from './promptBuilderSpaConfig';

export interface ArtifactSelections {
  category: string;
  type: string;
  style: string;
  topic: string;
  options?: Record<string, string>;
}

/** @deprecated используйте SPA_DEFAULT_TEMPLATE_OPTIONS из promptBuilderSpaConfig */
export const DEFAULT_OPTIONS = SPA_DEFAULT_TEMPLATE_OPTIONS;

/**
 * Упрощённая генерация (мета-поля по умолчанию, все quality/negative включены).
 * Для полного конструктора используйте buildSpaPrompt из promptBuilderSpaConfig.
 */
export function generatePrompt(selections: ArtifactSelections): string {
  return buildSpaPrompt({
    category: selections.category,
    type: selections.type,
    styleId: selections.style,
    topic: selections.topic,
    templateOptions: selections.options ?? {},
    values: getInitialSpaSelections(),
    custom: {},
    qualityIds: SPA_QUALITY_OPTIONS.map((q) => q.id),
    negativeIds: SPA_NEGATIVE_OPTIONS.map((n) => n.id),
    enhance: false,
  });
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

export { buildSpaPrompt, getInitialSpaSelections } from './promptBuilderSpaConfig';
