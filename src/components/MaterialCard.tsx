import * as React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '@/data/materials';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, ExternalLink, Wrench, MessageSquare, Bot } from 'lucide-react';

interface MaterialCardProps {
  material: Material;
}

const typeIcons = {
  tool: Wrench,
  prompt: MessageSquare,
  agent: Bot,
};

const typeLabels = {
  tool: 'Инструмент',
  prompt: 'Промпт',
  agent: 'Агент',
};

const categoryLabels = {
  editor: 'Редактор',
  manager: 'Менеджер',
  designer: 'Дизайнер',
  developer: 'Разработчик',
};

const skyGradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  'linear-gradient(145deg, #4facfe 0%, #00f2fe 40%, #43e97b 100%)',
  'linear-gradient(160deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
  'linear-gradient(120deg, #a8edea 0%, #fed6e3 50%, #667eea 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 40%, #fecfef 100%)',
  'linear-gradient(150deg, #ffecd2 0%, #fcb69f 50%, #a18cd1 100%)',
  'linear-gradient(140deg, #e0c3fc 0%, #8ec5fc 50%, #6dd5ed 100%)',
  'linear-gradient(130deg, #a1c4fd 0%, #c2e9fb 50%, #fbc2eb 100%)',
  'linear-gradient(155deg, #d299c2 0%, #fef9d7 60%, #89f7fe 100%)',
  'linear-gradient(125deg, #f6d365 0%, #fda085 50%, #e0c3fc 100%)',
];

function getFirstTwoWords(title: string): string {
  const words = title.trim().split(/\s+/);
  return words.slice(0, 2).join(' ') || title;
}

function getGradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % skyGradients.length;
  return skyGradients[index];
}

export function MaterialCard({ material }: MaterialCardProps) {
  const Icon = typeIcons[material.type];
  const shortTitle = getFirstTwoWords(material.title);
  const gradient = getGradientForId(material.id);
  const isDeveloper = material.categories.includes('developer');
  const displayTitle = isDeveloper ? material.title : shortTitle;

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-zinc-300">
      <div
        className="relative aspect-[4/3] overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <span className={`font-bold text-white/95 drop-shadow-lg text-center leading-tight ${isDeveloper ? 'text-sm' : 'text-xl'}`}>
            {displayTitle}
          </span>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Link
            to={`/catalog?type=${material.type}`}
            onClick={(e) => e.stopPropagation()}
            className="no-underline"
          >
            <Badge variant="default" className="bg-white/90 text-zinc-900 hover:bg-white backdrop-blur-sm border-none shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors">
              <Icon className="w-3 h-3" />
              {typeLabels[material.type]}
            </Badge>
          </Link>
          <Link
            to={`/catalog?category=${material.categories[0]}`}
            onClick={(e) => e.stopPropagation()}
            className="no-underline"
          >
            <Badge variant="secondary" className="bg-white/90 text-zinc-600 hover:bg-white backdrop-blur-sm border-none shadow-sm cursor-pointer transition-colors">
              {categoryLabels[material.categories[0]]}
            </Badge>
          </Link>
        </div>
      </div>
      
      <CardHeader className="p-5 pb-0">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-zinc-900">
          {material.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-5 pt-3 flex-1">
        <p className={`text-sm text-zinc-500 ${isDeveloper ? '' : 'line-clamp-2'}`}>
          {material.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {material.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag}
              to={`/catalog?q=${encodeURIComponent(tag)}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer no-underline"
            >
              #{tag}
            </Link>
          ))}
          {material.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-400">
              +{material.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <div className="flex w-full gap-2">
          <Link
            to={`/material/${material.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
          >
            Подробнее
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          {material.url && (
            <a
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
            >
              Открыть
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
