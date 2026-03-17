import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code, Copy, Check, RotateCcw, Shuffle } from 'lucide-react';
import { artifactsConfig } from '@/data/artifactsConfig';
import { generatePrompt, randomizeSelections, copyToClipboard } from '@/data/artifactsPromptGenerator';
import type { ArtifactSelections } from '@/data/artifactsPromptGenerator';
import { cn } from '@/lib/utils';

const QWEN_ARTIFACTS_URL = 'https://chat.qwen.ai/';

const INSTRUCTION_STEPS = [
  'Откройте интерфейс Qwen',
  'Выберите режим: «Артефакты»',
  'Добавьте задачу: прикрепите файл при необходимости',
  'Введите промпт и дождитесь генерации — ИИ создаст HTML/CSS/JS код',
  'Нажмите «Предварительный просмотр» или «Запустить», чтобы увидеть приложение прямо в чате',
  'Протестируйте приложение: проверьте работу кнопок и полей ввода, убедитесь, что логика верна — математическая и алгоритмическая',
  'Напишите правки агенту: «Исправь ошибку в расчёте» или «Сделай кнопку больше»',
  'Нажмите «Развернуть», чтобы открыть приложение на весь экран без интерфейса чата',
  'Скопируйте ссылку из адресной строки или через вкладку «Поделиться»',
  'Отправьте готовый продукт или разместите у себя на хостинге (это уже совсем другая история)',
];

export function DeveloperSinglePagePage() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<ArtifactSelections>({
    category: 'education',
    type: 'quiz',
    style: 'light',
    topic: '',
  });
  const [options, setOptions] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const category = artifactsConfig.categories.find((c) => c.id === selections.category);
  const availableTypes = category?.types ?? [];

  const fullPrompt = useMemo(() => {
    return generatePrompt({ ...selections, options: Object.keys(options).length ? options : undefined });
  }, [selections, options]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setSelections({
      category: 'education',
      type: 'quiz',
      style: 'light',
      topic: '',
    });
    setOptions({});
  };

  const handleRandomize = () => {
    const random = randomizeSelections();
    setSelections(random);
    setOptions({});
  };

  const setCategory = (id: string) => {
    const cat = artifactsConfig.categories.find((c) => c.id === id);
    const firstType = cat?.types[0];
    setSelections((prev) => ({
      ...prev,
      category: id,
      type: firstType?.id ?? prev.type,
    }));
    setOptions({});
  };

  const setType = (id: string) => {
    setSelections((prev) => ({ ...prev, type: id }));
    setOptions({});
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 max-w-6xl">
      <button
        onClick={() => navigate('/catalog?category=developer')}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к каталогу
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-2">
          Разработка одностраничных приложений
        </h1>
        <p className="text-zinc-600 text-lg">
          Используя агенты разработки, можно создавать простые и интересные наглядные инструменты, поведение и не только.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/30 p-6 mb-8">
        <div className="flex items-start gap-3">
          <Code className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-zinc-900 mb-1">Разработка на 17.03.2026</h3>
            <p className="text-sm text-zinc-700 mb-3">
              Вводится в Qwen, используя агент «Артефакты». Режим позволяет генерировать HTML/CSS/JS код и сразу видеть результат в чате.
            </p>
            <a
              href={QWEN_ARTIFACTS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Открыть Qwen → Артефакты
            </a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Инструкция: как создать приложение</h2>
        <ol className="space-y-4">
          {INSTRUCTION_STEPS.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white text-sm font-medium flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-zinc-700 pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 mb-4">Конструктор промпта</h2>
      <p className="text-zinc-600 mb-6">
        Выберите категорию, тему, тип артефакта и стиль — промпт сгенерируется автоматически.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <h3 className="font-medium text-zinc-900 mb-3">Категория</h3>
            <div className="flex flex-wrap gap-2">
              {artifactsConfig.categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    selections.category === c.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  )}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <h3 className="font-medium text-zinc-900 mb-3">Тема / Описание</h3>
            <input
              type="text"
              value={selections.topic}
              onChange={(e) => setSelections((prev) => ({ ...prev, topic: e.target.value }))}
              placeholder="Например: История Древнего Рима, Аналитика продаж, Подбор тура..."
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <h3 className="font-medium text-zinc-900 mb-3">Тип артефакта</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={cn(
                    'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                    selections.type === t.id
                      ? 'border-teal-500 bg-teal-50/50 text-teal-900'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  )}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 p-4 bg-white">
            <h3 className="font-medium text-zinc-900 mb-3">Стиль</h3>
            <div className="flex flex-wrap gap-2">
              {artifactsConfig.defaults.styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelections((prev) => ({ ...prev, style: s.id }))}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    selections.style === s.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-zinc-900">Готовый промпт</h3>
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
                className="w-full min-h-[min(50vh,400px)] rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-700 resize-y focus:outline-none focus:ring-2 focus:ring-teal-300 font-mono"
              />

              <button
                onClick={handleCopy}
                className={cn(
                  'w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all',
                  copied ? 'bg-emerald-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'
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
                <p className="text-xs text-zinc-500 mb-3">
                  Вставьте промпт в Qwen → Артефакты и получите готовое приложение.
                </p>
                <a
                  href={QWEN_ARTIFACTS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-teal-300 bg-teal-50 text-teal-700 text-sm font-medium hover:bg-teal-100 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть Qwen
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
