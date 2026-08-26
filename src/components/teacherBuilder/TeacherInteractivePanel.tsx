import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import {
  getTeacherInteractiveCategories,
  TEACHER_INTERACTIVE_QUICK_PRESETS,
} from '@/data/teacherBuilder';
import {
  spaPromptSections,
  SPA_PLACEHOLDER_LABELS,
  SPA_DEFAULT_TEMPLATE_OPTIONS,
  SPA_UI_STYLE_PRESETS,
} from '@/data/promptBuilderSpaConfig';
import type { TeacherInteractiveCategoryId } from '@/data/teacherBuilder';

type InteractiveState = ReturnType<typeof import('@/hooks/useTeacherBuilder').useTeacherBuilder>['interactive'];

interface TeacherInteractivePanelProps {
  interactive: InteractiveState;
}

export function TeacherInteractivePanel({ interactive }: TeacherInteractivePanelProps) {
  const categories = getTeacherInteractiveCategories();

  return (
    <div className="space-y-8">
      <PromptSectionCard
        icon="🎮"
        label="Интерактив"
        why="Категории «Образование» и «Игры» — тот же набор типов, что в конструкторе разработчика. Тема берётся из профиля учителя."
      >
        <div className="space-y-5">
          <div>
            <p className={siteUi.fieldLabel}>Быстрый старт</p>
            <p className="mb-2 text-xs text-zinc-500">
              Выбирает категорию и один тип. Список типов ниже остаётся полным: «Тест» и «Карточки» — все типы
              образования, «Найди пару» и «Своя игра» — все типы игр.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TEACHER_INTERACTIVE_QUICK_PRESETS.map((preset) => {
                const isActive = interactive.category === preset.category && interactive.type === preset.type;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => interactive.applyPreset(preset)}
                    className={cn(
                      siteUi.bentoPromptCard,
                      'border-2 p-4 hover:scale-100',
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-zinc-200'
                    )}
                  >
                    <span className="font-semibold text-zinc-900">{preset.label}</span>
                    <span className="mt-1 block text-sm text-zinc-500">{preset.description}</span>
                    <span className="mt-2 block text-xs text-zinc-400">
                      {preset.category === 'education' ? 'Образование' : 'Игры'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className={siteUi.fieldLabel}>Категория</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={interactive.category === item.id}
                  onClick={() => interactive.setCategoryId(item.id as TeacherInteractiveCategoryId)}
                  className={cn(
                    siteUi.navPillBase,
                    interactive.category === item.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : siteUi.navPillOff
                  )}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={siteUi.fieldLabel}>Тип приложения</p>
            <p className="mb-2 text-xs text-zinc-500">
              Все типы выбранной категории. Сложность в блоке ниже не убирает «Свою игру», «Миллионера» или кликер.
            </p>
            <div className="grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {interactive.availableTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={interactive.type === item.id}
                  onClick={() => interactive.setType(item.id)}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                    interactive.type === item.id ? siteUi.typeTileOn : siteUi.typeTileOff
                  )}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={siteUi.fieldLabel}>Тема оформления (UI)</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SPA_UI_STYLE_PRESETS.map((item) => {
                const isSelected = interactive.style === item.id && !interactive.styleCustom.trim();
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      interactive.setStyle(item.id);
                      interactive.setStyleCustom('');
                    }}
                    className={cn(
                      'rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all',
                      isSelected ? siteUi.typeTileOn : siteUi.typeTileOff
                    )}
                  >
                    <span className="block text-zinc-900">{item.name}</span>
                    <span className="mt-0.5 block text-xs font-normal text-zinc-500">{item.hint}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={interactive.styleCustom}
              onChange={(e) => interactive.setStyleCustom(e.target.value)}
              placeholder="Свой вариант оформления…"
              className={cn(siteUi.inputRoundedXl, 'mt-3')}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
            <input
              type="checkbox"
              checked={interactive.enhance}
              onChange={(e) => interactive.setEnhance(e.target.checked)}
              className={siteUi.checkboxInput}
            />
            Усилить промпт (UX, граничные случаи — как «Сделать сильнее» у разработчика)
          </label>
        </div>
      </PromptSectionCard>

      {spaPromptSections.map((section) => (
        <PromptSectionCard key={section.id} icon={section.icon} label={section.label} why={section.why}>
          <div className="space-y-5">
            {section.fields.map((field) => (
              <PromptFieldBlock
                key={field.id}
                fieldId={field.id}
                label={field.label}
                options={field.options}
                selectedText={interactive.getMetaValue(field.id)}
                customValue={interactive.metaCustom[field.id] || ''}
                onSelect={interactive.handleMetaSelect}
                onCustomChange={interactive.handleMetaCustom}
              />
            ))}
          </div>
        </PromptSectionCard>
      ))}

      {interactive.templateKeys.length > 0 && (
        <PromptSectionCard
          icon="⚙️"
          label="Параметры типа"
          why="Подставляются в шаблон задачи (количество вопросов, карточек и т.д.)."
        >
          <div className="space-y-4">
            {interactive.templateKeys.map((key) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  {SPA_PLACEHOLDER_LABELS[key] ?? key}
                </label>
                <input
                  type="text"
                  value={interactive.templateOptions[key] ?? ''}
                  onChange={(e) =>
                    interactive.setTemplateOptions((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  placeholder={SPA_DEFAULT_TEMPLATE_OPTIONS[key] ?? ''}
                  className={siteUi.input}
                />
              </div>
            ))}
          </div>
        </PromptSectionCard>
      )}
    </div>
  );
}
