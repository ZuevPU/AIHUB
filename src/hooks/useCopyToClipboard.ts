import { useCallback, useEffect, useRef, useState } from 'react';
import { copyToClipboard, selectPromptText } from '@/lib/clipboard';

export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copy = useCallback(async (text: string, fallbackElement?: HTMLElement | null) => {
    const success = await copyToClipboard(text);
    setCopied(success);
    setFailed(!success);

    if (!success && fallbackElement) {
      selectPromptText(fallbackElement);
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      setFailed(false);
      timeoutRef.current = null;
    }, resetMs);
  }, [resetMs]);

  return { copied, failed, copy };
}
