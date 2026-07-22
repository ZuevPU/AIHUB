export type MaterialType = 'tool' | 'prompt';
export type Category = 'editor' | 'manager' | 'designer' | 'developer';
export type MaterialLayout = 'prompt' | 'tool';

export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23e4e4e7"/><stop offset="100%" style="stop-color:%23d4d4d8"/></linearGradient></defs><rect width="800" height="600" fill="url(%23g)"/></svg>'
  );

export interface Material {
  id: string;
  title: string;
  image: string;
  description: string;
  prompt?: string;
  prompts?: string[];
  promptLabels?: string[];
  example_result?: string;
  exampleCaption?: string;
  algorithmSteps?: readonly string[];
  builderRoute?: string;
  layout?: MaterialLayout;
  tags: string[];
  categories: Category[];
  type: MaterialType;
  files?: { name: string; url: string }[];
  url?: string;
  example_url?: string;
}
