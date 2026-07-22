import { artifactsConfig } from './artifactsConfig';

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
  const styles = artifactsConfig.defaults.styles;
  const randomStyle = styles[Math.floor(Math.random() * styles.length)].id;

  return {
    category: randomCategory.id,
    type: randomType.id,
    style: randomStyle,
    topic: '',
  };
}
