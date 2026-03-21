import * as React from 'react';
import { useState, useMemo } from 'react';
import { Copy, Check, RotateCcw, Shuffle, ExternalLink, FileText, Sparkles } from 'lucide-react';
import {
  editorPromptSections,
  editorTaskTypes,
  EDITOR_QUALITY_OPTIONS,
  EDITOR_NEGATIVE_OPTIONS,
  buildEditorPrompt,
  getInitialEditorSelections,
} from '@/data/promptBuilderEditorConfig';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { WhyHint } from '@/components/layout/WhyHint';

const serviceLinks = [
  { id: 'alice', label: 'Алиса AI', url: 'https://alice.yandex.ru/' },
  { id: 'gigachat', label: 'GigaChat', url: 'https://giga.chat/' },
  { id: 'deepseek', label: 'DeepSeek', url: 'https://chat.deepseek.com/' },
  { id: 'qwen', label: 'Qwen', url: 'https://chat.qwen.ai/' },
  { id: 'perplexity', label: 'Perplexity', url: 'https://www.perplexity.ai/' },
] as const;

export function PromptBuilderEditorPage() {
  const [taskTypeId, setTaskTypeId] = useState<string>(() => editorTaskTypes[0].id);
  const [selections, setSelections] = useState<Record<string, string>>(getInitialEditorSelections);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [readerGoal, setReaderGoal] = useState('');
  const [details, setDetails] = useState('');
  const [qualityIds, setQualityIds] = useState<string[]>(() => EDITOR_QUALITY_OPTIONS.map((q) => q.id));
  const [negativeIds, setNegativeIds] = useState<string[]>(() => EDITOR_NEGATIVE_OPTIONS.map((n) => n.id));
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

  const toggleQuality = (id: string) => {
    setQualityIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleNegative = (id: string) => {
    setNegativeIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const fullPrompt = useMemo(
    () =>
      buildEditorPrompt({
        taskTypeId,
        values: selections,
        custom: customInputs,
        topic,
        audience,
        readerGoal,
        details,
        qualityIds,
        negativeIds,
        enhance,
      }),
    [taskTypeId, selections, customInputs, topic, audience, readerGoal, details, qualityIds, negativeIds, enhance]
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
    setTaskTypeId(editorTaskTypes[0].id);
    setSelections(getInitialEditorSelections());
    setCustomInputs({});
    setTopic('');
    setAudience('');
    setReaderGoal('');
    setDetails('');
    setQualityIds(EDITOR_QUALITY_OPTIONS.map((q) => q.id));
    setNegativeIds(EDITOR_NEGATIVE_OPTIONS.map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    const next = { ...getInitialEditorSelections() };
    setCustomInputs({});
    for (const section of editorPromptSections) {
      for (const field of section.fields) {
        if (field.options.length > 0) {
          const r = field.options[Math.floor(Math.random() * field.options.length)];
          next[field.id] = r.text;
        }
      }
    }
    setSelections(next);
    setTaskTypeId(editorTaskTypes[Math.floor(Math.random() * editorTaskTypes.length)].id);
    setQualityIds(EDITOR_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(EDITOR_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

  const renderFieldBlock = (field: (typeof editorPromptSections)[0]['fields'][0]) => (
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
              getValue(field.id) === opt.text && !customInputs[field.id]?.trim() ? siteUi.chipOn : siteUi.chipOff
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

  const currentTask = editorTaskTypes.find((t) => t.id === taskTypeId);

  return (
    <PageContainer>
      <BackLink to="/catalog?category=editor">Назад к каталогу</BackLink>

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl mb-1">
          Конструктор промптов: редактор смыслов и текстов
        </h1>
        <p className="text-zinc-600">
          Единое ТЗ для модели: тип задачи (пресет), тема, аудитория, цель читателя, тон и правила. Подходит для Алисы,
          GigaChat, DeepSeek, Qwen и Perplexity.
        </p>
      </div>

      <div className={cn(siteUi.calloutWarning, 'mb-8')}>
        <div className="flex items-start gap-3">
          <FileText className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-800">
            <p className="font-semibold text-zinc-900 mb-1">Режим результата</p>
            <p>
              Пресеты «12 углов», «3 структуры сценария» и «10 подач без клише» дают{' '}
              <strong>идеи или скелет</strong>, не готовый лонгрид. «Анонс» и «Объяснение темы» —{' '}
              <strong>полноценный текст</strong>. Выберите пресет под задачу, чтобы промпт не противоречил сам себе.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>📌</span>
                Тип задачи (пресет)
              </h2>
              <WhyHint>Соответствует пяти промптам категории «Редактор» в каталоге: углы, сценарий, анти-клише, анонс, объяснение.</WhyHint>
            </div>
            <div className="space-y-3">
              {editorTaskTypes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTaskTypeId(t.id)}
                  className={cn(
                    'w-full text-left rounded-xl border p-4 transition-colors',
                    taskTypeId === t.id
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-zinc-900">{t.label}</span>
                    <span
                      className={cn(
                        'shrink-0 text-xs font-medium px-2 py-0.5 rounded-full',
                        t.outputMode === 'full' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      )}
                    >
                      {t.outputMode === 'full' ? 'готовый текст' : t.outputMode === 'skeleton' ? 'структура' : 'идеи'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 mt-1">{t.hint}</p>
                </button>
              ))}
            </div>
          </div>

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>📝</span>
                Смысл и тема
              </h2>
              <WhyHint>То, без чего модель не сможет попасть в задачу: тема, кто читает, зачем.</WhyHint>
            </div>
            <div className="space-y-4">
              <div>
                <p className={siteUi.fieldLabel}>Тема</p>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="О чём материал: одна фраза или абзац"
                  rows={3}
                  className={cn(siteUi.input, 'min-h-[5rem] resize-y block')}
                />
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Аудитория</p>
                <textarea
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Кто читает: возраст, роль, контекст"
                  rows={2}
                  className={cn(siteUi.input, 'min-h-[4rem] resize-y block')}
                />
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Цель читателя / зрителя</p>
                <textarea
                  value={readerGoal}
                  onChange={(e) => setReaderGoal(e.target.value)}
                  placeholder="Что человек должен понять, почувствовать или сделать после"
                  rows={2}
                  className={cn(siteUi.input, 'min-h-[4rem] resize-y block')}
                />
              </div>
              <div>
                <p className={siteUi.fieldLabel}>Дополнительно (необязательно)</p>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Дата и город для анонса, хронометраж сценария, уровень подготовки для объяснения, платформа…"
                  rows={2}
                  className={cn(siteUi.input, 'min-h-[4rem] resize-y block')}
                />
              </div>
            </div>
          </div>

          {editorPromptSections.map((section) => (
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

          <div className={siteUi.sectionCard}>
            <div className="mb-4">
              <h2 className={siteUi.sectionHeading}>
                <span>✓</span>
                Требования к качеству
              </h2>
              <WhyHint>Дополняют блок «ПРАВИЛА» в промпте.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {EDITOR_QUALITY_OPTIONS.map((opt) => (
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
              <WhyHint>Типичные риски для текстов и постов.</WhyHint>
            </div>
            <div className="flex flex-wrap gap-3">
              {EDITOR_NEGATIVE_OPTIONS.map((opt) => (
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

              {currentTask && (
                <p className="text-xs text-zinc-500 mb-2">
                  Пресет: <span className="font-medium text-zinc-700">{currentTask.label}</span>
                </p>
              )}

              {enhance && (
                <p className={siteUi.enhanceNote}>Усиление: в конце промпта — чек-лист самопроверки для автора</p>
              )}

              <textarea value={fullPrompt} readOnly rows={18} className={siteUi.textareaPromptTall} />

              <button
                type="button"
                onClick={() => setEnhance((e) => !e)}
                className={cn('w-full mt-3 flex items-center justify-center gap-2', siteUi.secondaryButton)}
              >
                <Sparkles className="w-5 h-5" />
                Сделать сильнее
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
