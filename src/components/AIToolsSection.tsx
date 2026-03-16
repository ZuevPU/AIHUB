import * as React from 'react';
import { Material } from '@/data/materials';
import { ExternalLink } from 'lucide-react';

interface AIToolsSectionProps {
  tools: Material[];
}

export function AIToolsSection({ tools }: AIToolsSectionProps) {
  if (tools.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-zinc-200">
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 mb-4">
        Нейросети, где это можно сделать
      </h2>
      <div className="flex flex-wrap gap-3">
        {tools.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:border-zinc-300"
          >
            {tool.title}
            <ExternalLink className="w-4 h-4 text-zinc-400" />
          </a>
        ))}
      </div>
    </div>
  );
}
