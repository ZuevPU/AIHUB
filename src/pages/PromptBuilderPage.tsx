import { useMemo, useState } from 'react';
import {
  imagePromptSections,
  NEGATIVE_OPTIONS,
  buildImagePrompt,
} from '@/data/promptBuilderImageConfig';
import { getInitialSelections } from '@/data/promptBuilder/shared';
import { SERVICE_LINKS } from '@/data/serviceLinks';
import { usePromptBuilderState, useToggleList } from '@/hooks/usePromptBuilderState';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { CheckboxOptionGroup } from '@/components/promptBuilder/CheckboxOptionGroup';
import { PromptBuilderSidebar } from '@/components/promptBuilder/PromptBuilderSidebar';

const initialNegative = () => NEGATIVE_OPTIONS.filter((n) => n.id !== 'text').map((n) => n.id);

export function PromptBuilderPage() {
  const {
    selections,
    customInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  } = usePromptBuilderState(() => getInitialSelections(imagePromptSections));
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(initialNegative);
  const [enhance, setEnhance] = useState(false);

  const fullPrompt = useMemo(
    () =>
      buildImagePrompt({
        values: selections,
        custom: customInputs,
        negativeIds,
        enhance,
      }),
    [selections, customInputs, negativeIds, enhance]
  );

  const handleReset = () => {
    resetSelections();
    setNegativeIds(initialNegative());
    setEnhance(false);
  };

  const handleRandomize = () => {
    randomizeFromSections(imagePromptSections);
    setNegativeIds(NEGATIVE_OPTIONS.filter(() => Math.random() > 0.4).map((n) => n.id));
    setEnhance(false);
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?type=prompt&category=designer">Назад к каталогу</BackLink>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промпта для изображений
        </h1>
        <p className="text-zinc-600">
          Категории → значения → готовый промпт. Выберите опции или введите свой вариант в полях.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {imagePromptSections.map((section) => (
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

          <PromptSectionCard
            icon="⚫"
            label="Исключения (negative prompt)"
            why="Явно запрещает типичные артефакты нейросети — меньше «кривых» лиц и лишних пальцев."
          >
            <CheckboxOptionGroup
              options={NEGATIVE_OPTIONS}
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
            enhanceNote="Включено усиление: чёткий фокус и реалистичный свет"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где создать изображение?"
            serviceLinks={SERVICE_LINKS.image}
          />
        </div>
      </div>
    </PageContainer>
  );
}
