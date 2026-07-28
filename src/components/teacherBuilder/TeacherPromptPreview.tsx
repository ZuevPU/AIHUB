import { useRef, useState } from 'react';
import { AlertCircle, Check, ChevronDown, ChevronUp, Copy, Download, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { ServiceLinksList } from '@/components/promptBuilder/ServiceLinksList';
import { SERVICE_LINKS } from '@/data/serviceLinks';
import {
  getEntityConfig,
  TEACHER_ENTITY_ORDER,
  type TeacherEntity,
  type TeacherProfile,
} from '@/data/teacherBuilder';

interface ContextAction {
  target: TeacherEntity;
  label: string;
}

const SWITCH_LABELS: Partial<Record<TeacherEntity, Partial<Record<TeacherEntity, string>>>> = {
  lesson: {
    task: 'Сделать задание по этому уроку',
    worksheet: 'Сделать рабочий лист',
    interactive: 'Сделать интерактив по теме',
  },
  task: {
    lesson: 'Сделать урок по этой теме',
    worksheet: 'Сделать рабочий лист',
    interactive: 'Сделать интерактив по теме',
  },
  worksheet: {
    lesson: 'Сделать урок по этой теме',
    task: 'Сделать задание по этой теме',
    interactive: 'Сделать интерактив по теме',
  },
  interactive: {
    lesson: 'Сделать урок по этой теме',
    task: 'Сделать задание по этой теме',
    worksheet: 'Сделать рабочий лист',
  },
};

function contextActions(current: TeacherEntity): ContextAction[] {
  return TEACHER_ENTITY_ORDER.filter((id) => id !== current).map((target) => ({
    target,
    label: SWITCH_LABELS[current]?.[target] ?? getEntityConfig(target).label,
  }));
}

function downloadFileName(entity: TeacherEntity, profile: TeacherProfile): string {
  const slug = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё0-9-]/gi, '')
      .slice(0, 40) || 'material';
  const entitySlug =
    entity === 'lesson'
      ? 'urok'
      : entity === 'task'
        ? 'zadaniya'
        : entity === 'worksheet'
          ? 'rabochiy-list'
          : 'interaktiv';
  return `prompt-${entitySlug}-${slug(profile.subject)}-${slug(profile.grade)}.md`;
}

interface TeacherPromptPreviewProps {
  entity: TeacherEntity;
  profile: TeacherProfile;
  fullPrompt: string;
  onResetEntity: () => void;
  onSwitchEntity: (entity: TeacherEntity) => void;
  className?: string;
}

export function TeacherPromptPreview({
  entity,
  profile,
  fullPrompt,
  onResetEntity,
  onSwitchEntity,
  className,
}: TeacherPromptPreviewProps) {
  const { copied, failed, copy } = useCopyToClipboard();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const entityLabel = getEntityConfig(entity).label;
  const actions = contextActions(entity);
  const serviceLinks = entity === 'interactive' ? SERVICE_LINKS.developer : SERVICE_LINKS.editor;

  const handleDownload = () => {
    const blob = new Blob([fullPrompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFileName(entity, profile);
    link.click();
    URL.revokeObjectURL(url);
  };

  const panel = (
    <div className={siteUi.sidebarCard}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-zinc-900">Промпт: {entityLabel}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onResetEntity}
            className={siteUi.iconButton}
            aria-label="Сбросить настройки сущности"
            title="Сбросить настройки сущности"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={siteUi.iconButton}
            aria-label="Скачать промпт"
            title="Скачать .md"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea
        ref={promptRef}
        value={fullPrompt}
        readOnly
        rows={18}
        className={cn(siteUi.textareaPrompt, siteUi.textareaPromptTall, 'min-h-[320px] lg:min-h-[400px]')}
        aria-label="Собранный промпт"
      />

      <button
        type="button"
        onClick={() => copy(fullPrompt, promptRef.current)}
        className={cn(
          copied
            ? siteUi.primaryButtonSuccess
            : failed
              ? 'mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 font-medium text-white transition-all'
              : siteUi.primaryButton,
          'mt-3'
        )}
        aria-live="polite"
      >
        {copied ? (
          <>
            <Check className="h-5 w-5" />
            Скопировано!
          </>
        ) : failed ? (
          <>
            <AlertCircle className="h-5 w-5" />
            Выделено — нажмите Ctrl+C
          </>
        ) : (
          <>
            <Copy className="h-5 w-5" />
            Копировать промпт
          </>
        )}
      </button>

      <div className="mt-4 space-y-2">
        {actions.map((action) => (
          <button
            key={action.target}
            type="button"
            onClick={() => onSwitchEntity(action.target)}
            className={cn(siteUi.secondaryButton, siteUi.mobileMinTouch, 'text-left text-sm')}
          >
            {action.label}
          </button>
        ))}
      </div>

      <ServiceLinksList title="Где использовать?" links={serviceLinks} />
    </div>
  );

  return (
    <div className={className}>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className={cn(
            siteUi.secondaryButton,
            siteUi.mobileMinTouch,
            'flex w-full items-center justify-between gap-2 px-4'
          )}
          aria-expanded={mobileOpen}
        >
          <span>{mobileOpen ? 'Скрыть промпт' : 'Показать промпт'}</span>
          {mobileOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {mobileOpen ? <div className="mt-4">{panel}</div> : null}
      </div>
      <div className="hidden lg:block lg:sticky lg:top-24">
        {panel}
      </div>
    </div>
  );
}
