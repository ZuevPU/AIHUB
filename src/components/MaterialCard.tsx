import * as React from 'react';
import { Link } from 'react-router-dom';
import { Material } from '@/data/materials';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, Wrench, MessageSquare, Bot } from 'lucide-react';

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
  analyst: 'Аналитик',
  developer: 'Разработчик',
  'useful-links': 'Полезные ссылки',
};

export function MaterialCard({ material }: MaterialCardProps) {
  const Icon = typeIcons[material.type];

  return (
    <Card className="group flex flex-col overflow-hidden transition-all hover:shadow-md hover:border-zinc-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={material.image}
          alt={material.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="default" className="bg-white/90 text-zinc-900 hover:bg-white backdrop-blur-sm border-none shadow-sm flex items-center gap-1.5">
            <Icon className="w-3 h-3" />
            {typeLabels[material.type]}
          </Badge>
          <Badge variant="secondary" className="bg-white/90 text-zinc-600 hover:bg-white backdrop-blur-sm border-none shadow-sm">
            {categoryLabels[material.category]}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-5 pb-0">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-zinc-900 line-clamp-1">
          {material.title}
        </h3>
      </CardHeader>
      
      <CardContent className="p-5 pt-3 flex-1">
        <p className="text-sm text-zinc-500 line-clamp-2">
          {material.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {material.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">
              #{tag}
            </span>
          ))}
          {material.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-400">
              +{material.tags.length - 3}
            </span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Link
          to={`/material/${material.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2"
        >
          Подробнее
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
