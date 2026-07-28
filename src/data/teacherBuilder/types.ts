export type TeacherEntity = 'lesson' | 'task' | 'worksheet' | 'interactive';

export interface BuilderField {
  id: string;
  label: string;
  type: 'select' | 'text' | 'multiselect';
  options?: string[];
  defaultValue: string;
  placeholder?: string;
  hint?: string;
  maxSelections?: number;
}

export interface BuilderSection {
  id: string;
  title: string;
  caption?: string;
  fields: BuilderField[];
}

export interface EntityConfig {
  entity: TeacherEntity;
  label: string;
  outcome: string;
  sections: BuilderSection[];
  template: string;
}

export interface TeacherProfile {
  subject: string;
  grade: string;
  topic: string;
  topicPlace: string;
  equipment: string;
  equipmentCustom: string;
  classProfile: string;
  aiRole: string;
  aiRoleCustom: string;
}

export const DEFAULT_TEACHER_PROFILE: TeacherProfile = {
  subject: 'информатика',
  grade: '7 класс',
  topic: 'алгоритмы и исполнители',
  topicPlace: 'первый урок по теме',
  equipment: 'компьютерный класс, у каждого ПК',
  equipmentCustom: '',
  classProfile: 'базовый уровень',
  aiRole: 'ИИ только у меня как у учителя',
  aiRoleCustom: '',
};

export const PROFILE_SELECT_OPTIONS: Record<
  Exclude<keyof TeacherProfile, 'subject' | 'topic' | 'equipmentCustom' | 'aiRoleCustom'>,
  string[]
> = {
  grade: [
    '5 класс',
    '6 класс',
    '7 класс',
    '8 класс',
    '9 класс',
    '10 класс',
    '11 класс',
    'СПО 1 курс',
    'СПО 2 курс',
  ],
  topicPlace: [
    'первый урок по теме',
    'середина раздела',
    'завершение раздела',
    'повторение перед контрольной',
  ],
  equipment: [
    'компьютерный класс, у каждого ПК',
    'один ПК и проектор у учителя',
    'ноутбуки на группу',
    'смартфоны учеников',
    'без техники, только тетради',
  ],
  classProfile: [
    'базовый уровень',
    'углублённый уровень',
    'сильный разрыв в подготовке',
    'много неуспевающих',
    'есть ученики с ОВЗ, нужна адаптация',
  ],
  aiRole: [
    'ИИ только у меня как у учителя',
    'ученики используют ИИ как инструмент',
    'ИИ — объект изучения на этом уроке',
    'ИИ не используется учениками',
  ],
};
