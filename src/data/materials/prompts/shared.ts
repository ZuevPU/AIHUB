/** Единая структура текстовых промптов для карточек каталога. */
export function buildStructuredPrompt(parts: {
  role: string;
  inputs: string[];
  task: string;
  structureHeading: string;
  structure: string;
  output: string;
}): string {
  return [
    `Роль: ${parts.role}`,
    '',
    'Входные данные',
    ...parts.inputs.map((line) => `• ${line}`),
    '',
    'Задача',
    parts.task,
    '',
    parts.structureHeading,
    parts.structure,
    '',
    'Формат вывода',
    parts.output,
  ].join('\n');
}
