import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCcw, Shuffle, ExternalLink, Sparkles } from 'lucide-react';
import {
  imagePromptSections,
  NEGATIVE_OPTIONS,
  buildImagePrompt,
} from '@/data/promptBuilderImageConfig';
import { cn } from '@/lib/utils';

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
  const navigate = useNavigate();
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
    setNegativeIds(
      NEGATIVE_OPTIONS.filter(() => Math.random() > 0.4).map((n) => n.id)
    );
    setEnhance(false);
  };

  const handleMakeBetter = () => {
    setEnhance(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
      <button
        onClick={() => navigate('/catalog?category=designer')}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к каталогу
      </button>

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
            <div key={section.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.label}
                </h2>
                <p className="mt-2 text-sm text-violet-700/90 bg-violet-50/80 rounded-lg px-3 py-2 border border-violet-100">
                  <span className="font-medium">Зачем это нужно: </span>
                  {section.why}
                </p>
              </div>
              <div className="space-y-5">
                {section.fields.map((field) => (
                  <div key={field.id}>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                      {field.label}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.options.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelect(field.id, opt.text)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs transition-all border',
                            getValue(field.id) === opt.text && !customInputs[field.id]?.trim()
                              ? 'border-emerald-500 bg-emerald-50 text-zinc-900'
                              : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
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
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Negative prompt */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>⚫</span>
                Исключения (negative prompt)
              </h2>
              <p className="mt-2 text-sm text-violet-700/90 bg-violet-50/80 rounded-lg px-3 py-2 border border-violet-100">
                <span className="font-medium">Зачем это нужно: </span>
                Явно запрещает типичные артефакты нейросети — меньше «кривых» лиц и лишних пальцев.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {NEGATIVE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
                    negativeIds.includes(opt.id)
                      ? 'border-emerald-500 bg-emerald-50 text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={negativeIds.includes(opt.id)}
                    onChange={() => toggleNegative(opt.id)}
                    className="rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
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
                <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-2 border border-emerald-100">
                  Включено усиление: чёткий фокус и реалистичный свет
                </p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={18}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-y min-h-[280px] focus:outline-none focus:ring-2 focus:ring-zinc-300 whitespace-pre-wrap"
              />

              <button
                type="button"
                onClick={handleMakeBetter}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 border-violet-200 bg-violet-50 text-violet-900 hover:bg-violet-100 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Сделать лучше
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
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где создать изображение?</h3>
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
