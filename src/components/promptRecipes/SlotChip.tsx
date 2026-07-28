import { ChevronDown } from 'lucide-react'
import type { PromptSlot } from '@/data/promptRecipes/types';

interface SlotChipProps {
  slot: PromptSlot
  value: string
  onChange: (value: string) => void
}

const CHIP_BASE =
  'inline-flex min-h-11 items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-2 ' +
  'text-sm text-indigo-900 transition-colors hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400 ' +
  'focus-within:ring-offset-1'

/** Слот из профиля не редактируется в карточке — его меняют один раз в шапке. */
export function SlotChip({ slot, value, onChange }: SlotChipProps) {
  if (slot.fromProfile) {
    return (
      <span
        className="inline-flex items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-1.5 py-0.5 text-slate-700"
        title="Значение из профиля — меняется в шапке страницы"
      >
        {value}
      </span>
    )
  }

  if (slot.type === 'select') {
    return (
      <span className={CHIP_BASE}>
        <span className="relative inline-flex items-center">
          <select
            aria-label={slot.label}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-11 cursor-pointer appearance-none bg-transparent py-1 pr-6 font-medium outline-none"
          >
            {slot.options?.map((option) => (
              <option key={option} value={option}>
                {option || '— без этого пункта —'}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 h-3 w-3 text-indigo-500" aria-hidden />
        </span>
      </span>
    )
  }

  const width = Math.min(Math.max(value.length, slot.placeholder?.length ?? 12) + 1, 64)

  return (
    <span className={CHIP_BASE}>
      <input
        aria-label={slot.label}
        value={value}
        placeholder={slot.placeholder}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: `${width}ch` }}
        className="min-h-11 bg-transparent py-1 font-medium outline-none placeholder:text-indigo-400"
      />
    </span>
  )
}
