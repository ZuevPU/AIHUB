import * as React from 'react';
import { Material } from '@/data/materials';
import { MaterialCard } from './MaterialCard';

interface RelatedCardsProps {
  materials: Material[];
}

export function RelatedCards({ materials }: RelatedCardsProps) {
  if (materials.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-zinc-200">
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-8">
        Похожие материалы
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          <MaterialCard key={material.id} material={material} />
        ))}
      </div>
    </div>
  );
}
