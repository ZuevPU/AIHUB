import * as React from 'react';
import { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  RotateCcw,
  Shuffle,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  presentationPromptSections,
  presentationTechnicalFields,
  presentationSlideContentOptions,
  PRESENTATION_NEGATIVE_OPTIONS,
  buildPresentationPrompt,
  getInitialPresentationSelections,
} from '@/data/promptBuilderPresentationConfig';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { WhyHint } from '@/components/layout/WhyHint';

const serviceLinks = [
  { id: 'gamma', label: 'Gamma', url: 'https://gamma.app/' },
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
] as const;

const TECH_WHY =
  'Формат, соотношение сторон и вес файла — явное ТЗ для экспорта и демонстрации.';

export function PromptBuilderPresentationPage() {
  const [selections, setSelections] = useState<Record<string, string>>(getInitialPresentationSelections);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [slideContentIds, setSlideContentIds] = useState<string[]>(() =>
    presentationSlideContentOptions.map((o) => o.id)
  );
  const [negativeIds, setNegativeIds] = useState<string[]>(() =>
    PRESENTATION_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [includeTechnical, setIncludeTechnical] = useState(false);
  const [enhance, setEnhance] = useState(false);
  const [copied, setCopied] = useState(false);

  const getValue = (fieldId: string) => {
    const custom = customInputs[fieldId]?.trim();
    if (custom) return custom;
    return selections[fieldId] || '';
  };

  const handleSelect = (fieldId: string, text: string) => {
    setSelections((prev) => ({ ...prev, [fieldId]: text }));
    setCustomInputs((prev) => ({ ...prev, [fieldId]: '' }));
  };

  const handleCustomChange = (fieldId: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [fieldId]: value }));
  };

  const toggleSlideContent = (id: string) => {
    setSlideContentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setSelections(getInitialPresentationSelections());
    setCustomInputs({});
    setSlideContentIds(presentationSlideContentOptions.map((o) => o.id));
    setNegativeIds(PRESENTATION_NEGATIVE_OPTIONS.map((n) => n.id));
    setIncludeTechnical(false);
    setEnhance(false);
  };

  const handleRandomize = () => {
    const next: Record<string, string> = { ...getInitialPresentationSelections() };
    setCustomInputs({});
    for (const section of presentationPromptSections) {
      for (const field of section.fields) {
        if (field.options.length > 0) {
          const r = field.options[Math.floor(Math.random() * field.options.length)];
          next[field.id] = r.text;
        }
      }
    }
    for (const field of presentationTechnicalFields) {
      if (field.options.length > 0) {
        const r = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = r.text;
      }
    }
    setSelections(next);
    setSlideContentIds(
      presentationSlideContentOptions.filter(() => Math.random() > 0.25).map((o) => o.id)
    );
    setNegativeIds(PRESENTATION_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.35).map((n) => n.id));
    setEnhance(false);
  };

  const renderFieldBlock = (field: (typeof presentationPromptSections)[0]['fields'][0]) => (
    <div key={field.id}>
      <p className={siteUi.fieldLabel}>{field.label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {field.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(field.id, opt.text)}
            className={cn(
              siteUi.chipBase,
              'text-left',
              getValue(field.id) === opt.text && !customInputs[field.id]?.trim()
                ? siteUi.chipOn
                : siteUi.chipOff
            )}
          >
            {opt.text.length > 52 ? opt.text.slice(0, 52) + '…' : opt.text}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={customInputs[field.id] || ''}
        onChange={(e) => handleCustomChange(field.id, e.target.value)}
        placeholder="Свой вариант (переопределяет выбор выше)..."
        className={siteUi.input}
      />
    </div>
  );

  return (
    <PageContainer>
      <BackLink to="/catalog?category=designer">Назад к каталогу</BackLink>

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
            <div key={section.id} className={siteUi.sectionCard}>
              <div className="mb-4">
                <h2 className={siteUi.sectionHeading}>
                  <span>{section.icon}</span>
                  {section.label}
                </h2>
                <WhyHint>{section.why}</WhyHint>
              </div>
              <div className="space-y-5">{section.fields.map(renderFieldBlock)}</div>
            </div>
          ))}

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>🟤</span>
                Контент слайдов
              </h2>
              <WhyHint>Явно задаёт, что может быть на слайдах: текст, медиа, графики.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {presentationSlideContentOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    siteUi.checkboxLabelBase,
                    slideContentIds.includes(opt.id) ? siteUi.checkboxOn : siteUi.checkboxOff
                  )}
                >
                  <input
                    type="checkbox"
                    checked={slideContentIds.includes(opt.id)}
                    onChange={() => toggleSlideContent(opt.id)}
                    className={siteUi.checkboxInput}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Пример: «текст, изображения, короткие видео с субтитрами» — отметьте нужные типы.
            </p>
          </div>

          <div className={siteUi.technicalCollapse}>
            <button
              type="button"
              onClick={() => setIncludeTechnical((x) => !x)}
              className="w-full flex items-center justify-between gap-2 text-left font-semibold text-zinc-900"
            >
              <span className="flex items-center gap-2">
                <span>⚫</span>
                Технические параметры
              </span>
              {includeTechnical ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
            </button>
            <WhyHint>{TECH_WHY}</WhyHint>
            {includeTechnical && (
              <div className="mt-5 space-y-5 border-t border-zinc-200 pt-5">
                {presentationTechnicalFields.map(renderFieldBlock)}
              </div>
            )}
          </div>

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>🚫</span>
                Ограничения (negative)
              </h2>
              <WhyHint>Снижает типичные ошибки: стена текста, плохая читаемость, лишние шрифты.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {PRESENTATION_NEGATIVE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    siteUi.checkboxLabelBase,
                    negativeIds.includes(opt.id) ? siteUi.checkboxOn : siteUi.checkboxOff
                  )}
                >
                  <input
                    type="checkbox"
                    checked={negativeIds.includes(opt.id)}
                    onChange={() => toggleNegative(opt.id)}
                    className={siteUi.checkboxInput}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className={siteUi.sidebarCard}>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-semibold text-zinc-900">Ваш промпт</h3>
                <div className="flex gap-2">
                  <button type="button" onClick={handleReset} className={siteUi.iconButton} title="Сбросить">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={handleRandomize} className={siteUi.iconButton} title="Случайный выбор">
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!includeTechnical && (
                <p className="text-xs text-zinc-500 mb-2">
                  Раскройте «Технические параметры», чтобы добавить строку с форматом и разрешением.
                </p>
              )}

              {enhance && (
                <p className={siteUi.enhanceNote}>
                  Включено усиление: сторителлинг, чёткая структура, короче текст на слайдах
                </p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={22}
                className={cn(siteUi.textareaPromptTall, 'min-h-[360px]')}
              />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
                className={cn('w-full mt-3 flex items-center justify-center gap-2', siteUi.secondaryButton)}
              >
                <Sparkles className="w-5 h-5" />
                Сделать презентацию сильнее
              </button>

              <button
                type="button"
                onClick={copyToClipboard}
                className={cn(copied ? siteUi.primaryButtonSuccess : siteUi.primaryButton, 'mt-3')}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Скопировано!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Копировать промпт
                  </>
                )}
              </button>

              <div className="mt-6 pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где создать презентацию?</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceLinks.map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className={siteUi.linkOutbound}>
                      <ExternalLink className="w-4 h-4" />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
