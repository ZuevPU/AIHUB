import { useMemo, useState } from 'react';
import {
  presentationPromptSections,
  presentationTechnicalFields,
  presentationSlideContentOptions,
  PRESENTATION_NEGATIVE_OPTIONS,
  buildPresentationPrompt,
  getInitialPresentationSelections,
} from '@/data/promptBuilderPresentationConfig';
import { SERVICE_LINKS } from '@/data/serviceLinks';
import { usePromptBuilderState, useToggleList } from '@/hooks/usePromptBuilderState';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { CheckboxOptionGroup } from '@/components/promptBuilder/CheckboxOptionGroup';
import { PromptBuilderSidebar } from '@/components/promptBuilder/PromptBuilderSidebar';
import { TechnicalCollapse } from '@/components/promptBuilder/TechnicalCollapse';

const TECH_WHY =
  'Формат, соотношение сторон и вес файла — явное ТЗ для экспорта и демонстрации.';

export function PromptBuilderPresentationPage() {
  const {
    selections,
    setSelections,
    customInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  } = usePromptBuilderState(getInitialPresentationSelections);
  const { ids: slideContentIds, setIds: setSlideContentIds, toggle: toggleSlideContent } = useToggleList(() =>
    presentationSlideContentOptions.map((o) => o.id)
  );
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(() =>
    PRESENTATION_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [includeTechnical, setIncludeTechnical] = useState(false);
  const [enhance, setEnhance] = useState(false);

  const fullPrompt = useMemo(
    () =>
      buildPresentationPrompt({
        values: selections,
        custom: customInputs,
        slideContentIds,
        negativeIds,
        includeTechnical,
        enhance,
      }),
    [selections, customInputs, slideContentIds, negativeIds, includeTechnical, enhance]
  );

  const handleReset = () => {
    resetSelections();
    setSlideContentIds(presentationSlideContentOptions.map((o) => o.id));
    setNegativeIds(PRESENTATION_NEGATIVE_OPTIONS.map((n) => n.id));
    setIncludeTechnical(false);
    setEnhance(false);
  };

  const handleRandomize = () => {
    randomizeFromSections(presentationPromptSections);
    const next = { ...getInitialPresentationSelections() };
    for (const field of presentationTechnicalFields) {
      if (field.options.length > 0) {
        const randomOption = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = randomOption.text;
      }
    }
    setSelections(next);
    setSlideContentIds(presentationSlideContentOptions.filter(() => Math.random() > 0.25).map((o) => o.id));
    setNegativeIds(PRESENTATION_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.35).map((n) => n.id));
    setEnhance(false);
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?type=prompt&category=designer">Назад к каталогу</BackLink>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов для презентаций
        </h1>
        <p className="text-zinc-600">
          Цель → аудитория → содержание → структура → визуал → оформление. Промпт как ТЗ для GigaChat, Qwen, Gamma.
        </p>
      </div>

      <div className={cn(siteUi.calloutInfo, 'mb-6')}>
        <label className="text-sm font-medium text-zinc-800">Тема презентации (необязательно)</label>
        <input
          type="text"
          value={customInputs.topicTheme || ''}
          onChange={(e) => handleCustomChange('topicTheme', e.target.value)}
          placeholder="Например: История Древнего Рима, цифровая грамотность педагогов…"
          className={cn(siteUi.inputRoundedXl, 'mt-2 bg-white')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {presentationPromptSections.map((section) => (
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
                  />
                ))}
              </div>
            </PromptSectionCard>
          ))}

          <PromptSectionCard
            icon="🟤"
            label="Контент слайдов"
            why="Явно задаёт, что может быть на слайдах: текст, медиа, графики."
          >
            <CheckboxOptionGroup
              options={presentationSlideContentOptions}
              selectedIds={slideContentIds}
              onToggle={toggleSlideContent}
            />
            <p className="mt-3 text-xs text-zinc-500">
              Пример: «текст, изображения, короткие видео с субтитрами» — отметьте нужные типы.
            </p>
          </PromptSectionCard>

          <TechnicalCollapse
            title="Технические параметры"
            why={TECH_WHY}
            open={includeTechnical}
            onOpenChange={setIncludeTechnical}
          >
            {presentationTechnicalFields.map((field) => (
              <PromptFieldBlock
                key={field.id}
                fieldId={field.id}
                label={field.label}
                options={field.options}
                selectedText={getValue(field.id)}
                customValue={customInputs[field.id] || ''}
                onSelect={handleSelect}
                onCustomChange={handleCustomChange}
              />
            ))}
          </TechnicalCollapse>

          <PromptSectionCard
            icon="🚫"
            label="Ограничения (negative)"
            why="Снижает типичные ошибки: стена текста, плохая читаемость, лишние шрифты."
          >
            <CheckboxOptionGroup
              options={PRESENTATION_NEGATIVE_OPTIONS}
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
            enhanceNote="Включено усиление: сторителлинг, чёткая структура, короче текст на слайдах"
            enhanceLabel="Сделать презентацию сильнее"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где создать презентацию?"
            serviceLinks={SERVICE_LINKS.presentation}
            textareaRows={22}
            textareaClassName={cn(siteUi.textareaPromptTall, 'min-h-[360px]')}
            beforeTextarea={
              !includeTechnical ? (
                <p className="text-xs text-zinc-500 mb-2">
                  Раскройте «Технические параметры», чтобы добавить строку с форматом и разрешением.
                </p>
              ) : null
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
