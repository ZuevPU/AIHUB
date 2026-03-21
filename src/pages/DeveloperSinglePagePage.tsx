import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Code,
  Copy,
  Check,
  RotateCcw,
  Shuffle,
  Shield,
  Sparkles,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

const QWEN_ARTIFACTS_URL = 'https://chat.qwen.ai/';

const serviceLinks = [
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
] as const;

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

function randomizeMetaSelections(): Record<string, string> {
  const next = { ...getInitialSpaSelections() };
  for (const section of spaPromptSections) {
    for (const field of section.fields) {
      if (field.options.length) {
        const r = field.options[Math.floor(Math.random() * field.options.length)];
        next[field.id] = r.text;
      }
    }
  }
  return next;
}

export function DeveloperSinglePagePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('education');
  const [type, setType] = useState('quiz');
  const [style, setStyle] = useState('light');
  const [topic, setTopic] = useState('');
  const [metaSelections, setMetaSelections] = useState<Record<string, string>>(getInitialSpaSelections);
  const [metaCustom, setMetaCustom] = useState<Record<string, string>>({});
  const [templateOptions, setTemplateOptions] = useState<Record<string, string>>({});
  const [qualityIds, setQualityIds] = useState<string[]>(() => SPA_QUALITY_OPTIONS.map((q) => q.id));
  const [negativeIds, setNegativeIds] = useState<string[]>(() => SPA_NEGATIVE_OPTIONS.map((n) => n.id));
  const [enhance, setEnhance] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryData = artifactsConfig.categories.find((c) => c.id === category);
  const availableTypes = categoryData?.types ?? [];
  const typeData = categoryData?.types.find((t) => t.id === type);

  useEffect(() => {
    const tmpl = typeData?.promptTemplate ?? '';
    const keys = getTemplateOptionKeysForUi(tmpl);
    setTemplateOptions((prev) => {
      const next: Record<string, string> = {};
      for (const k of keys) {
        next[k] = prev[k] ?? SPA_DEFAULT_TEMPLATE_OPTIONS[k] ?? '';
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

  const toggleQuality = (id: string) => {
    setQualityIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
    const r = randomizeSelections();
    setCategory(r.category);
    setType(r.type);
    setStyle(r.style);
    setTopic('');
    setMetaSelections(randomizeMetaSelections());
    setMetaCustom({});
    setQualityIds(SPA_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(SPA_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

  const setCategoryId = (id: string) => {
    const cat = artifactsConfig.categories.find((c) => c.id === id);
    const firstType = cat?.types[0];
    setCategory(id);
    setType(firstType?.id ?? 'quiz');
  };

  const renderMetaField = (field: (typeof spaPromptSections)[0]['fields'][0]) => (
    <div key={field.id}>
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">{field.label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {field.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => handleMetaSelect(field.id, opt.text)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs transition-all border text-left',
              getMetaValue(field.id) === opt.text && !metaCustom[field.id]?.trim()
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
        value={metaCustom[field.id] || ''}
        onChange={(e) => handleMetaCustomChange(field.id, e.target.value)}
        placeholder="Свой вариант..."
        className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  );

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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов: одностраничные приложения
        </h1>
        <p className="text-zinc-600 text-lg">
          Единый структурированный промпт: контекст → задача → техтребования → приёмка → правила. Для Qwen Артефакты и
          других чатов с генерацией кода.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-teal-200 bg-teal-50/30 p-6 mb-6">
        <div className="flex items-start gap-3">
          <Code className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-zinc-900 mb-1">Разработка на 17.03.2026</h3>
            <p className="text-sm text-zinc-700 mb-3">
              Вводится в Qwen, используя агент «Артефакты». Режим позволяет генерировать HTML/CSS/JS код и сразу видеть
              результат в чате.
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

      <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>🧩</span>
                Артефакт
              </h2>
              <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                <span className="font-medium">Зачем это нужно: </span>
                Категория и тип задают сценарий и шаблон задачи в промпте.
              </p>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Категория</p>
                <div className="flex flex-wrap gap-2">
                  {artifactsConfig.categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoryId(c.id)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        category === c.id ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      )}
                    >
                      {c.icon} {c.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Тема / описание</p>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например: История Древнего Рима, Аналитика продаж, Подбор тура..."
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Тип артефакта</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {availableTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={cn(
                        'text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all',
                        type === t.id
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      )}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">Тема оформления (UI)</p>
                <div className="flex flex-wrap gap-2">
                  {artifactsConfig.defaults.styles.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStyle(s.id)}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        style === s.id ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {spaPromptSections.map((section) => (
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
              <div className="space-y-5">{section.fields.map(renderMetaField)}</div>
            </div>
          ))}

          {templateKeys.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                  <span>⚙️</span>
                  Параметры типа артефакта
                </h2>
                <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                  <span className="font-medium">Зачем это нужно: </span>
                  Эти значения подставляются в шаблон задачи вместо плейсхолдеров {'{questionsCount}'}, {'{data}'} и т.д.
                </p>
              </div>
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
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="font-semibold text-zinc-900 text-base flex items-center gap-2">
                <span>⚫</span>
                Требования к качеству кода
              </h2>
              <p className="mt-2 text-sm text-blue-900/90 bg-blue-50/80 rounded-lg px-3 py-2 border border-blue-100">
                <span className="font-medium">Зачем это нужно: </span>
                Дополняют блок «ПРАВИЛА» в промпте — явные критерии для генерации.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SPA_QUALITY_OPTIONS.map((opt) => (
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
                Типичные антипаттерны для безопасного vanilla SPA в одном файле.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SPA_NEGATIVE_OPTIONS.map((opt) => (
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
                    type="button"
                    onClick={handleReset}
                    className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
                    title="Сбросить"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
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
                  Усиление: дополнительный пункт в правилах про UX, граничные случаи и комментарии к логике
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
                Сделать промпт сильнее
              </button>

              <button
                type="button"
                onClick={handleCopy}
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
