import { artifactsConfig } from '@/data/artifactsConfig';
import {
  buildSpaPrompt,
  getInitialSpaSelections,
  type SpaQuickPreset,
} from '@/data/promptBuilderSpaConfig';
import type { TeacherProfile } from './types';
import { getProfileFieldForPrompt } from './resolveTeacherProfile';
import type { EntityConfig } from './types';

export const TEACHER_INTERACTIVE_CATEGORY_IDS = ['education', 'games'] as const;
export type TeacherInteractiveCategoryId = (typeof TEACHER_INTERACTIVE_CATEGORY_IDS)[number];

export const TEACHER_INTERACTIVE_QUICK_PRESETS: SpaQuickPreset[] = [
  {
    id: 'class-quiz',
    label: 'Тест на уроке',
    description: 'Викторина с баллами и обратной связью',
    category: 'education',
    type: 'quiz',
    style: 'apple',
    topic: '',
    meta: {
      role: 'ученика (тренажёр, самопроверка)',
      goal: 'обучение и проверка знаний',
      complexity: 'средняя (расширенные функции, 3–5 блоков)',
    },
  },
  {
    id: 'flashcards',
    label: 'Карточки',
    description: 'Повторение терминов и определений',
    category: 'education',
    type: 'flashcards',
    style: 'light',
    topic: '',
    meta: {
      role: 'ученика (тренажёр, самопроверка)',
      goal: 'обучение и проверка знаний',
      complexity: 'простая (базовые функции, мало блоков)',
    },
  },
  {
    id: 'memory-game',
    label: 'Найди пару',
    description: 'Игра на запоминание',
    category: 'games',
    type: 'memory',
    style: 'apple',
    topic: '',
    meta: {
      role: 'ученика (тренажёр, самопроверка)',
      goal: 'обучение и проверка знаний',
      complexity: 'средняя (расширенные функции, 3–5 блоков)',
    },
  },
  {
    id: 'jeopardy-class',
    label: 'Своя игра',
    description: 'Командная игра по теме урока',
    category: 'games',
    type: 'jeopardy',
    style: 'strict',
    topic: '',
    meta: {
      role: 'ученика (тренажёр, самопроверка)',
      goal: 'обучение и проверка знаний',
      complexity: 'высокая (полный функционал, много секций)',
    },
  },
];

export function getTeacherInteractiveCategories() {
  return artifactsConfig.categories.filter((c) =>
    TEACHER_INTERACTIVE_CATEGORY_IDS.includes(c.id as TeacherInteractiveCategoryId)
  );
}

export function buildTeacherInteractivePrompt(params: {
  profile: TeacherProfile;
  category: TeacherInteractiveCategoryId;
  type: string;
  styleId: string;
  styleCustom: string;
  templateOptions: Record<string, string>;
  metaSelections: Record<string, string>;
  metaCustom: Record<string, string>;
  enhance: boolean;
}): string {
  const subject = getProfileFieldForPrompt(params.profile, 'subject');
  const grade = getProfileFieldForPrompt(params.profile, 'grade');
  const topic = getProfileFieldForPrompt(params.profile, 'topic');
  const topicPlace = getProfileFieldForPrompt(params.profile, 'topicPlace');
  const equipment = getProfileFieldForPrompt(params.profile, 'equipment');
  const classProfile = getProfileFieldForPrompt(params.profile, 'classProfile');
  const aiRole = getProfileFieldForPrompt(params.profile, 'aiRole');

  const topicForSpa = [topic, subject, grade].filter(Boolean).join(' · ');

  const spaPrompt = buildSpaPrompt({
    category: params.category,
    type: params.type,
    styleId: params.styleId,
    styleCustom: params.styleCustom,
    topic: topicForSpa,
    templateOptions: params.templateOptions,
    values: params.metaSelections,
    custom: params.metaCustom,
    enhance: params.enhance,
  });

  const teacherBlock = `=== КОНТЕКСТ УРОКА (профиль учителя) ===
Предмет: ${subject}
Класс: ${grade}
Тема: ${topic}
Место темы в разделе: ${topicPlace}
Особенности класса: ${classProfile}
Оснащение: ${equipment}
Роль ИИ: ${aiRole}

=== МЕТОДИЧЕСКИЕ ОГРАНИЧЕНИЯ ===
— Интерактив должен работать при оснащении «${equipment}»; не требуй того, чего нет в классе.
— Тексты и задания — для класса «${grade}», тема «${topic}»; не выходи за рамки темы без пометки [расширение].
— Учитывай роль ИИ: «${aiRole}».
— Не выдумывай факты и цитаты; сомнительное помечай [проверить].

=== ПРОМПТ НА РАЗРАБОТКУ ПРИЛОЖЕНИЯ ===
`;

  const footer = `

=== ЗАВЕРШЕНИЕ ДЛЯ УЧИТЕЛЯ ===
После кода (или если код не запрошен — после описания) добавь блок «Мои допущения»: что ты домыслил о уровне класса, пройденных темах и времени на занятии. Что проверить перед показом ученикам.`;

  return `${teacherBlock}${spaPrompt}${footer}`.trim();
}

export function getInitialTeacherInteractiveMeta(): Record<string, string> {
  return getInitialSpaSelections();
}

export const interactiveEntityMeta: EntityConfig = {
  entity: 'interactive',
  label: 'Интерактивные задания',
  outcome:
    'Промпт на одностраничное приложение (викторина, игра, тренажёр) с учётом профиля класса — категории «Образование» и «Игры».',
  sections: [],
  template: '',
};
