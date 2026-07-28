import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';

interface MultiSelectFieldBlockProps {
  fieldId: string;
  label: string;
  hint?: string;
  options: string[];
  selected: string[];
  maxSelections: number;
  onToggle: (fieldId: string, text: string) => void;
}

export function MultiSelectFieldBlock({
  fieldId,
  label,
  hint,
  options,
  selected,
  maxSelections,
  onToggle,
}: MultiSelectFieldBlockProps) {
  return (
    <div>
      <p className={siteUi.fieldLabel}>
        {label}
        <span className="ml-2 normal-case font-normal text-zinc-400">
          ({selected.length}/{maxSelections})
        </span>
      </p>
      {hint ? <p className="mb-2 text-xs text-zinc-500">{hint}</p> : null}
      <div className="flex flex-wrap gap-2">
        {options.map((text) => {
          const isOn = selected.includes(text);
          const disabled = !isOn && selected.length >= maxSelections;
          return (
            <button
              key={text}
              type="button"
              aria-pressed={isOn}
              disabled={disabled}
              onClick={() => onToggle(fieldId, text)}
              className={cn(
                siteUi.chipBase,
                siteUi.mobileMinTouch,
                isOn ? siteUi.chipOn : siteUi.chipOff,
                disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {text.length > 56 ? `${text.slice(0, 56)}…` : text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
