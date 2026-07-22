import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { siteUi } from '@/lib/siteUi';
import { useIsEmbedded } from '@/hooks/useIsEmbedded';

export function BackLink({ to, children }: { to: string; children: React.ReactNode }) {
  const navigate = useNavigate();
  const isEmbedded = useIsEmbedded();

  if (isEmbedded) return null;

  return (
    <button type="button" onClick={() => navigate(to)} className={siteUi.backLink}>
      <ArrowLeft className="w-4 h-4" />
      {children}
    </button>
  );
}
