import * as React from 'react';
import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Shuffle, ExternalLink, Sparkles } from 'lucide-react';
import {
  imagePromptSections,
  NEGATIVE_OPTIONS,
  buildImagePrompt,
} from '@/data/promptBuilderImageConfig';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { WhyHint } from '@/components/layout/WhyHint';

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
] as const;

function getInitialSelections(): Record<string, string> {
  const s: Record<string, string> = {};
  for (const section of imagePromptSections) {
    for (const field of section.fields) {
      if (field.options.length > 0) {
        s[field.id] = field.options[0].text;
      }
    }
  }
  return s;
}

export function PromptBuilderPage() {
  const [selections, setSelections] = useState<Record<string, string>>(() => getInitialSelections());
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [negativeIds, setNegativeIds] = useState<string[]>(() =>
    NEGATIVE_OPTIONS.filter((n) => n.id !== 'text').map((n) => n.id)
  );
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

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

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
    setSelections(getInitialSelections());
    setCustomInputs({});
    setNegativeIds(NEGATIVE_OPTIONS.filter((n) => n.id !== 'text').map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    const next: Record<string, string> = {};
    setCustomInputs({});
    for (const section of imagePromptSections) {
      for (const field of section.fields) {
        if (field.options.length > 0) {
          const r = field.options[Math.floor(Math.random() * field.options.length)];
          next[field.id] = r.text;
        }
      }
    }
    setSelections(next);
    setNegativeIds(NEGATIVE_OPTIONS.filter(() => Math.random() > 0.4).map((n) => n.id));
    setEnhance(false);
  };

  const handleMakeBetter = () => {
    setEnhance(true);
  };

  return (
    <PageContainer>
      <BackLink to="/catalog?category=designer">Назад к каталогу</BackLink>

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
            <div key={section.id} className={siteUi.sectionCard}>
              <div className="mb-4">
                <h2 className={siteUi.sectionHeading}>
                  <span>{section.icon}</span>
                  {section.label}
                </h2>
                <WhyHint>{section.why}</WhyHint>
              </div>
              <div className="space-y-5">
                {section.fields.map((field) => (
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
                            getValue(field.id) === opt.text && !customInputs[field.id]?.trim()
                              ? siteUi.chipOn
                              : siteUi.chipOff
                          )}
                        >
                          {opt.text.length > 48 ? opt.text.slice(0, 48) + '…' : opt.text}
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
                ))}
              </div>
            </div>
          ))}

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>⚫</span>
                Исключения (negative prompt)
              </h2>
              <WhyHint>Явно запрещает типичные артефакты нейросети — меньше «кривых» лиц и лишних пальцев.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {NEGATIVE_OPTIONS.map((opt) => (
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
                  <button
                    type="button"
                    onClick={handleReset}
                    className={siteUi.iconButton}
                    title="Сбросить"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleRandomize}
                    className={siteUi.iconButton}
                    title="Случайный выбор"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {enhance && (
                <p className={siteUi.enhanceNote}>
                  Включено усиление: чёткий фокус и реалистичный свет
                </p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={18}
                className={siteUi.textareaPrompt}
              />

              <button
                type="button"
                onClick={handleMakeBetter}
                className={cn('w-full mt-3 flex items-center justify-center gap-2', siteUi.secondaryButton)}
              >
                <Sparkles className="w-5 h-5" />
                Сделать лучше
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
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где создать изображение?</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className={siteUi.linkOutbound}
                    >
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
