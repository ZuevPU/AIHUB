import { useMemo, useState } from 'react';
import { Shield } from 'lucide-react';
import {
  analyticsPromptSections,
  analyticsVizOptions,
  ANALYTICS_QUALITY_OPTIONS,
  ANALYTICS_NEGATIVE_OPTIONS,
  buildAnalyticsPrompt,
  getInitialAnalyticsSelections,
} from '@/data/promptBuilderAnalyticsConfig';
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

export function PromptBuilderAnalyticsPage() {
  const {
    selections,
    customInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  } = usePromptBuilderState(getInitialAnalyticsSelections);
  const { ids: vizIds, setIds: setVizIds, toggle: toggleViz } = useToggleList(() =>
    analyticsVizOptions.map((o) => o.id)
  );
  const { ids: qualityIds, setIds: setQualityIds, toggle: toggleQuality } = useToggleList(() =>
    ANALYTICS_QUALITY_OPTIONS.map((q) => q.id)
  );
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(() =>
    ANALYTICS_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [enhance, setEnhance] = useState(false);

  const fullPrompt = useMemo(
    () =>
      buildAnalyticsPrompt({
        values: selections,
        custom: customInputs,
        vizIds,
        qualityIds,
        negativeIds,
        enhance,
      }),
    [selections, customInputs, vizIds, qualityIds, negativeIds, enhance]
  );

  const handleReset = () => {
    resetSelections();
    setVizIds(analyticsVizOptions.map((o) => o.id));
    setQualityIds(ANALYTICS_QUALITY_OPTIONS.map((q) => q.id));
    setNegativeIds(ANALYTICS_NEGATIVE_OPTIONS.map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    randomizeFromSections(analyticsPromptSections.filter((section) => section.id !== 'viz'));
    setVizIds(analyticsVizOptions.filter(() => Math.random() > 0.3).map((o) => o.id));
    setQualityIds(ANALYTICS_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(ANALYTICS_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?category=manager">Назад к каталогу</BackLink>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов: AI-анализ данных
        </h1>
        <p className="text-zinc-600">
          Единый структурированный промпт: роль → цель → глубина → формат → визуал → стиль → правила. Удобно для GigaChat и Qwen.
        </p>
      </div>

      <div className={cn(siteUi.calloutWarning, 'mb-8')}>
        <div className="flex items-start gap-3">
          <Shield className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-800">
            <p className="font-semibold text-zinc-900 mb-1">Этика и данные</p>
            <p>
              Соблюдайте 152-ФЗ при персональных данных; не путайте корреляцию с причинностью; при малых N агрегируйте выводы.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {analyticsPromptSections.map((section) => {
            if (section.id === 'viz') {
              return (
                <PromptSectionCard key={section.id} icon={section.icon} label={section.label} why={section.why}>
                  <CheckboxOptionGroup
                    options={analyticsVizOptions}
                    selectedIds={vizIds}
                    onToggle={toggleViz}
                  />
                </PromptSectionCard>
              );
            }

            return (
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
            );
          })}

          <PromptSectionCard
            icon="⚫"
            label="Требования к качеству анализа"
            why="Дополняют блок «ПРАВИЛА» в промпте — явные критерии качества."
          >
            <CheckboxOptionGroup
              options={ANALYTICS_QUALITY_OPTIONS}
              selectedIds={qualityIds}
              onToggle={toggleQuality}
            />
          </PromptSectionCard>

          <PromptSectionCard
            icon="🚫"
            label="Исключить"
            why="Методологические риски и типичные ошибки аналитики."
          >
            <CheckboxOptionGroup
              options={ANALYTICS_NEGATIVE_OPTIONS}
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
            enhanceNote="Усиление: дополнительный пункт в правилах про устойчивость и ограничения"
            enhanceLabel="Сделать анализ сильнее"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где использовать?"
            serviceLinks={SERVICE_LINKS.analytics}
            textareaRows={18}
            textareaClassName={siteUi.textareaPromptTall}
          />
        </div>
      </div>
    </PageContainer>
  );
}
