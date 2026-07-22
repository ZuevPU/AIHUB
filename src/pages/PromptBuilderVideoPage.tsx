import { useMemo, useState } from 'react';
import {
  videoPromptSections,
  videoTechnicalFields,
  VIDEO_NEGATIVE_OPTIONS,
  buildVideoPrompt,
  getInitialVideoSelections,
} from '@/data/promptBuilderVideoConfig';
import { SERVICE_LINKS } from '@/data/serviceLinks';
import { usePromptBuilderState, useToggleList } from '@/hooks/usePromptBuilderState';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { CheckboxOptionGroup } from '@/components/promptBuilder/CheckboxOptionGroup';
import { PromptBuilderSidebar } from '@/components/promptBuilder/PromptBuilderSidebar';
import { TechnicalCollapse } from '@/components/promptBuilder/TechnicalCollapse';

const TECH_WHY =
  'Длительность, FPS и разрешение задают «техническую рамку» генерации — удобно для сервисов с явными лимитами.';

export function PromptBuilderVideoPage() {
  const {
    selections,
    setSelections,
    customInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  } = usePromptBuilderState(getInitialVideoSelections);
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(() =>
    VIDEO_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [includeTechnical, setIncludeTechnical] = useState(false);
  const [enhance, setEnhance] = useState(false);

  const fullPrompt = useMemo(
    () =>
      buildVideoPrompt({
        values: selections,
        custom: customInputs,
        negativeIds,
        includeTechnical,
        enhance,
      }),
    [selections, customInputs, negativeIds, includeTechnical, enhance]
  );

  const handleReset = () => {
    resetSelections();
    setNegativeIds(VIDEO_NEGATIVE_OPTIONS.map((n) => n.id));
    setIncludeTechnical(false);
    setEnhance(false);
  };

  const handleRandomize = () => {
    randomizeFromSections(videoPromptSections);
    const next = { ...getInitialVideoSelections() };
    for (const field of videoTechnicalFields) {
      if (field.options.length > 0) {
        const randomOption = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = randomOption.text;
      }
    }
    setSelections(next);
    setNegativeIds(VIDEO_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.35).map((n) => n.id));
    setEnhance(false);
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?category=designer">Назад к каталогу</BackLink>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор видео-промптов
        </h1>
        <p className="text-zinc-600">
          Система: смысл сцены → динамика → камера → стиль → свет → качество. Промпт собирается по шаблону.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {videoPromptSections.map((section) => (
            <PromptSectionCard key={section.id} icon={section.icon} label={section.label} why={section.why}>
              <div className="space-y-5">
                {section.fields.map((field) => (
                  <PromptFieldBlock
                    key={field.id}
                    fieldId={field.id}
                    label={field.label}
                    options={field.options}
                    selectedText={getValue(field.id)}
                    customValue={customInputs[field.id] || ''}
                    onSelect={handleSelect}
                    onCustomChange={handleCustomChange}
                    maxChipLength={48}
                  />
                ))}
              </div>
            </PromptSectionCard>
          ))}

          <TechnicalCollapse
            title="Настройки качества (технические параметры)"
            why={TECH_WHY}
            open={includeTechnical}
            onOpenChange={setIncludeTechnical}
          >
            {videoTechnicalFields.map((field) => (
              <PromptFieldBlock
                key={field.id}
                fieldId={field.id}
                label={field.label}
                options={field.options}
                selectedText={getValue(field.id)}
                customValue={customInputs[field.id] || ''}
                onSelect={handleSelect}
                onCustomChange={handleCustomChange}
                maxChipLength={48}
              />
            ))}
          </TechnicalCollapse>

          <PromptSectionCard
            icon="🚫"
            label="Исключения (negative prompt)"
            why="Снижает типичные артефакты видеогенерации: дёрганье, искажения, лишний текст в кадре."
          >
            <CheckboxOptionGroup
              options={VIDEO_NEGATIVE_OPTIONS}
              selectedIds={negativeIds}
              onToggle={toggleNegative}
            />
          </PromptSectionCard>
        </div>

        <div className="lg:col-span-1">
          <PromptBuilderSidebar
            fullPrompt={fullPrompt}
            enhance={enhance}
            onEnhanceToggle={() => setEnhance((value) => !value)}
            enhanceNote="Включено усиление: cinematic look и плавное движение"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где создать видео?"
            serviceLinks={SERVICE_LINKS.video}
            textareaRows={20}
            textareaClassName="min-h-[320px]"
            beforeTextarea={
              !includeTechnical ? (
                <p className="text-xs text-zinc-500 mb-2">
                  Раскройте «Настройки качества», чтобы добавить строку с длительностью, FPS и разрешением.
                </p>
              ) : null
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
