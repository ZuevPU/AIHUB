import { useCallback, useState } from 'react';
import {
  getInitialSelections,
  randomizeSelectionsFromSections,
  toggleListItem,
  type PromptSection,
} from '@/data/promptBuilder/shared';

export function usePromptBuilderState(getInitial: () => Record<string, string>) {
  const [selections, setSelections] = useState<Record<string, string>>(getInitial);
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});

  const getValue = useCallback(
    (fieldId: string) => {
      const custom = customInputs[fieldId]?.trim();
      if (custom) return custom;
      return selections[fieldId] || '';
    },
    [customInputs, selections]
  );

  const handleSelect = useCallback((fieldId: string, text: string) => {
    setSelections((prev) => ({ ...prev, [fieldId]: text }));
    setCustomInputs((prev) => ({ ...prev, [fieldId]: '' }));
  }, []);

  const handleCustomChange = useCallback((fieldId: string, value: string) => {
    setCustomInputs((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const resetSelections = useCallback(() => {
    setSelections(getInitial());
    setCustomInputs({});
  }, [getInitial]);

  const randomizeFromSections = useCallback((sections: PromptSection[]) => {
    setSelections(randomizeSelectionsFromSections(sections));
    setCustomInputs({});
  }, []);

  return {
    selections,
    setSelections,
    customInputs,
    setCustomInputs,
    getValue,
    handleSelect,
    handleCustomChange,
    resetSelections,
    randomizeFromSections,
  };
}

export function useToggleList(initial: string[] | (() => string[])) {
  const [ids, setIds] = useState(initial);
  const toggle = useCallback((id: string) => {
    setIds((prev) => toggleListItem(prev, id));
  }, []);
  return { ids, setIds, toggle };
}

export { getInitialSelections };
