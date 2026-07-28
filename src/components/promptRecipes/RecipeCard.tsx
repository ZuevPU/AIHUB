import { useState } from 'react'
import { Check, Copy, RotateCcw, ShieldAlert } from 'lucide-react';
import type { PromptRecipe } from '@/data/promptRecipes/types';
import { PD_RISK_LABELS } from '@/data/promptRecipes/types';
import type { TemplateSegment } from '@/hooks/usePromptRecipes';
import { SlotChip } from '@/components/promptRecipes/SlotChip';

interface RecipeCardProps {
  recipe: PromptRecipe;
  segments: TemplateSegment[];
  onSlotChange: (slotId: string, value: string) => void;
  onReset: () => void;
  onCopy: () => Promise<boolean>;
}

const RISK_STYLES: Record<PromptRecipe['pdRisk'], string> = {
  none: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  low: 'border-amber-200 bg-amber-50 text-amber-800',
  high: 'border-rose-200 bg-rose-50 text-rose-800',
}

export function RecipeCard({ recipe, segments, onSlotChange, onReset, onCopy }: RecipeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await onCopy()
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{recipe.title}</h3>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_STYLES[recipe.pdRisk]}`}
          >
            <ShieldAlert className="h-3 w-3" aria-hidden />
            {PD_RISK_LABELS[recipe.pdRisk]}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
          <div className="rounded-lg border border-rose-100 bg-rose-50/80 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700/90">Так обычно</p>
            <p className="mt-1 text-sm leading-snug text-rose-900/90">{recipe.pain}</p>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800/90">С этим промптом</p>
            <p className="mt-1 text-sm leading-snug text-emerald-900/90">{recipe.gain}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-5">
        <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-800 sm:text-[13px]">
          {segments.map((segment, index) =>
            segment.type === 'slot' && segment.slot ? (
              <SlotChip
                key={`${segment.slot.id}-${index}`}
                slot={segment.slot}
                value={segment.value}
                onChange={(value) => onSlotChange(segment.slot!.id, value)}
              />
            ) : (
              <span key={index}>{segment.value}</span>
            ),
          )}
        </p>
      </div>

      <details className="border-t border-slate-100 px-5 py-3">
        <summary className="cursor-pointer text-sm font-medium text-slate-700 marker:text-indigo-500">
          Проверить вручную — {recipe.manualCheck.length}
        </summary>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {recipe.manualCheck.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </details>

      <footer className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? 'Скопировано' : 'Копировать промпт'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Сбросить
        </button>
      </footer>
    </article>
  )
}
