import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';

interface PromptFieldBlockProps {
  fieldId: string;
  label: string;
  options: { id: string; text: string }[];
  selectedText: string;
  customValue: string;
  onSelect: (fieldId: string, text: string) => void;
  onCustomChange: (fieldId: string, value: string) => void;
  maxChipLength?: number;
}

export function PromptFieldBlock({
  fieldId,
  label,
  options,
  selectedText,
  customValue,
  onSelect,
  onCustomChange,
  maxChipLength = 52,
}: PromptFieldBlockProps) {
  const isCustomActive = Boolean(customValue.trim());

  return (
    <div>
      <p className={siteUi.fieldLabel}>{label}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map((opt) => {
          const isSelected = selectedText === opt.text && !isCustomActive;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(fieldId, opt.text)}
              className={cn(siteUi.chipBase, isSelected ? siteUi.chipOn : siteUi.chipOff)}
            >
              {opt.text.length > maxChipLength ? `${opt.text.slice(0, maxChipLength)}…` : opt.text}
            </button>
          );
        })}
      </div>
      <input
        type="text"
        value={customValue}
        onChange={(e) => onCustomChange(fieldId, e.target.value)}
        placeholder="Свой вариант (переопределяет выбор выше)..."
        className={siteUi.input}
      />
    </div>
  );
}
