import * as React from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PromptCopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function PromptCopyButton({ text, label = 'Скопировать промпт', className }: PromptCopyButtonProps) {
  const { copied, failed, copy } = useCopyToClipboard();

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('gap-2 w-full sm:w-auto', className)}
      onClick={() => copy(text)}
      aria-live="polite"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-emerald-600">Скопировано!</span>
        </>
      ) : failed ? (
        <>
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-amber-600">Не удалось — выделите вручную</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
