import type { ReactNode } from 'react';
import { siteUi } from '@/lib/siteUi';
import { WhyHint } from '@/components/layout/WhyHint';

interface PromptSectionCardProps {
  icon: string;
  label: string;
  why: string;
  children: ReactNode;
}

export function PromptSectionCard({ icon, label, why, children }: PromptSectionCardProps) {
  return (
    <div className={siteUi.sectionCard}>
      <div className="mb-4">
        <h2 className={siteUi.sectionHeading}>
          <span>{icon}</span>
          {label}
        </h2>
        <WhyHint>{why}</WhyHint>
      </div>
      {children}
    </div>
  );
}
