import { useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { siteUi } from '@/lib/siteUi';
import { WhyHint } from '@/components/layout/WhyHint';

interface TechnicalCollapseProps {
  title: string;
  why: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TechnicalCollapse({
  title,
  why,
  children,
  open: controlledOpen,
  onOpenChange,
}: TechnicalCollapseProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;

  const toggle = () => {
    const next = !open;
    if (onOpenChange) {
      onOpenChange(next);
    } else {
      setInternalOpen(next);
    }
  };

  return (
    <div className={siteUi.technicalCollapse}>
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between gap-2 text-left font-semibold text-zinc-900"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span>⚫</span>
          {title}
        </span>
        {open ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
      </button>
      <WhyHint>{why}</WhyHint>
      {open && <div className="mt-5 space-y-5 border-t border-zinc-200 pt-5">{children}</div>}
    </div>
  );
}
