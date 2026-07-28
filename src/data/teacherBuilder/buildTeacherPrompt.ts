import type { BuilderField, EntityConfig, TeacherProfile } from './types';
import { getProfileFieldForPrompt } from './resolveTeacherProfile';

const MULTI_VALUE_SEP = ' • ';

const PLACEHOLDER_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

function fieldDefaults(config: EntityConfig): Record<string, string> {
  const map: Record<string, string> = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      map[field.id] = field.defaultValue;
    }
  }
  return map;
}

function resolvePlaceholder(
  id: string,
  profile: TeacherProfile,
  values: Record<string, string>,
  defaults: Record<string, string>
): string {
  if (
    id === 'subject' ||
    id === 'grade' ||
    id === 'topic' ||
    id === 'topicPlace' ||
    id === 'equipment' ||
    id === 'classProfile' ||
    id === 'aiRole'
  ) {
    const fromProfile = getProfileFieldForPrompt(profile, id);
    if (fromProfile) return fromProfile;
  }
  const fromValues = values[id]?.trim();
  if (fromValues) return fromValues;
  if (defaults[id] !== undefined) return defaults[id];
  return '';
}

export function formatMultiselectForPrompt(stored: string): string {
  return stored
    .split(MULTI_VALUE_SEP)
    .map((s) => s.trim())
    .filter(Boolean)
    .join('; ');
}

export function parseMultiselectStored(stored: string): string[] {
  return stored
    .split(MULTI_VALUE_SEP)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function joinMultiselectStored(items: string[]): string {
  return items.join(MULTI_VALUE_SEP);
}

export { MULTI_VALUE_SEP };

export function collapsePromptWhitespace(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

export function extractTemplatePlaceholderIds(template: string): string[] {
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(PLACEHOLDER_RE.source, 'g');
  while ((m = re.exec(template)) !== null) {
    set.add(m[1]);
  }
  return [...set];
}

export function buildTeacherPrompt(
  config: EntityConfig,
  profile: TeacherProfile,
  values: Record<string, string>
): string {
  const defaults = fieldDefaults(config);
  let result = config.template;

  const ids = extractTemplatePlaceholderIds(config.template);
  for (const id of ids) {
    let value = resolvePlaceholder(id, profile, values, defaults);
    if (id === 'taskFormat') {
      value = formatMultiselectForPrompt(value);
    }
    result = result.replace(new RegExp(`\\{\\{${id}\\}\\}`, 'g'), value);
  }

  return collapsePromptWhitespace(result);
}

export function getInitialEntityValues(config: EntityConfig): Record<string, string> {
  const values: Record<string, string> = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      values[field.id] = field.defaultValue;
    }
  }
  return values;
}

export function listAllFieldIds(config: EntityConfig): BuilderField[] {
  return config.sections.flatMap((s) => s.fields);
}
