import { cn } from '@/lib/utils';
import { TEACHER_ENTITY_ORDER, getEntityConfig, type TeacherEntity } from '@/data/teacherBuilder';

interface EntitySwitchProps {
  entity: TeacherEntity;
  onChange: (entity: TeacherEntity) => void;
}

export function EntitySwitch({ entity, onChange }: EntitySwitchProps) {
  const outcome = getEntityConfig(entity).outcome;

  return (
    <div className="mb-8">
      <div
        className="grid w-full max-w-3xl grid-cols-2 gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1 sm:grid-cols-4"
        role="tablist"
        aria-label="Тип материала"
      >
        {TEACHER_ENTITY_ORDER.map((id) => {
          const cfg = getEntityConfig(id);
          const active = entity === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className={cn(
                'flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-zinc-600">{outcome}</p>
    </div>
  );
}
