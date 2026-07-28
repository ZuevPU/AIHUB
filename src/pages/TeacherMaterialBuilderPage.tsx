import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { EntitySwitch } from '@/components/teacherBuilder/EntitySwitch';
import { TeacherProfileBar } from '@/components/teacherBuilder/TeacherProfileBar';
import { TeacherPromptPreview } from '@/components/teacherBuilder/TeacherPromptPreview';
import { TeacherInteractivePanel } from '@/components/teacherBuilder/TeacherInteractivePanel';
import { MultiSelectFieldBlock } from '@/components/teacherBuilder/MultiSelectFieldBlock';
import { useTeacherBuilder } from '@/hooks/useTeacherBuilder';
import type { BuilderField } from '@/data/teacherBuilder';

function fieldOptions(field: BuilderField) {
  return (field.options ?? []).map((text, index) => ({
    id: `${field.id}_${index}`,
    text,
  }));
}

export function TeacherMaterialBuilderPage() {
  const {
    entity,
    setEntity,
    config,
    profile,
    updateProfile,
    fullPrompt,
    getSelectValue,
    getCustomValue,
    getMultiselectValues,
    handleSelect,
    handleMultiselectToggle,
    handleCustomChange,
    resetCurrentEntity,
    interactive,
  } = useTeacherBuilder();

  return (
    <>
      <PageContainer>
        <BackLink to="/catalog?type=prompt&audience=obrazovanie">Назад к каталогу</BackLink>

        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-700">Для кого: образование</p>
          <h1 className="mb-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Конструктор материалов для учителя
          </h1>
          <p className="text-zinc-600">
            Один профиль — урок, задание, рабочий лист и интерактивное приложение. Соберите промпт и проверьте блок
            «Мои допущения» перед использованием в классе.
          </p>
        </div>

        <EntitySwitch entity={entity} onChange={setEntity} />
      </PageContainer>

      <TeacherProfileBar profile={profile} onChange={updateProfile} />

      <PageContainer>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {entity === 'interactive' ? (
              <TeacherInteractivePanel interactive={interactive} />
            ) : (
              config.sections.map((section) => (
                <PromptSectionCard
                  key={section.id}
                  icon="📋"
                  label={section.title}
                  why={section.caption ?? section.title}
                >
                  <div className="space-y-5">
                    {section.fields.map((field) => {
                      if (field.type === 'multiselect') {
                        return (
                          <MultiSelectFieldBlock
                            key={field.id}
                            fieldId={field.id}
                            label={field.label}
                            hint={field.hint}
                            options={field.options ?? []}
                            selected={getMultiselectValues(field.id)}
                            maxSelections={field.maxSelections ?? 5}
                            onToggle={(id, text) =>
                              handleMultiselectToggle(id, text, field.maxSelections ?? 5)
                            }
                          />
                        );
                      }
                      if (field.type === 'select') {
                        return (
                          <PromptFieldBlock
                            key={field.id}
                            fieldId={field.id}
                            label={field.label}
                            options={fieldOptions(field)}
                            selectedText={getSelectValue(field.id)}
                            customValue={getCustomValue(field.id)}
                            onSelect={handleSelect}
                            onCustomChange={handleCustomChange}
                          />
                        );
                      }
                      return (
                        <div key={field.id}>
                          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                            {field.label}
                          </p>
                          <input
                            type="text"
                            value={getSelectValue(field.id)}
                            onChange={(e) => handleCustomChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
                          {field.hint ? <p className="mt-1 text-xs text-zinc-500">{field.hint}</p> : null}
                        </div>
                      );
                    })}
                  </div>
                </PromptSectionCard>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <TeacherPromptPreview
              entity={entity}
              profile={profile}
              fullPrompt={fullPrompt}
              onResetEntity={resetCurrentEntity}
              onSwitchEntity={setEntity}
            />
          </div>
        </div>
      </PageContainer>
    </>
  );
}
