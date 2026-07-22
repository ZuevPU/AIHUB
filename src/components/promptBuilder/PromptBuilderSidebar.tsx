import { useRef } from 'react';
import { Copy, Check, AlertCircle, RotateCcw, Shuffle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { ServiceLinksList } from '@/components/promptBuilder/ServiceLinksList';
import type { ServiceLink } from '@/data/serviceLinks';

interface PromptBuilderSidebarProps {
  fullPrompt: string;
  enhance: boolean;
  onEnhanceToggle: () => void;
  enhanceNote?: string;
  onReset: () => void;
  onRandomize: () => void;
  serviceLinksTitle: string;
  serviceLinks: readonly ServiceLink[];
  textareaRows?: number;
  textareaClassName?: string;
  beforeTextarea?: React.ReactNode;
  enhanceLabel?: string;
}

export function PromptBuilderSidebar({
  fullPrompt,
  enhance,
  onEnhanceToggle,
  enhanceNote,
  onReset,
  onRandomize,
  serviceLinksTitle,
  serviceLinks,
  textareaRows = 18,
  textareaClassName,
  beforeTextarea,
  enhanceLabel = 'Сделать лучше',
}: PromptBuilderSidebarProps) {
  const { copied, failed, copy } = useCopyToClipboard();
  const promptRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="lg:sticky lg:top-24 space-y-4">
      <div className={siteUi.sidebarCard}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="font-semibold text-zinc-900">Ваш промпт</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onReset}
              className={siteUi.iconButton}
              aria-label="Сбросить"
              title="Сбросить"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onRandomize}
              className={siteUi.iconButton}
              aria-label="Случайный выбор"
              title="Случайный выбор"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {beforeTextarea}

        {enhance && enhanceNote && <p className={siteUi.enhanceNote}>{enhanceNote}</p>}

        <textarea
          ref={promptRef}
          value={fullPrompt}
          readOnly
          rows={textareaRows}
          className={cn(siteUi.textareaPrompt, textareaClassName)}
        />

        <button
          type="button"
          onClick={onEnhanceToggle}
          className={cn('w-full mt-3 flex items-center justify-center gap-2', siteUi.secondaryButton)}
        >
          <Sparkles className="w-5 h-5" />
          {enhanceLabel}
        </button>

        <button
          type="button"
          onClick={() => copy(fullPrompt, promptRef.current)}
          className={cn(
            copied
              ? siteUi.primaryButtonSuccess
              : failed
                ? 'w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all bg-amber-500 text-white'
                : siteUi.primaryButton,
            'mt-3'
          )}
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5" />
              Скопировано!
            </>
          ) : failed ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Выделено — нажмите Ctrl+C
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Копировать промпт
            </>
          )}
        </button>

        <ServiceLinksList title={serviceLinksTitle} links={serviceLinks} />
      </div>
    </div>
  );
}
