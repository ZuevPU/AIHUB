import type { TeacherEntity } from './types';
import { lessonConfig } from './lessonConfig';
import { taskConfig } from './taskConfig';
import { worksheetConfig } from './worksheetConfig';
import { interactiveEntityMeta } from './interactiveConfig';

export { lessonConfig, taskConfig, worksheetConfig };
export * from './types';
export * from './buildTeacherPrompt';
export * from './resolveTeacherProfile';
export * from './interactiveConfig';

export const TEACHER_ENTITY_CONFIGS = {
  lesson: lessonConfig,
  task: taskConfig,
  worksheet: worksheetConfig,
  interactive: interactiveEntityMeta,
} as const;

export function getEntityConfig(entity: TeacherEntity) {
  return TEACHER_ENTITY_CONFIGS[entity];
}

export const TEACHER_ENTITY_ORDER: TeacherEntity[] = ['lesson', 'task', 'worksheet', 'interactive'];
