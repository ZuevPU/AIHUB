import { useCallback, useMemo, useState } from 'react'
import type { HrProfile, PromptRecipe, PromptSlot } from '@/data/promptRecipes/types';
import { resolveProfileLevel } from '@/data/promptRecipes/types';

type SlotValues = Record<string, Record<string, string>>

export interface TemplateSegment {
  type: 'text' | 'slot'
  value: string
  slot?: PromptSlot
}

const SLOT_PATTERN = /\{\{(\w+)\}\}/g

function buildInitialValues(recipes: PromptRecipe[]): SlotValues {
  return recipes.reduce<SlotValues>((acc, recipe) => {
    acc[recipe.id] = recipe.slots.reduce<Record<string, string>>((slotAcc, slot) => {
      slotAcc[slot.id] = slot.defaultValue
      return slotAcc
    }, {})
    return acc
  }, {})
}

/**
 * Значение слота: слоты, привязанные к профилю, всегда читаются из профиля,
 * поэтому одна правка в шапке меняет сразу все рецепты.
 */
function resolveSlotValue(slot: PromptSlot, recipeValues: Record<string, string>, profile: HrProfile): string {
  if (slot.fromProfile === 'level') return resolveProfileLevel(profile)
  if (slot.fromProfile) return profile[slot.fromProfile]
  return recipeValues[slot.id] ?? slot.defaultValue
}

export function usePromptRecipes(recipes: PromptRecipe[], profile: HrProfile) {
  const [values, setValues] = useState<SlotValues>(() => buildInitialValues(recipes))

  const setSlotValue = useCallback((recipeId: string, slotId: string, value: string) => {
    setValues((prev) => ({ ...prev, [recipeId]: { ...prev[recipeId], [slotId]: value } }))
  }, [])

  const resetRecipe = useCallback(
    (recipeId: string) => {
      const recipe = recipes.find((item) => item.id === recipeId)
      if (!recipe) return
      setValues((prev) => ({ ...prev, [recipeId]: buildInitialValues([recipe])[recipeId] }))
    },
    [recipes],
  )

  const getSegments = useCallback(
    (recipe: PromptRecipe): TemplateSegment[] => {
      const recipeValues = values[recipe.id] ?? {}
      const segments: TemplateSegment[] = []
      let lastIndex = 0

      for (const match of recipe.template.matchAll(SLOT_PATTERN)) {
        const [raw, slotId] = match
        const start = match.index ?? 0
        if (start > lastIndex) {
          segments.push({ type: 'text', value: recipe.template.slice(lastIndex, start) })
        }
        const slot = recipe.slots.find((item) => item.id === slotId)
        segments.push(
          slot
            ? { type: 'slot', value: resolveSlotValue(slot, recipeValues, profile), slot }
            : { type: 'text', value: raw },
        )
        lastIndex = start + raw.length
      }

      if (lastIndex < recipe.template.length) {
        segments.push({ type: 'text', value: recipe.template.slice(lastIndex) })
      }
      return segments
    },
    [values, profile],
  )

  const renderPrompt = useCallback(
    (recipe: PromptRecipe): string =>
      getSegments(recipe)
        .map((segment) => segment.value)
        .join('')
        // пустой слот не должен оставлять висящую пустую строку
        .replace(/\n{3,}/g, '\n\n')
        .trim(),
    [getSegments],
  )

  const renderAll = useCallback(
    (list: PromptRecipe[]): string =>
      list
        .map(
          (recipe) =>
            `${'='.repeat(60)}\n${recipe.title}\n${'='.repeat(60)}\n\n${renderPrompt(recipe)}\n\n` +
            `Проверить вручную:\n${recipe.manualCheck.map((item) => `— ${item}`).join('\n')}\n`,
        )
        .join('\n\n'),
    [renderPrompt],
  )

  return useMemo(
    () => ({ values, setSlotValue, resetRecipe, getSegments, renderPrompt, renderAll }),
    [values, setSlotValue, resetRecipe, getSegments, renderPrompt, renderAll],
  )
}
