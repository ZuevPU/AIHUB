import { BUILDER_ROUTES } from '../../serviceLinks';
import { PLACEHOLDER_IMAGE, type Material } from '../types';

export const teacherPrompts: Material[] = [
  {
    id: 'teacher-material-builder',
    title: 'Конструктор материалов для учителя',
    image: PLACEHOLDER_IMAGE,
    description:
      'Соберите промпт для урока, задания, рабочего листа или интерактива (образование и игры): общий профиль класса и эталонные блоки для нейросети.',
    builderRoute: BUILDER_ROUTES['teacher-material-builder'],
    tags: ['учитель', 'урок', 'задание', 'рабочий лист', 'ФГОС', 'промпт'],
    categories: ['editor'],
    audience: ['obrazovanie'],
    type: 'prompt',
    layout: 'prompt',
  },
];
