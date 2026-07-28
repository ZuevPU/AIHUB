import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  buildTeacherPrompt,
  buildTeacherInteractivePrompt,
  DEFAULT_TEACHER_PROFILE,
  getEntityConfig,
  getInitialEntityValues,
  getInitialTeacherInteractiveMeta,
  joinMultiselectStored,
  lessonConfig,
  parseMultiselectStored,
  taskConfig,
  worksheetConfig,
  type TeacherEntity,
  type TeacherInteractiveCategoryId,
  type TeacherProfile,
} from '@/data/teacherBuilder';
import {
  getComplexityKeyFromMeta,
  filterArtifactTypesByComplexity,
  getTemplateOptionKeysForUi,
  SPA_DEFAULT_TEMPLATE_OPTIONS,
} from '@/data/promptBuilderSpaConfig';
import { artifactsConfig } from '@/data/artifactsConfig';

const DEFAULT_INTERACTIVE_CATEGORY: TeacherInteractiveCategoryId = 'education';
const DEFAULT_INTERACTIVE_TYPE = 'quiz';

function getInitialInteractiveTemplateOptions(type: string) {
  const cat = artifactsConfig.categories.find((c) => c.id === DEFAULT_INTERACTIVE_CATEGORY);
  const typeData = cat?.types.find((t) => t.id === type);
  const template = typeData?.promptTemplate ?? '';
  const keys = getTemplateOptionKeysForUi(template);
  const next: Record<string, string> = {};
  for (const key of keys) {
    next[key] = SPA_DEFAULT_TEMPLATE_OPTIONS[key] ?? '';
  }
  return next;
}

export function useTeacherBuilder() {
  const [entity, setEntity] = useState<TeacherEntity>('lesson');
  const [profile, setProfile] = useState<TeacherProfile>({ ...DEFAULT_TEACHER_PROFILE });
  const [lessonValues, setLessonValues] = useState(() => getInitialEntityValues(lessonConfig));
  const [taskValues, setTaskValues] = useState(() => getInitialEntityValues(taskConfig));
  const [worksheetValues, setWorksheetValues] = useState(() => getInitialEntityValues(worksheetConfig));

  const [lessonCustom, setLessonCustom] = useState<Record<string, string>>({});
  const [taskCustom, setTaskCustom] = useState<Record<string, string>>({});
  const [worksheetCustom, setWorksheetCustom] = useState<Record<string, string>>({});

  const [interactiveCategory, setInteractiveCategory] =
    useState<TeacherInteractiveCategoryId>(DEFAULT_INTERACTIVE_CATEGORY);
  const [interactiveType, setInteractiveType] = useState(DEFAULT_INTERACTIVE_TYPE);
  const [interactiveStyle, setInteractiveStyle] = useState('apple');
  const [interactiveStyleCustom, setInteractiveStyleCustom] = useState('');
  const [interactiveMeta, setInteractiveMeta] = useState(getInitialTeacherInteractiveMeta);
  const [interactiveMetaCustom, setInteractiveMetaCustom] = useState<Record<string, string>>({});
  const [interactiveTemplateOptions, setInteractiveTemplateOptions] = useState(() =>
    getInitialInteractiveTemplateOptions(DEFAULT_INTERACTIVE_TYPE)
  );
  const [interactiveEnhance, setInteractiveEnhance] = useState(true);

  const config = getEntityConfig(entity);

  const categoryData = useMemo(
    () => artifactsConfig.categories.find((c) => c.id === interactiveCategory),
    [interactiveCategory]
  );

  const complexityKey = useMemo(() => {
    const text = interactiveMetaCustom.complexity?.trim() || interactiveMeta.complexity || '';
    return getComplexityKeyFromMeta(text);
  }, [interactiveMetaCustom.complexity, interactiveMeta.complexity]);

  const availableInteractiveTypes = useMemo(() => {
    const all = categoryData?.types ?? [];
    return filterArtifactTypesByComplexity(all, complexityKey);
  }, [categoryData?.types, complexityKey]);

  const interactiveTypeData = useMemo(
    () =>
      availableInteractiveTypes.find((t) => t.id === interactiveType) ??
      categoryData?.types.find((t) => t.id === interactiveType),
    [availableInteractiveTypes, categoryData?.types, interactiveType]
  );

  useEffect(() => {
    if (availableInteractiveTypes.length === 0) return;
    if (!availableInteractiveTypes.some((t) => t.id === interactiveType)) {
      setInteractiveType(availableInteractiveTypes[0].id);
    }
  }, [availableInteractiveTypes, interactiveType]);

  useEffect(() => {
    const template = interactiveTypeData?.promptTemplate ?? '';
    const keys = getTemplateOptionKeysForUi(template);
    setInteractiveTemplateOptions((prev) => {
      const next: Record<string, string> = {};
      for (const key of keys) {
        next[key] = prev[key] ?? SPA_DEFAULT_TEMPLATE_OPTIONS[key] ?? '';
      }
      return next;
    });
  }, [interactiveCategory, interactiveType, interactiveTypeData?.promptTemplate]);

  const mergedValues = useMemo(() => {
    if (entity === 'interactive') return {};
    const base =
      entity === 'lesson' ? lessonValues : entity === 'task' ? taskValues : worksheetValues;
    const custom =
      entity === 'lesson' ? lessonCustom : entity === 'task' ? taskCustom : worksheetCustom;
    const out = { ...base };
    for (const [key, val] of Object.entries(custom)) {
      if (val.trim()) out[key] = val.trim();
    }
    return out;
  }, [entity, lessonValues, taskValues, worksheetValues, lessonCustom, taskCustom, worksheetCustom]);

  const fullPrompt = useMemo(() => {
    if (entity === 'interactive') {
      return buildTeacherInteractivePrompt({
        profile,
        category: interactiveCategory,
        type: interactiveType,
        styleId: interactiveStyle,
        styleCustom: interactiveStyleCustom,
        templateOptions: interactiveTemplateOptions,
        metaSelections: interactiveMeta,
        metaCustom: interactiveMetaCustom,
        enhance: interactiveEnhance,
      });
    }
    return buildTeacherPrompt(config, profile, mergedValues);
  }, [
    entity,
    config,
    profile,
    mergedValues,
    interactiveCategory,
    interactiveType,
    interactiveStyle,
    interactiveStyleCustom,
    interactiveTemplateOptions,
    interactiveMeta,
    interactiveMetaCustom,
    interactiveEnhance,
  ]);

  const updateProfile = useCallback((patch: Partial<TeacherProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const getSelectValue = useCallback(
    (fieldId: string) => {
      const values =
        entity === 'lesson' ? lessonValues : entity === 'task' ? taskValues : worksheetValues;
      return values[fieldId] ?? '';
    },
    [entity, lessonValues, taskValues, worksheetValues]
  );

  const getCustomValue = useCallback(
    (fieldId: string) => {
      const custom =
        entity === 'lesson' ? lessonCustom : entity === 'task' ? taskCustom : worksheetCustom;
      return custom[fieldId] ?? '';
    },
    [entity, lessonCustom, taskCustom, worksheetCustom]
  );

  const getMultiselectValues = useCallback(
    (fieldId: string) => parseMultiselectStored(getSelectValue(fieldId)),
    [getSelectValue]
  );

  const handleSelect = useCallback(
    (fieldId: string, text: string) => {
      const setter =
        entity === 'lesson'
          ? setLessonValues
          : entity === 'task'
            ? setTaskValues
            : setWorksheetValues;
      const customSetter =
        entity === 'lesson'
          ? setLessonCustom
          : entity === 'task'
            ? setTaskCustom
            : setWorksheetCustom;
      setter((prev) => ({ ...prev, [fieldId]: text }));
      customSetter((prev) => ({ ...prev, [fieldId]: '' }));
    },
    [entity]
  );

  const handleMultiselectToggle = useCallback(
    (fieldId: string, text: string, maxSelections: number) => {
      if (entity !== 'task') return;
      setTaskValues((prev) => {
        const current = parseMultiselectStored(prev[fieldId] ?? '');
        const has = current.includes(text);
        let next: string[];
        if (has) {
          next = current.filter((t) => t !== text);
          if (next.length === 0) next = [text];
        } else if (current.length >= maxSelections) {
          return prev;
        } else {
          next = [...current, text];
        }
        return { ...prev, [fieldId]: joinMultiselectStored(next) };
      });
    },
    [entity]
  );

  const handleCustomChange = useCallback(
    (fieldId: string, value: string) => {
      const customSetter =
        entity === 'lesson'
          ? setLessonCustom
          : entity === 'task'
            ? setTaskCustom
            : setWorksheetCustom;
      customSetter((prev) => ({ ...prev, [fieldId]: value }));
    },
    [entity]
  );

  const handleInteractiveMetaSelect = useCallback((fieldId: string, text: string) => {
    setInteractiveMeta((prev) => ({ ...prev, [fieldId]: text }));
    setInteractiveMetaCustom((prev) => ({ ...prev, [fieldId]: '' }));
  }, []);

  const handleInteractiveMetaCustom = useCallback((fieldId: string, value: string) => {
    setInteractiveMetaCustom((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const setInteractiveCategoryId = useCallback((id: TeacherInteractiveCategoryId) => {
    const cat = artifactsConfig.categories.find((c) => c.id === id);
    setInteractiveCategory(id);
    setInteractiveType(cat?.types[0]?.id ?? 'quiz');
  }, []);

  const applyInteractivePreset = useCallback(
    (preset: {
      category: string;
      type: string;
      style: string;
      meta: Record<string, string>;
    }) => {
      setInteractiveCategoryId(preset.category as TeacherInteractiveCategoryId);
      setInteractiveType(preset.type);
      setInteractiveStyle(preset.style);
      setInteractiveStyleCustom('');
      setInteractiveMeta((prev) => ({ ...prev, ...preset.meta }));
      setInteractiveMetaCustom({});
      setInteractiveEnhance(true);
    },
    [setInteractiveCategoryId]
  );

  const resetCurrentEntity = useCallback(() => {
    if (entity === 'lesson') {
      setLessonValues(getInitialEntityValues(lessonConfig));
      setLessonCustom({});
    } else if (entity === 'task') {
      setTaskValues(getInitialEntityValues(taskConfig));
      setTaskCustom({});
    } else if (entity === 'worksheet') {
      setWorksheetValues(getInitialEntityValues(worksheetConfig));
      setWorksheetCustom({});
    } else {
      setInteractiveCategory(DEFAULT_INTERACTIVE_CATEGORY);
      setInteractiveType(DEFAULT_INTERACTIVE_TYPE);
      setInteractiveStyle('apple');
      setInteractiveStyleCustom('');
      setInteractiveMeta(getInitialTeacherInteractiveMeta());
      setInteractiveMetaCustom({});
      setInteractiveTemplateOptions(getInitialInteractiveTemplateOptions(DEFAULT_INTERACTIVE_TYPE));
      setInteractiveEnhance(true);
    }
  }, [entity]);

  const resetAll = useCallback(() => {
    setProfile({ ...DEFAULT_TEACHER_PROFILE });
    setLessonValues(getInitialEntityValues(lessonConfig));
    setTaskValues(getInitialEntityValues(taskConfig));
    setWorksheetValues(getInitialEntityValues(worksheetConfig));
    setLessonCustom({});
    setTaskCustom({});
    setWorksheetCustom({});
    setInteractiveCategory(DEFAULT_INTERACTIVE_CATEGORY);
    setInteractiveType(DEFAULT_INTERACTIVE_TYPE);
    setInteractiveStyle('apple');
    setInteractiveStyleCustom('');
    setInteractiveMeta(getInitialTeacherInteractiveMeta());
    setInteractiveMetaCustom({});
    setInteractiveTemplateOptions(getInitialInteractiveTemplateOptions(DEFAULT_INTERACTIVE_TYPE));
    setInteractiveEnhance(true);
    setEntity('lesson');
  }, []);

  const interactiveTemplateKeys = useMemo(
    () => (interactiveTypeData ? getTemplateOptionKeysForUi(interactiveTypeData.promptTemplate) : []),
    [interactiveTypeData]
  );

  const getInteractiveMetaValue = useCallback(
    (fieldId: string) => {
      const custom = interactiveMetaCustom[fieldId]?.trim();
      if (custom) return custom;
      return interactiveMeta[fieldId] ?? '';
    },
    [interactiveMeta, interactiveMetaCustom]
  );

  return {
    entity,
    setEntity,
    config,
    profile,
    updateProfile,
    fullPrompt,
    getSelectValue,
    getCustomValue,
    getMultiselectValues,
    handleSelect,
    handleMultiselectToggle,
    handleCustomChange,
    resetCurrentEntity,
    resetAll,
    interactive: {
      category: interactiveCategory,
      setCategoryId: setInteractiveCategoryId,
      type: interactiveType,
      setType: setInteractiveType,
      style: interactiveStyle,
      setStyle: setInteractiveStyle,
      styleCustom: interactiveStyleCustom,
      setStyleCustom: setInteractiveStyleCustom,
      templateOptions: interactiveTemplateOptions,
      setTemplateOptions: setInteractiveTemplateOptions,
      templateKeys: interactiveTemplateKeys,
      availableTypes: availableInteractiveTypes,
      complexityKey,
      enhance: interactiveEnhance,
      setEnhance: setInteractiveEnhance,
      getMetaValue: getInteractiveMetaValue,
      metaCustom: interactiveMetaCustom,
      handleMetaSelect: handleInteractiveMetaSelect,
      handleMetaCustom: handleInteractiveMetaCustom,
      applyPreset: applyInteractivePreset,
    },
  };
}
