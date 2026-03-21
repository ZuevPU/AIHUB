import * as React from 'react';
import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(siteUi.page, className)}>{children}</div>;
}

/** Каталог: без max-width на контейнере сетки */
export function PageWide({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn(siteUi.pageWide, className)}>{children}</div>;
}
