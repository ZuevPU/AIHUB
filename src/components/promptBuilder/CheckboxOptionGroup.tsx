import { cn } from '@/lib/utils';
import { siteUi } from '@/lib/siteUi';

interface CheckboxOption {
  id: string;
  text: string;
}

interface CheckboxOptionGroupProps {
  options: CheckboxOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function CheckboxOptionGroup({ options, selectedIds, onToggle }: CheckboxOptionGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label
          key={opt.id}
          className={cn(
            siteUi.checkboxLabelBase,
            selectedIds.includes(opt.id) ? siteUi.checkboxOn : siteUi.checkboxOff
          )}
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(opt.id)}
            onChange={() => onToggle(opt.id)}
            className={siteUi.checkboxInput}
          />
          {opt.text}
        </label>
      ))}
    </div>
  );
}
