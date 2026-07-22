export * from './types';
export { tools } from './tools';
export { editorPrompts } from './prompts/editor';
export { managerPrompts } from './prompts/manager';
export { designerPrompts } from './prompts/designer';
export { developerPrompts } from './prompts/developer';

import type { Material } from './types';
import { tools } from './tools';
import { editorPrompts } from './prompts/editor';
import { managerPrompts } from './prompts/manager';
import { designerPrompts } from './prompts/designer';
import { developerPrompts } from './prompts/developer';

const promptById = new Map<string, Material>(
  [...editorPrompts, ...managerPrompts, ...designerPrompts, ...developerPrompts].map((p) => [p.id, p])
);

const PROMPT_ORDER = [
  'prompt_007',
  'prompt_008',
  'prompt_009',
  'prompt_010',
  'prompt_011',
  'prompt_012',
  'prompt_013',
  'prompt_014',
  'prompt_015',
  'prompt_016',
  'prompt_017',
  'prompt_018',
  'prompt_019',
  'prompt_020',
  'prompt_021',
  'prompt_022',
  'prompt_036',
  'prompt_024',
  'prompt_025',
  'prompt_026',
  'prompt_027',
  'prompt_028',
  'prompt_029',
  'prompt_030',
  'prompt_031',
  'prompt_032',
  'prompt_033',
  'prompt_034',
  'prompt_035',
] as const;

export const materials: Material[] = [
  ...tools,
  ...PROMPT_ORDER.map((id) => promptById.get(id)!),
];
