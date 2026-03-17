import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RotateCcw, Shuffle, ExternalLink, Shield, Info } from 'lucide-react';
import {
  promptBuilderAnalyticsCategories,
  analyticsOutputLabels,
} from '@/data/promptBuilderAnalyticsCategories';
import { buildThreeStepPrompt } from '@/data/analyticsPromptGenerator';
import { cn } from '@/lib/utils';

const DASHBOARD_OPTION = 'Дашборд / Интерактивный отчёт';
const DASHBOARD_OUTPUT = 'Создай интерактивный дашборд';

const serviceLinks = [
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'alicepro', label: 'Алиса Про', url: 'https://alicepro.yandex.ru/expert' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
] as const;

const EXAMPLE_PROMPTS = {
  step1: `Ты — [роль]. Проанализируй загруженные данные: [описание источника].
1) Опиши структуру (столбцы, типы, N, период).
2) Выяви проблемы (пропуски %, дубли, форматы, выбросы).
3) Предложи 3-5 гипотез для проверки, релевантных [цель анализа].
--no correlation-as-causation, ignoring missing data`,

  step2: `Ты — PhD Data Scientist в [домен]. На основе гипотез составь план анализа:
1) Предобработка, 2) Метрики, 3) Стат.тесты, 4) Сегментация, 5) Визуализация, 6) Текстовая аналитика (если есть), 7) Валидация.
Оцени сложность шагов. Выход: структурированный план.`,

  step3: `Выполни анализ по плану. Предоставь отчёт в формате [формат]:
1) Ключевые метрики, 2) Сегменты, 3) Текстовые инсайты, 4) 3-5 выводов с данными, 5) Приоритизированные рекомендации для [аудитория], 6) Ограничения.
Предложи 3 графика для визуализации. --no [исключения]`,
};

export function PromptBuilderAnalyticsPage() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [domainSpecSelections, setDomainSpecSelections] = useState<Record<string, string[]>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const toggleSelect = (categoryId: string, text: string) => {
    const cat = promptBuilderAnalyticsCategories.find((c) => c.id === categoryId);
    const isSingle = cat?.singleSelect;
    setSelections((prev) => {
      const current = prev[categoryId] || [];
      const exists = current.includes(text);
      if (isSingle) {
        return { ...prev, [categoryId]: exists ? [] : [text] };
      }
      return {
        ...prev,
        [categoryId]: exists ? current.filter((t) => t !== text) : [...current, text],
      };
    });
  };

  const isSelected = (categoryId: string, text: string) =>
    (selections[categoryId] || []).includes(text);

  const toggleDomainSpec = (domainId: string, spec: string) => {
    setDomainSpecSelections((prev) => {
      const current = prev[domainId] || [];
      const exists = current.includes(spec);
      return {
        ...prev,
        [domainId]: exists ? current.filter((s) => s !== spec) : [...current, spec],
      };
    });
  };

  const isDomainSpecSelected = (domainId: string, spec: string) =>
    (domainSpecSelections[domainId] || []).includes(spec);

  const handleCustomChange = (categoryId: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [categoryId]: value }));
  };

  const getRoleParts = () => {
    const selected = selections.role || [];
    const parts: string[] = [];
    const roleCat = promptBuilderAnalyticsCategories.find((c) => c.id === 'role');
    if (!roleCat) return parts;
    selected.forEach((roleText) => {
      const opt = roleCat.options.find((o) => o.text === roleText);
      const specs = opt?.specs ? domainSpecSelections[opt.id] || [] : [];
      if (specs.length > 0) {
        parts.push(`${roleText} (${specs.join(', ')})`);
      } else {
        parts.push(roleText);
      }
    });
    return parts;
  };

  const fullPrompt = useMemo(() => {
    const role = selections.role || [];
    const goal = selections.goal || [];
    let outputFormat = selections.outputFormat || [];
    if (outputFormat.includes(DASHBOARD_OPTION)) {
      outputFormat = outputFormat.map((s) => (s === DASHBOARD_OPTION ? DASHBOARD_OUTPUT : s));
    }
    const depth = selections.depth || [];
    const domain = getRoleParts();
    const visualization = selections.visualization || [];
    const style = selections.style || [];
    const technical = selections.technical || [];
    const negative = selections.negative || [];
    const advanced = selections.advanced || [];

    return buildThreeStepPrompt({
      role,
      goal,
      outputFormat,
      depth,
      domain,
      visualization,
      style,
      technical,
      negative,
      advanced,
      customInputs,
      audience: '',
    });
  }, [selections, domainSpecSelections, customInputs]);

  const copyToClipboard = async (text?: string, exampleKey?: string) => {
    const toCopy = text ?? fullPrompt;
    try {
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setCopiedExample(exampleKey ?? null);
      setTimeout(() => {
        setCopied(false);
        setCopiedExample(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setSelections({});
    setDomainSpecSelections({});
    setCustomInputs({});
  };

  const handleRandomize = () => {
    const newSelections: Record<string, string[]> = {};
    setDomainSpecSelections({});
    setCustomInputs({});
    for (const cat of promptBuilderAnalyticsCategories) {
      if (cat.options.length > 0) {
        const count = cat.singleSelect ? 1 : Math.min(2, Math.floor(Math.random() * 2) + 1);
        const shuffled = [...cat.options].sort(() => Math.random() - 0.5);
        newSelections[cat.id] = shuffled.slice(0, count).map((o) => o.text);
      }
    }
    setSelections(newSelections);
  };

  const renderCategoryOptions = (category: (typeof promptBuilderAnalyticsCategories)[0]) => {
    const useGrid5x2 = category.id === 'goal';
    const isRoleWithSpecs = category.id === 'role' && category.options.some((o) => o.specs?.length);

    if (isRoleWithSpecs) {
      return (
        <div className="space-y-4">
          {category.options.map((opt) => (
            <div key={opt.id} className="rounded-lg border border-zinc-200 p-3">
              <div
                className={cn(
                  'flex items-start gap-2 cursor-pointer mb-2',
                  isSelected(category.id, opt.text) && 'text-blue-600'
                )}
                onClick={() => toggleSelect(category.id, opt.text)}
              >
                <span
                  className={cn(
                    'mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs',
                    isSelected(category.id, opt.text)
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-zinc-300'
                  )}
                >
                  {isSelected(category.id, opt.text) ? '✓' : ''}
                </span>
                <div>
                  <span className="text-sm font-medium">{opt.text}</span>
                  {opt.hint && <p className="text-xs text-zinc-500 mt-0.5">{opt.hint}</p>}
                </div>
              </div>
              {isSelected(category.id, opt.text) && opt.specs && opt.specs.length > 0 && (
                <div className="ml-6 mt-2 pl-3 border-l-2 border-blue-200 space-y-1.5">
                  <p className="text-xs text-zinc-500 font-medium">Специфика (можно несколько):</p>
                  {opt.specs.map((spec) => (
                    <label
                      key={spec}
                      className="flex items-center gap-2 cursor-pointer text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isDomainSpecSelected(opt.id, spec)}
                        onChange={() => toggleDomainSpec(opt.id, spec)}
                        className="rounded border-zinc-300"
                      />
                      <span>{spec}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (useGrid5x2) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {category.options.map((opt) => (
            <div
              key={opt.id}
              className={cn(
                'rounded-lg border p-2.5 transition-all cursor-pointer min-h-[60px] flex flex-col justify-center',
                isSelected(category.id, opt.text)
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
              )}
              onClick={() => toggleSelect(category.id, opt.text)}
              title={opt.hint}
            >
              <span className="text-xs font-medium text-zinc-900 line-clamp-3">{opt.text}</span>
            </div>
          ))}
        </div>
      );
    }

    const optionsContent = category.options.map((opt) => (
      <div
        key={opt.id}
        className={cn(
          'rounded-lg border p-3 transition-all cursor-pointer',
          isSelected(category.id, opt.text)
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-zinc-200 hover:border-zinc-300 bg-white'
        )}
        onClick={() => toggleSelect(category.id, opt.text)}
      >
        <div className="flex items-start gap-2">
          <span
            className={cn(
              'mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs',
              isSelected(category.id, opt.text)
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-zinc-300'
            )}
          >
            {isSelected(category.id, opt.text) ? '✓' : ''}
          </span>
          <div>
            <span className="text-sm font-medium text-zinc-900">{opt.text}</span>
            {opt.hint && <p className="text-xs text-zinc-500 mt-1">{opt.hint}</p>}
          </div>
        </div>
      </div>
    ));

    return <div className="space-y-2">{optionsContent}</div>;
  };

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
          Конструктор промптов: AI-аналитик данных
        </h1>
        <p className="text-zinc-600">
          3-шаговая механика: Диагностика → Планирование → Исполнение. Выберите несколько опций в каждой категории или введите свой вариант.
        </p>
      </div>

      {/* Блок: Этика и безопасность */}
      <div className="mb-8 rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-8 h-8 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">Этика и безопасность — главное</h3>
            <ul className="text-sm text-zinc-700 space-y-1 list-disc list-inside">
              <li>Соблюдайте 152-ФЗ: анонимизируйте персональные данные, агрегируйте при N&lt;10</li>
              <li>Не представляйте корреляцию как причинно-следственную связь</li>
              <li>Указывайте ограничения и уровень неопределённости выводов</li>
              <li>Проверяйте репрезентативность выборки перед обобщениями</li>
              <li>Рекомендации должны быть реализуемыми и проверяемыми</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {promptBuilderAnalyticsCategories.map((category) => (
            <div
              key={category.id}
              className={cn(
                'rounded-xl border p-4',
                category.id === 'advanced'
                  ? 'border-zinc-200 bg-zinc-50/50'
                  : 'border-zinc-200 bg-white'
              )}
            >
              <h3 className="font-medium text-zinc-900 mb-3 text-sm">
                {category.icon} {category.title}
                {category.id === 'advanced' && (
                  <span className="ml-2 text-xs font-normal text-zinc-500">(опционально)</span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 mb-3">
                {category.id === 'role'
                  ? 'Выберите роль, затем отметьте специфические требования'
                  : category.singleSelect
                    ? 'Выберите один вариант'
                    : 'Можно выбрать несколько вариантов'}
              </p>
              <div className="mb-4">
                {renderCategoryOptions(category)}
              </div>
              <input
                type="text"
                value={customInputs[category.id] || ''}
                onChange={(e) => handleCustomChange(category.id, e.target.value)}
                placeholder="Свой вариант (введите свой текст)..."
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              />
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-zinc-900">3-шаговый промпт</h3>
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

              <p className="text-xs text-zinc-500 mb-2">
                [АУДИТОРИЯ] и [КЛЮЧЕВОЙ ПРИОРИТЕТ] подставляются автоматически по выбранной роли.
              </p>

              <textarea
                value={fullPrompt}
                readOnly
                className="w-full min-h-[min(60vh,600px)] rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-xs text-zinc-700 resize-y focus:outline-none focus:ring-2 focus:ring-zinc-300 font-mono"
              />

              <button
                onClick={() => copyToClipboard()}
                className={cn(
                  'w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all',
                  copied && !copiedExample ? 'bg-emerald-500 text-white' : 'bg-zinc-900 text-white hover:bg-zinc-800'
                )}
              >
                {copied && !copiedExample ? (
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

      {/* Блок: Инструкции и примеры */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start gap-3 mb-6">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-zinc-900 mb-2">Инструкция и примеры промптов</h3>
            <p className="text-sm text-zinc-600 mb-4">
              Используйте 3-шаговую механику: загрузите данные в GigaChat и отправляйте промпты по порядку. Каждый шаг опирается на результат предыдущего.
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-600 mb-4">
          Промпт генерируется автоматически. [АУДИТОРИЯ] и [КЛЮЧЕВОЙ ПРИОРИТЕТ] подставляются по роли.
        </p>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-zinc-900 mb-2">Шаг 1: Диагностика</h4>
            <p className="text-xs text-zinc-500 mb-2">Структура данных, проблемы, гипотезы для проверки</p>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-zinc-100 text-xs text-zinc-700 overflow-x-auto whitespace-pre-wrap">
                {EXAMPLE_PROMPTS.step1}
              </pre>
              <button
                onClick={() => copyToClipboard(EXAMPLE_PROMPTS.step1, 'step1')}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700"
              >
                {copied && copiedExample === 'step1' ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 mb-2">Шаг 2: Планирование</h4>
            <p className="text-xs text-zinc-500 mb-2">План анализа: предобработка, метрики, тесты, визуализация</p>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-zinc-100 text-xs text-zinc-700 overflow-x-auto whitespace-pre-wrap">
                {EXAMPLE_PROMPTS.step2}
              </pre>
              <button
                onClick={() => copyToClipboard(EXAMPLE_PROMPTS.step2, 'step2')}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700"
              >
                {copied && copiedExample === 'step2' ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-zinc-900 mb-2">Шаг 3: Исполнение и отчёт</h4>
            <p className="text-xs text-zinc-500 mb-2">Выполнение по плану, выводы, рекомендации, ограничения</p>
            <div className="relative">
              <pre className="p-4 rounded-xl bg-zinc-100 text-xs text-zinc-700 overflow-x-auto whitespace-pre-wrap">
                {EXAMPLE_PROMPTS.step3}
              </pre>
              <button
                onClick={() => copyToClipboard(EXAMPLE_PROMPTS.step3, 'step3')}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-medium hover:bg-zinc-700"
              >
                {copied && copiedExample === 'step3' ? 'Скопировано' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Замените [роль], [домен], [формат], [аудитория] и [исключения] на значения из конструктора выше или свои формулировки.
        </p>
      </div>
    </div>
  );
}
