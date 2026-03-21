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
  videoPromptSections,
  videoTechnicalFields,
  VIDEO_NEGATIVE_OPTIONS,
  buildVideoPrompt,
  getInitialVideoSelections,
} from '@/data/promptBuilderVideoConfig';
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

const TECH_WHY =
  'Длительность, FPS и разрешение задают «техническую рамку» генерации — удобно для сервисов с явными лимитами.';

export function PromptBuilderVideoPage() {
  const [selections, setSelections] = useState<Record<string, string>>(getInitialVideoSelections);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [negativeIds, setNegativeIds] = useState<string[]>(() =>
    VIDEO_NEGATIVE_OPTIONS.map((n) => n.id)
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

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

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
    setSelections(getInitialVideoSelections());
    setCustomInputs({});
    setNegativeIds(VIDEO_NEGATIVE_OPTIONS.map((n) => n.id));
    setIncludeTechnical(false);
    setEnhance(false);
  };

  const handleRandomize = () => {
    const next: Record<string, string> = { ...getInitialVideoSelections() };
    setCustomInputs({});
    for (const section of videoPromptSections) {
      for (const field of section.fields) {
        if (field.options.length > 0) {
          const r = field.options[Math.floor(Math.random() * field.options.length)];
          next[field.id] = r.text;
        }
      }
    }
    for (const field of videoTechnicalFields) {
      if (field.options.length > 0) {
        const r = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = r.text;
      }
    }
    setSelections(next);
    setNegativeIds(VIDEO_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.35).map((n) => n.id));
    setEnhance(false);
  };

  const renderFieldBlock = (field: (typeof videoPromptSections)[0]['fields'][0]) => (
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
  );

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

          <div className={siteUi.technicalCollapse}>
            <button
              type="button"
              onClick={() => setIncludeTechnical((v) => !v)}
              className="w-full flex items-center justify-between gap-2 text-left font-semibold text-zinc-900"
            >
              <span className="flex items-center gap-2">
                <span>⚫</span>
                Настройки качества (технические параметры)
              </span>
              {includeTechnical ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
            </button>
            <WhyHint>{TECH_WHY}</WhyHint>
            {includeTechnical && (
              <div className="mt-5 space-y-5 border-t border-zinc-200 pt-5">
                {videoTechnicalFields.map(renderFieldBlock)}
              </div>
            )}
          </div>

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>🚫</span>
                Исключения (negative prompt)
              </h2>
              <WhyHint>Снижает типичные артефакты видеогенерации: дёрганье, искажения, лишний текст в кадре.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {VIDEO_NEGATIVE_OPTIONS.map((opt) => (
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
                  Раскройте «Настройки качества», чтобы добавить строку с длительностью, FPS и разрешением.
                </p>
              )}

              {enhance && (
                <p className={siteUi.enhanceNote}>Включено усиление: cinematic look и плавное движение</p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={20}
                className={cn(siteUi.textareaPrompt, 'min-h-[320px]')}
              />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
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
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где создать видео?</h3>
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
