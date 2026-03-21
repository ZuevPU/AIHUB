import * as React from 'react';
import { siteUi } from '@/lib/siteUi';

export function WhyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className={siteUi.whyHint}>
      <span className="font-medium">Зачем это нужно: </span>
      {children}
    </p>
  );
}
