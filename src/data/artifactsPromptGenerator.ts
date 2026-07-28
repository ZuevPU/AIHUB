import { artifactsConfig } from './artifactsConfig';
import { SPA_UI_STYLE_PRESETS } from './promptBuilderSpaConfig';

export interface ArtifactSelections {
  category: string;
  type: string;
  style: string;
  topic: string;
  options?: Record<string, string>;
}

export function randomizeSelections(): ArtifactSelections {
  const categories = artifactsConfig.categories;
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomType = randomCategory.types[Math.floor(Math.random() * randomCategory.types.length)];
  const styles = SPA_UI_STYLE_PRESETS;
  const randomStyle = styles[Math.floor(Math.random() * styles.length)].id;

  return {
    category: randomCategory.id,
    type: randomType.id,
    style: randomStyle,
    topic: '',
  };
}
