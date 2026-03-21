import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
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

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
] as const;

const TECH_WHY =
  'Длительность, FPS и разрешение задают «техническую рамку» генерации — удобно для сервисов с явными лимитами.';

export function PromptBuilderVideoPage() {
  const navigate = useNavigate();
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
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">{field.label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {field.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleSelect(field.id, opt.text)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs transition-all border',
              getValue(field.id) === opt.text && !customInputs[field.id]?.trim()
                ? 'border-amber-500 bg-amber-50 text-zinc-900'
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
        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
      />
    </div>
  );

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
          Конструктор видео-промптов
        </h1>
        <p className="text-zinc-600">
          Система: смысл сцены → динамика → камера → стиль → свет → качество. Промпт собирается по шаблону.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {videoPromptSections.map((section) => (
            <div key={section.id} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.label}
                </h2>
                <p className="mt-2 text-sm text-amber-900/90 bg-amber-50/80 rounded-lg px-3 py-2 border border-amber-100">
                  <span className="font-medium">Зачем это нужно: </span>
                  {section.why}
                </p>
              </div>
              <div className="space-y-5">{section.fields.map(renderFieldBlock)}</div>
            </div>
          ))}

          {/* Технические параметры — раскрываемый блок */}
          <div className="rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50/50 p-5">
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
            <p className="mt-2 text-sm text-amber-900/90 bg-amber-50/80 rounded-lg px-3 py-2 border border-amber-100">
              <span className="font-medium">Зачем это нужно: </span>
              {TECH_WHY}
            </p>
            {includeTechnical && (
              <div className="mt-5 space-y-5 border-t border-zinc-200 pt-5">
                {videoTechnicalFields.map(renderFieldBlock)}
              </div>
            )}
          </div>

          {/* Negative */}
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>🚫</span>
                Исключения (negative prompt)
              </h2>
              <p className="mt-2 text-sm text-amber-900/90 bg-amber-50/80 rounded-lg px-3 py-2 border border-amber-100">
                <span className="font-medium">Зачем это нужно: </span>
                Снижает типичные артефакты видеогенерации: дёрганье, искажения, лишний текст в кадре.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {VIDEO_NEGATIVE_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer text-sm px-3 py-2 rounded-lg border transition-colors',
                    negativeIds.includes(opt.id)
                      ? 'border-amber-500 bg-amber-50 text-zinc-900'
                      : 'border-zinc-200 bg-white text-zinc-600'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={negativeIds.includes(opt.id)}
                    onChange={() => toggleNegative(opt.id)}
                    className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
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

              {!includeTechnical && (
                <p className="text-xs text-zinc-500 mb-2">
                  Раскройте «Настройки качества», чтобы добавить строку с длительностью, FPS и разрешением.
                </p>
              )}

              {enhance && (
                <p className="text-xs text-amber-800 bg-amber-50 rounded-lg px-3 py-2 mb-2 border border-amber-100">
                  Включено усиление: cinematic look и плавное движение
                </p>
              )}

              <textarea
                value={fullPrompt}
                readOnly
                rows={20}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-y min-h-[320px] focus:outline-none focus:ring-2 focus:ring-zinc-300 whitespace-pre-wrap"
              />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl font-medium border-2 border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100 transition-colors"
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
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где создать видео?</h3>
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
