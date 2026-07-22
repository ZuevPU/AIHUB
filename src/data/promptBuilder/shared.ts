export interface PromptOption {
  id: string;
  text: string;
}

export interface PromptField {
  id: string;
  label: string;
  options: PromptOption[];
}

export interface PromptSection {
  id: string;
  label: string;
  icon: string;
  why: string;
  fields: PromptField[];
}

export function getInitialSelections(sections: PromptSection[]): Record<string, string> {
  const selections: Record<string, string> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.options.length > 0) {
        selections[field.id] = field.options[0].text;
      }
    }
  }
  return selections;
}

export function createValueResolver(
  values: Record<string, string>,
  custom: Record<string, string>
) {
  return (fieldId: string) => {
    const customValue = custom[fieldId]?.trim();
    if (customValue) return customValue;
    return values[fieldId] || '';
  };
}

export function randomizeSelectionsFromSections(sections: PromptSection[]): Record<string, string> {
  const next: Record<string, string> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      if (field.options.length > 0) {
        const randomOption = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = randomOption.text;
      }
    }
  }
  return next;
}

export function toggleListItem(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
