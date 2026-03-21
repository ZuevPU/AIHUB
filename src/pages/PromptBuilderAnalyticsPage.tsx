import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCcw, Shuffle, ExternalLink, Shield, Sparkles } from 'lucide-react';
import {
  analyticsPromptSections,
  analyticsVizOptions,
  ANALYTICS_QUALITY_OPTIONS,
  ANALYTICS_NEGATIVE_OPTIONS,
  buildAnalyticsPrompt,
  getInitialAnalyticsSelections,
} from '@/data/promptBuilderAnalyticsConfig';
import { cn } from '@/lib/utils';

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'alicepro', label: 'Алиса Про', url: 'https://alicepro.yandex.ru/expert' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
] as const;

export function PromptBuilderAnalyticsPage() {
  const navigate = useNavigate();
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
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">{field.label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {field.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(field.id, opt.text)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs transition-all border text-left',
              getValue(field.id) === opt.text && !customInputs[field.id]?.trim()
                ? 'border-blue-500 bg-blue-50 text-zinc-900'
                : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
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
        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
      <button
        onClick={() => navigate('/catalog?category=manager')}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к каталогу
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов: AI-анализ данных
        </h1>
        <p className="text-zinc-600">
          Единый структурированный промпт: роль → цель → глубина → формат → визуал → стиль → правила. Удобно для GigaChat и Qwen.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5">
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
                <div key={section.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                      <span>{section.icon}</span>
                      {section.label}
                    </h2>
                    <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                      <span className="font-medium">Зачем это нужно: </span>
                      {section.why}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {analyticsVizOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={cn(
                          'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
                          vizIds.includes(opt.id)
                            ? 'border-blue-500 bg-blue-50 text-zinc-900'
                            : 'border-zinc-200 bg-white text-zinc-600'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={vizIds.includes(opt.id)}
                          onChange={() => toggleViz(opt.id)}
                          className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={section.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                    <span>{section.icon}</span>
                    {section.label}
                  </h2>
                  <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                    <span className="font-medium">Зачем это нужно: </span>
                    {section.why}
                  </p>
                </div>
                <div className="space-y-5">{section.fields.map(renderFieldBlock)}</div>
              </div>
            );
          })}

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>⚫</span>
                Требования к качеству анализа
              </h2>
              <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                <span className="font-medium">Зачем это нужно: </span>
                Дополняют блок «ПРАВИЛА» в промпте — явные критерии качества.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {ANALYTICS_QUALITY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
                    qualityIds.includes(opt.id)
                      ? 'border-blue-500 bg-blue-50 text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={qualityIds.includes(opt.id)}
                    onChange={() => toggleQuality(opt.id)}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>🚫</span>
                Исключить
              </h2>
              <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                <span className="font-medium">Зачем это нужно: </span>
                Методологические риски и типичные ошибки аналитики.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {ANALYTICS_NEGATIVE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
                    negativeIds.includes(opt.id)
                      ? 'border-blue-500 bg-blue-50 text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={negativeIds.includes(opt.id)}
                    onChange={() => toggleNegative(opt.id)}
                    className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="font-semibold text-zinc-900">Ваш промпт</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                    title="Сбросить"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                    title="Случайный выбор"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {enhance && (
                <p className="text-xs text-blue-800 bg-blue-50 rounded-lg px-3 py-2 mb-2 border border-blue-100">
                  Усиление: дополнительный пункт в правилах про устойчивость и ограничения
                </p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={18}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-y min-h-[400px] focus:outline-none focus:ring-2 focus:ring-zinc-300 whitespace-pre-wrap font-mono"
              />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 border-blue-200 bg-blue-50 text-blue-950 hover:bg-blue-100 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Сделать анализ сильнее
              </button>

              <button
                onClick={copyToClipboard}
                className={cn(
                  'w-full mt-3 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all',
                  copied ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                )}
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
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-900 hover:bg-zinc-50 hover:border-zinc-400 transition-colors"
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
    </div>
  );
}
