import { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import {
  editorPromptSections,
  editorTaskTypes,
  EDITOR_QUALITY_OPTIONS,
  EDITOR_NEGATIVE_OPTIONS,
  buildEditorPrompt,
  getInitialEditorSelections,
} from '@/data/promptBuilderEditorConfig';
import { SERVICE_LINKS } from '@/data/serviceLinks';
import { usePromptBuilderState, useToggleList } from '@/hooks/usePromptBuilderState';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { PageContainer } from '@/components/layout/PageContainer';
import { BackLink } from '@/components/layout/BackLink';
import { PromptSectionCard } from '@/components/promptBuilder/PromptSectionCard';
import { PromptFieldBlock } from '@/components/promptBuilder/PromptFieldBlock';
import { CheckboxOptionGroup } from '@/components/promptBuilder/CheckboxOptionGroup';
import { PromptBuilderSidebar } from '@/components/promptBuilder/PromptBuilderSidebar';

export function PromptBuilderEditorPage() {
  const [taskTypeId, setTaskTypeId] = useState<string>(() => editorTaskTypes[0].id);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [readerGoal, setReaderGoal] = useState('');
  const [details, setDetails] = useState('');
  const {
    selections,
    customInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  } = usePromptBuilderState(getInitialEditorSelections);
  const { ids: qualityIds, setIds: setQualityIds, toggle: toggleQuality } = useToggleList(() =>
    EDITOR_QUALITY_OPTIONS.map((q) => q.id)
  );
  const { ids: negativeIds, setIds: setNegativeIds, toggle: toggleNegative } = useToggleList(() =>
    EDITOR_NEGATIVE_OPTIONS.map((n) => n.id)
  );
  const [enhance, setEnhance] = useState(false);

  const currentTask = editorTaskTypes.find((task) => task.id === taskTypeId);

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

  const handleReset = () => {
    setTaskTypeId(editorTaskTypes[0].id);
    resetSelections();
    setTopic('');
    setAudience('');
    setReaderGoal('');
    setDetails('');
    setQualityIds(EDITOR_QUALITY_OPTIONS.map((q) => q.id));
    setNegativeIds(EDITOR_NEGATIVE_OPTIONS.map((n) => n.id));
    setEnhance(false);
  };

  const handleRandomize = () => {
    randomizeFromSections(editorPromptSections);
    setTaskTypeId(editorTaskTypes[Math.floor(Math.random() * editorTaskTypes.length)].id);
    setQualityIds(EDITOR_QUALITY_OPTIONS.filter(() => Math.random() > 0.2).map((q) => q.id));
    setNegativeIds(EDITOR_NEGATIVE_OPTIONS.filter(() => Math.random() > 0.25).map((n) => n.id));
    setEnhance(false);
  };

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
          <PromptSectionCard
            icon="📌"
            label="Тип задачи (пресет)"
            why="Соответствует пяти промптам категории «Редактор» в каталоге: углы, сценарий, анти-клише, анонс, объяснение."
          >
            <div className="space-y-3">
              {editorTaskTypes.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  aria-pressed={taskTypeId === task.id}
                  onClick={() => setTaskTypeId(task.id)}
                  className={cn(
                    'w-full text-left rounded-xl border p-4 transition-colors',
                    taskTypeId === task.id
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900/10'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-zinc-900">{task.label}</span>
                    <span
                      className={cn(
                        'shrink-0 text-xs font-medium px-2 py-0.5 rounded-full',
                        task.outputMode === 'full' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      )}
                    >
                      {task.outputMode === 'full' ? 'готовый текст' : task.outputMode === 'skeleton' ? 'структура' : 'идеи'}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 mt-1">{task.hint}</p>
                </button>
              ))}
            </div>
          </PromptSectionCard>

          <PromptSectionCard
            icon="📝"
            label="Смысл и тема"
            why="То, без чего модель не сможет попасть в задачу: тема, кто читает, зачем."
          >
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
          </PromptSectionCard>

          {editorPromptSections.map((section) => (
            <PromptSectionCard key={section.id} icon={section.icon} label={section.label} why={section.why}>
              <div className="space-y-5">
                {section.fields.map((field) => (
                  <PromptFieldBlock
                    key={field.id}
                    fieldId={field.id}
                    label={field.label}
                    options={field.options}
                    selectedText={getValue(field.id)}
                    customValue={customInputs[field.id] || ''}
                    onSelect={handleSelect}
                    onCustomChange={handleCustomChange}
                  />
                ))}
              </div>
            </PromptSectionCard>
          ))}

          <PromptSectionCard icon="✓" label="Требования к качеству" why="Дополняют блок «ПРАВИЛА» в промпте.">
            <CheckboxOptionGroup
              options={EDITOR_QUALITY_OPTIONS}
              selectedIds={qualityIds}
              onToggle={toggleQuality}
            />
          </PromptSectionCard>

          <PromptSectionCard icon="🚫" label="Исключить" why="Типичные риски для текстов и постов.">
            <CheckboxOptionGroup
              options={EDITOR_NEGATIVE_OPTIONS}
              selectedIds={negativeIds}
              onToggle={toggleNegative}
            />
          </PromptSectionCard>
        </div>

        <div className="lg:col-span-1">
          <PromptBuilderSidebar
            fullPrompt={fullPrompt}
            enhance={enhance}
            onEnhanceToggle={() => setEnhance((value) => !value)}
            enhanceNote="Усиление: в конце промпта — чек-лист самопроверки для автора"
            enhanceLabel="Сделать сильнее"
            onReset={handleReset}
            onRandomize={handleRandomize}
            serviceLinksTitle="Где использовать?"
            serviceLinks={SERVICE_LINKS.editor}
            textareaRows={18}
            textareaClassName={siteUi.textareaPromptTall}
            beforeTextarea={
              currentTask ? (
                <p className="text-xs text-zinc-500 mb-2">
                  Пресет: <span className="font-medium text-zinc-700">{currentTask.label}</span>
                </p>
              ) : null
            }
          />
        </div>
      </div>
    </PageContainer>
  );
}
