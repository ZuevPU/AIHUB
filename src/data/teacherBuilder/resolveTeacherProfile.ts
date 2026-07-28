import type { TeacherProfile } from './types';

/** Значения профиля для подстановки в промпты (свой текст переопределяет список). */
export function resolveTeacherProfile(profile: TeacherProfile): TeacherProfile {
  return {
    ...profile,
    equipment: profile.equipmentCustom.trim() || profile.equipment,
    aiRole: profile.aiRoleCustom.trim() || profile.aiRole,
  };
}

export function getProfileFieldForPrompt(profile: TeacherProfile, id: string): string {
  const resolved = resolveTeacherProfile(profile);
  const value = resolved[id as keyof TeacherProfile];
  return typeof value === 'string' ? value.trim() : '';
}
