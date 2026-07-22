import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Code, Shield } from 'lucide-react';
import { artifactsConfig } from '@/data/artifactsConfig';
import { randomizeSelections } from '@/data/artifactsPromptGenerator';
import {
  spaPromptSections,
  SPA_QUALITY_OPTIONS,
  SPA_NEGATIVE_OPTIONS,
  SPA_DEFAULT_TEMPLATE_OPTIONS,
  SPA_PLACEHOLDER_LABELS,
  buildSpaPrompt,
  getInitialSpaSelections,
  getTemplateOptionKeysForUi,
} from '@/data/promptBuilderSpaConfig';
import { DEVELOPER_ALGORITHM_STEPS, SERVICE_LINKS } from '@/data/serviceLinks';
import { randomizeSelectionsFromSections } from '@/data/promptBuilder/shared';
import { useToggleList } from '@/hooks/usePromptBuilderState';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { CheckboxOptionGroup } from '@/components/promptBuilder/CheckboxOptionGroup';
import { PromptBuilderSidebar } from '@/components/promptBuilder/PromptBuilderSidebar';

const QWEN_ARTIFACTS_URL = 'https://chat.qwen.ai/';

function randomizeMetaSelections(): Record<string, string> {
  return randomizeSelectionsFromSections(spaPromptSections);
}

export function DeveloperSinglePagePage() {
  const [category, setCategory] = useState('education');
  const [type, setType] = useState('quiz');
  const [style, setStyle] = useState('light');
  const [topic, setTopic] = useState('');
  const [metaSelections, setMetaSelections] = useState<Record<string, string>>(getInitialSpaSelections);
  const [metaCustom, setMetaCustom] = useState<Record<string, string>>({});
  const [templateOptions, setTemplateOptions] = useState<Record<string, string>>({});
  const { ids: qualityIds, setIds: setQualityIds, toggle: toggleQuality } = useToggleList(() =>
    SPA_QUALITY_OPTIONS.map((q) => q.id)
  );
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(() =>
    SPA_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [enhance, setEnhance] = useState(false);

  const categoryData = artifactsConfig.categories.find((item) => item.id === category);
  const availableTypes = categoryData?.types ?? [];
  const typeData = categoryData?.types.find((item) => item.id === type);

  useEffect(() => {
    const template = typeData?.promptTemplate ?? '';
    const keys = getTemplateOptionKeysForUi(template);
    setTemplateOptions((prev) => {
      const next: Record<string, string> = {};
      for (const key of keys) {
        next[key] = prev[key] ?? SPA_DEFAULT_TEMPLATE_OPTIONS[key] ?? '';
      }
      return next;
    });
  }, [category, type, typeData?.promptTemplate]);

  const getMetaValue = (fieldId: string) => {
    const custom = metaCustom[fieldId]?.trim();
    if (custom) return custom;
    return metaSelections[fieldId] || '';
  };

  const handleMetaSelect = (fieldId: string, text: string) => {
    setMetaSelections((prev) => ({ ...prev, [fieldId]: text }));
    setMetaCustom((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const handleMetaCustomChange = (fieldId: string, value: string) => {
    setMetaCustom((prev) => ({ ...prev, [fieldId]: value }));
  };

  const fullPrompt = useMemo(
    () =>
      buildSpaPrompt({
        category,
        type,
        styleId: style,
        topic,
        templateOptions,
        values: metaSelections,
        custom: metaCustom,
        qualityIds,
        negativeIds,
        enhance,
      }),
    [category, type, style, topic, templateOptions, metaSelections, metaCustom, qualityIds, negativeIds, enhance]
  );

  const templateKeys = useMemo(
    () => (typeData ? getTemplateOptionKeysForUi(typeData.promptTemplate) : []),
    [typeData]
  );

  const handleReset = () => {
    setCategory('education');
    setType('quiz');
    setStyle('light');
    setTopic('');
    setMetaSelections(getInitialSpaSelections());
    setMetaCustom({});
    setQualityIds(SPA_QUALITY_OPTIONS.map((q) => q.id));
    setNegativeIds(SPA_NEGATIVE_OPTIONS.map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    const random = randomizeSelections();
    setCategory(random.category);
    setType(random.type);
    setStyle(random.style);
    setTopic('');
    setMetaSelections(randomizeMetaSelections());
    setMetaCustom({});
    setQualityIds(SPA_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(SPA_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

  const setCategoryId = (id: string) => {
    const cat = artifactsConfig.categories.find((item) => item.id === id);
    const firstType = cat?.types[0];
    setCategory(id);
    setType(firstType?.id ?? 'quiz');
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?category=developer">Назад к каталогу</BackLink>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов: одностраничные приложения
        </h1>
        <p className="text-zinc-600 text-lg">
          Единый структурированный промпт: контекст → задача → техтребования → приёмка → правила. Для Qwen Артефакты и
          других чатов с генерацией кода.
        </p>
      </div>

      <div className={cn(siteUi.calloutInfo, 'mb-6')}>
        <div className="flex items-start gap-3">
          <Code className="w-6 h-6 text-zinc-700 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-zinc-900 mb-1">Разработка на 17.03.2026</h3>
            <p className="text-sm text-zinc-700 mb-3">
              Вводится в Qwen, используя агент «Артефакты». Режим позволяет генерировать HTML/CSS/JS код и сразу видеть
              результат в чате.
            </p>
            <a href={QWEN_ARTIFACTS_URL} target="_blank" rel="noopener noreferrer" className={siteUi.ctaButton}>
              <ExternalLink className="w-4 h-4" />
              Открыть Qwen → Артефакты
            </a>
          </div>
        </div>
      </div>

      <div className={cn(siteUi.calloutWarning, 'mb-8')}>
        <div className="flex items-start gap-3">
          <Shield className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-800">
            <p className="font-semibold text-zinc-900 mb-1">Безопасность и данные</p>
            <p>
              Не вставляйте в промпты персональные данные третьих лиц; проверяйте сгенерированный код перед публикацией.
            </p>
          </div>
        </div>
      </div>

      <div className={cn(siteUi.sectionCard, 'rounded-2xl p-6 mb-8')}>
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Инструкция: как создать приложение</h2>
        <ol className="space-y-4">
          {DEVELOPER_ALGORITHM_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center justify-center">
                {index + 1}
              </span>
              <span className="text-zinc-700 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PromptSectionCard icon="🧩" label="Артефакт" why="Категория и тип задают сценарий и шаблон задачи в промпте.">
            <div className="space-y-5">
              <div>
                <p className={siteUi.fieldLabel}>Категория</p>
                <div className="flex flex-wrap gap-2">
                  {artifactsConfig.categories.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={category === item.id}
                      onClick={() => setCategoryId(item.id)}
                      className={cn(
                        siteUi.navPillBase,
                        category === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : siteUi.navPillOff
                      )}
                    >
                      {item.icon} {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Тема / описание</p>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например: История Древнего Рима, Аналитика продаж, Подбор тура..."
                  className={siteUi.inputRoundedXl}
                />
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Тип артефакта</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {availableTypes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={type === item.id}
                      onClick={() => setType(item.id)}
                      className={cn(
                        'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                        type === item.id ? siteUi.typeTileOn : siteUi.typeTileOff
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Тема оформления (UI)</p>
                <div className="flex flex-wrap gap-2">
                  {artifactsConfig.defaults.styles.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={style === item.id}
                      onClick={() => setStyle(item.id)}
                      className={cn(
                        siteUi.navPillBase,
                        style === item.id ? 'bg-blue-600 text-white hover:bg-blue-700' : siteUi.navPillOff
                      )}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
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
                    selectedText={getMetaValue(field.id)}
                    customValue={metaCustom[field.id] || ''}
                    onSelect={handleMetaSelect}
                    onCustomChange={handleMetaCustomChange}
                  />
                ))}
              </div>
            </PromptSectionCard>
          ))}

          {templateKeys.length > 0 && (
            <PromptSectionCard
              icon="⚙️"
              label="Параметры типа артефакта"
              why={`Эти значения подставляются в шаблон задачи вместо плейсхолдеров {questionsCount}, {data} и т.д.`}
            >
              <div className="space-y-4">
                {templateKeys.map((key) => (
                  <div key={key}>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1 block">
                      {SPA_PLACEHOLDER_LABELS[key] ?? key}
                    </label>
                    <input
                      type="text"
                      value={templateOptions[key] ?? ''}
                      onChange={(e) =>
                        setTemplateOptions((prev) => ({
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

          <PromptSectionCard
            icon="⚫"
            label="Требования к качеству кода"
            why="Дополняют блок «ПРАВИЛА» в промпте — явные критерии для генерации."
          >
            <CheckboxOptionGroup
              options={SPA_QUALITY_OPTIONS}
              selectedIds={qualityIds}
              onToggle={toggleQuality}
            />
          </PromptSectionCard>

          <PromptSectionCard
            icon="🚫"
            label="Исключить"
            why="Типичные антипаттерны для безопасного vanilla SPA в одном файле."
          >
            <CheckboxOptionGroup
              options={SPA_NEGATIVE_OPTIONS}
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
            enhanceNote="Усиление: дополнительный пункт в правилах про UX, граничные случаи и комментарии к логике"
            enhanceLabel="Сделать промпт сильнее"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где использовать?"
            serviceLinks={SERVICE_LINKS.developer}
            textareaRows={18}
            textareaClassName={siteUi.textareaPromptTall}
          />
        </div>
      </div>
    </PageContainer>
  );
}
