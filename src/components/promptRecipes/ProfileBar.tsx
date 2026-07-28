import type { HrProfile } from '@/data/promptRecipes/types';
import { LEVEL_OPTIONS } from '@/data/promptRecipes/hrGovRecipes';
import { useIsEmbedded } from '@/hooks/useIsEmbedded';
import { cn } from '@/lib/utils';

interface ProfileBarProps {
  profile: HrProfile;
  onChange: (profile: HrProfile) => void;
}

const FIELD_CLASS =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ' +
  'transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

export function ProfileBar({ profile, onChange }: ProfileBarProps) {
  const isEmbedded = useIsEmbedded();

  return (
    <section
      className={cn(
        'sticky z-40 border-b border-slate-200 bg-white/95 backdrop-blur',
        isEmbedded ? 'top-0' : 'top-16'
      )}
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="text-sm font-medium text-slate-900">
          Уровень органа подставится во все промпты — при необходимости меняйте в шапке или в тексте карточки
        </p>
        <div className="mt-3 grid max-w-3xl gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Где работаете</span>
            <select
              value={profile.level}
              onChange={(e) => onChange({ ...profile, level: e.target.value })}
              className={FIELD_CLASS}
            >
              {LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-600">Свой вариант</span>
            <input
              type="text"
              value={profile.levelCustom}
              onChange={(e) => onChange({ ...profile, levelCustom: e.target.value })}
              placeholder="Например: министерства образования субъекта РФ"
              className={FIELD_CLASS}
            />
            <span className="mt-1 block text-xs text-slate-500">
              Пусто — используется значение из списка слева. Текст здесь подставится во все промпты.
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
