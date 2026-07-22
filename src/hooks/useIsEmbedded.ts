import { useMemo } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';

interface LayoutContext {
  isEmbedded: boolean;
}

export function useIsEmbedded(): boolean {
  const { search } = useLocation();
  const context = useOutletContext<LayoutContext | undefined>();

  return useMemo(() => {
    if (context?.isEmbedded) return true;
    const params = new URLSearchParams(search);
    if (params.get('embed') === '1') return true;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }, [context?.isEmbedded, search]);
}
