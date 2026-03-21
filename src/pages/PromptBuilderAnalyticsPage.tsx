import * as React from 'react';
import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Shuffle, ExternalLink, Shield, Sparkles } from 'lucide-react';
import {
  analyticsPromptSections,
  analyticsVizOptions,
  ANALYTICS_QUALITY_OPTIONS,
  ANALYTICS_NEGATIVE_OPTIONS,
  buildAnalyticsPrompt,
  getInitialAnalyticsSelections,
} from '@/data/promptBuilderAnalyticsConfig';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { WhyHint } from '@/components/layout/WhyHint';

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'alicepro', label: 'Алиса Про', url: 'https://alicepro.yandex.ru/expert' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
] as const;

export function PromptBuilderAnalyticsPage() {
  const [selections, setSelections] = useState<Record<string, string>>(getInitialAnalyticsSelections);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [vizIds, setVizIds] = useState<string[]>(() => analyticsVizOptions.map((o) => o.id));
  const [qualityIds, setQualityIds] = useState<string[]>(() => ANALYTICS_QUALITY_OPTIONS.map((q) => q.id));
  const [negativeIds, setNegativeIds] = useState<string[]>(() => ANALYTICS_NEGATIVE_OPTIONS.map((n) => n.id));
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

  const toggleViz = (id: string) => {
    setVizIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleQuality = (id: string) => {
    setQualityIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

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
    setSelections(getInitialAnalyticsSelections());
    setCustomInputs({});
    setVizIds(analyticsVizOptions.map((o) => o.id));
    setQualityIds(ANALYTICS_QUALITY_OPTIONS.map((q) => q.id));
    setNegativeIds(ANALYTICS_NEGATIVE_OPTIONS.map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    const next = { ...getInitialAnalyticsSelections() };
    setCustomInputs({});
    for (const section of analyticsPromptSections) {
      for (const field of section.fields) {
        if (field.options.length > 0) {
          const r = field.options[Math.floor(Math.random() * field.options.length)];
          next[field.id] = r.text;
        }
      }
    }
    setSelections(next);
    setVizIds(analyticsVizOptions.filter(() => Math.random() > 0.3).map((o) => o.id));
    setQualityIds(ANALYTICS_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(ANALYTICS_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

  const renderFieldBlock = (field: (typeof analyticsPromptSections)[0]['fields'][0]) => (
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
        placeholder="Свой вариант..."
        className={siteUi.input}
      />
    </div>
  );

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
                <div key={section.id} className={siteUi.sectionCard}>
                  <div className="mb-4">
                    <h2 className={siteUi.sectionHeading}>
                      <span>{section.icon}</span>
                      {section.label}
                    </h2>
                    <WhyHint>{section.why}</WhyHint>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {analyticsVizOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          siteUi.checkboxLabelBase,
                          vizIds.includes(opt.id) ? siteUi.checkboxOn : siteUi.checkboxOff
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={vizIds.includes(opt.id)}
                          onChange={() => toggleViz(opt.id)}
                          className={siteUi.checkboxInput}
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            return (
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
            );
          })}

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>⚫</span>
                Требования к качеству анализа
              </h2>
              <WhyHint>Дополняют блок «ПРАВИЛА» в промпте — явные критерии качества.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {ANALYTICS_QUALITY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    siteUi.checkboxLabelBase,
                    qualityIds.includes(opt.id) ? siteUi.checkboxOn : siteUi.checkboxOff
                  )}
                >
                  <input
                    type="checkbox"
                    checked={qualityIds.includes(opt.id)}
                    onChange={() => toggleQuality(opt.id)}
                    className={siteUi.checkboxInput}
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>🚫</span>
                Исключить
              </h2>
              <WhyHint>Методологические риски и типичные ошибки аналитики.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {ANALYTICS_NEGATIVE_OPTIONS.map((opt) => (
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

              {enhance && (
                <p className={siteUi.enhanceNote}>
                  Усиление: дополнительный пункт в правилах про устойчивость и ограничения
                </p>
              )}

              <textarea value={fullPrompt} readOnly rows={18} className={siteUi.textareaPromptTall} />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
                className={cn('w-full mt-3 flex items-center justify-center gap-2', siteUi.secondaryButton)}
              >
                <Sparkles className="w-5 h-5" />
                Сделать анализ сильнее
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
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где использовать?</h3>
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
