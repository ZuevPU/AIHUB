import { useMemo, useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { HR_GOV_RECIPES, DEFAULT_PROFILE } from '@/data/promptRecipes/hrGovRecipes';
import { BLOCK_LABELS, type HrProfile, type RecipeBlock } from '@/data/promptRecipes/types';
import { usePromptRecipes } from '@/hooks/usePromptRecipes';
import { ProfileBar } from '@/components/promptRecipes/ProfileBar';
import { RecipeCard } from '@/components/promptRecipes/RecipeCard';
import { useIsEmbedded } from '@/hooks/useIsEmbedded';
import { copyToClipboard } from '@/lib/clipboard';
import { BackLink } from '@/components/layout/BackLink';
import { cn } from '@/lib/utils';

const BLOCK_ORDER: RecipeBlock[] = ['docflow', 'analytics', 'hiring', 'assessment'];

export function HrGovPromptBuilderPage() {
  const isEmbedded = useIsEmbedded();
  const [profile, setProfile] = useState<HrProfile>(DEFAULT_PROFILE);
  const [activeBlock, setActiveBlock] = useState<RecipeBlock | 'all'>('all');
  const { setSlotValue, resetRecipe, getSegments, renderPrompt, renderAll } = usePromptRecipes(
    HR_GOV_RECIPES,
    profile
  );

  const availableBlocks = useMemo(
    () => BLOCK_ORDER.filter((block) => HR_GOV_RECIPES.some((recipe) => recipe.block === block)),
    []
  );

  const visibleRecipes = useMemo(
    () => (activeBlock === 'all' ? HR_GOV_RECIPES : HR_GOV_RECIPES.filter((recipe) => recipe.block === activeBlock)),
    [activeBlock]
  );

  const handleDownload = () => {
    const blob = new Blob([renderAll(visibleRecipes)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'promty-kadrovoy-sluzhby.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className={cn('mx-auto max-w-6xl px-4', isEmbedded ? 'py-4' : 'py-10')}>
          {!isEmbedded && (
            <BackLink to="/catalog?type=prompt&audience=gossluzhba">Назад к каталогу</BackLink>
          )}
          <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
            Для кого: государственная и муниципальная служба
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Промпты для кадровой службы</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Готовые промпты под рутинные задачи кадрового делопроизводства и аналитики. Меняйте выделенные фрагменты
            прямо в тексте, копируйте и работайте.
          </p>
          <p className="mt-4 flex max-w-2xl items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Не загружайте в нейросети персональные данные работников и кандидатов. Начните с промпта «Обезличивание
            данных перед загрузкой».
          </p>
        </div>
      </header>

      <ProfileBar profile={profile} onChange={setProfile} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveBlock('all')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeBlock === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Все промпты
          </button>
          {availableBlocks.map((block) => (
            <button
              key={block}
              type="button"
              onClick={() => setActiveBlock(block)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeBlock === block ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {BLOCK_LABELS[block]}
            </button>
          ))}
          <button
            type="button"
            onClick={handleDownload}
            className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <Download className="h-4 w-4" aria-hidden />
            Скачать памятку
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {visibleRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              segments={getSegments(recipe)}
              onSlotChange={(slotId, value) => setSlotValue(recipe.id, slotId, value)}
              onReset={() => resetRecipe(recipe.id)}
              onCopy={() => copyToClipboard(renderPrompt(recipe))}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
