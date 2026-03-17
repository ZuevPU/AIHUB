import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCcw, Shuffle, ExternalLink } from 'lucide-react';
import { promptBuilderCategories } from '@/data/promptBuilderCategories';
import { cn } from '@/lib/utils';

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
] as const;

const outputLabels: Record<string, string> = {
  subject: 'Главный объект',
  action: 'Действие и поза',
  location: 'Локация',
  time: 'Время и погода',
  style: 'Стиль',
  artist: 'Референс художника',
  camera: 'Камера и ракурс',
  lighting: 'Освещение',
  colors: 'Цветовая гамма',
  quality: 'Детали качества',
  negative: 'Исключить',
};

export function PromptBuilderPage() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const getValue = (categoryId: string) => {
    const custom = customInputs[categoryId]?.trim();
    if (custom) return custom;
    return selections[categoryId] || '';
  };

  const handleSelect = (categoryId: string, text: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: text }));
    setCustomInputs((prev) => ({ ...prev, [categoryId]: '' }));
  };

  const handleCustomChange = (categoryId: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [categoryId]: value }));
  };

  const fullPrompt = useMemo(() => {
    const lines: string[] = [];
    let num = 1;
    for (const cat of promptBuilderCategories) {
      const value = getValue(cat.id);
      if (value) {
        const label = outputLabels[cat.id] || cat.title;
        lines.push(`${num}. ${label}: ${value}`);
        num++;
      }
    }
    return lines.join('\n');
  }, [selections, customInputs]);

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
    setSelections({});
    setCustomInputs({});
  };

  const handleRandomize = () => {
    const newSelections: Record<string, string> = {};
    setCustomInputs({});
    for (const cat of promptBuilderCategories) {
      if (cat.options.length > 0) {
        const randomOption = cat.options[Math.floor(Math.random() * cat.options.length)];
        newSelections[cat.id] = randomOption.text;
      }
    }
    setSelections(newSelections);
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
          Выберите опции или введите свой вариант — промпт соберётся автоматически
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка: все категории компактно */}
        <div className="lg:col-span-2 space-y-4">
          {promptBuilderCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <h3 className="font-medium text-zinc-900 mb-3 text-sm">
                {category.icon} {category.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {category.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(category.id, opt.text)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs transition-all border',
                      getValue(category.id) === opt.text && !customInputs[category.id]?.trim()
                        ? 'border-emerald-500 bg-emerald-50 text-zinc-900'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
                    )}
                  >
                    {opt.text.length > 40 ? opt.text.slice(0, 40) + '…' : opt.text}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={customInputs[category.id] || ''}
                onChange={(e) => handleCustomChange(category.id, e.target.value)}
                placeholder="Свой вариант..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>
          ))}
        </div>

        {/* Правая колонка: результат */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between mb-3">
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

              <textarea
                value={fullPrompt}
                readOnly
                rows={12}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm text-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />

              <button
                onClick={copyToClipboard}
                className={cn(
                  'w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all',
                  copied ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                )}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Скопировано! ✅
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Копировать промпт
                  </>
                )}
              </button>

              <div className="mt-6 pt-4 border-t border-zinc-200">
                <h3 className="text-sm font-medium text-zinc-900 mb-3">Где можно создать?</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => copyToClipboard()}
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
