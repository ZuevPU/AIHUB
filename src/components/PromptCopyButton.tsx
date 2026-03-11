import * as React from 'react';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface PromptCopyButtonProps {
  text: string;
  className?: string;
}

export function PromptCopyButton({ text, className }: PromptCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-2 w-full sm:w-auto", className)}
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-emerald-600">Скопировано!</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          <span>Скопировать промпт</span>
        </>
      )}
    </Button>
  );
}
