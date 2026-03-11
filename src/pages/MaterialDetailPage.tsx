import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { materials } from '@/data/materials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromptCopyButton } from '@/components/PromptCopyButton';
import { RelatedCards } from '@/components/RelatedCards';
import { ArrowLeft, Download, FileText, Wrench, MessageSquare, Bot } from 'lucide-react';

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

export function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');

  const material = materials.find((m) => m.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!material) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Материал не найден</h1>
        <p className="mt-4 text-zinc-500">Возможно, он был удален или перемещен.</p>
        <Button className="mt-8" onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const relatedMaterials = materials
    .filter((m) => m.category === material.category && m.id !== material.id)
    .slice(0, 3);

  const Icon = typeIcons[material.type];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      {/* Hero Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200">
          <img
            src={material.image}
            alt={material.title}
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="default" className="bg-zinc-900 text-white flex items-center gap-1.5 px-3 py-1">
              <Icon className="w-3.5 h-3.5" />
              {typeLabels[material.type]}
            </Badge>
            <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 px-3 py-1">
              {categoryLabels[material.category]}
            </Badge>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
            {material.title}
          </h1>
          
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
            {material.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {material.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-200">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <Tabs className="w-full">
          <div className="border-b border-zinc-200 px-6 py-4 bg-zinc-50/50">
            <TabsList className="bg-transparent p-0 h-auto gap-6 justify-start">
              <TabsTrigger 
                active={activeTab === 'description'} 
                onClick={() => setActiveTab('description')}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
              >
                Описание
              </TabsTrigger>
              {material.prompt && (
                <TabsTrigger 
                  active={activeTab === 'prompt'} 
                  onClick={() => setActiveTab('prompt')}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
                >
                  Промпт
                </TabsTrigger>
              )}
              {material.example_result && (
                <TabsTrigger 
                  active={activeTab === 'example'} 
                  onClick={() => setActiveTab('example')}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-2"
                >
                  Пример результата
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="p-6 md:p-8">
            <TabsContent active={activeTab === 'description'} className="mt-0 outline-none">
              <div className="prose prose-zinc max-w-none">
                <h3 className="text-xl font-semibold mb-4">О материале</h3>
                <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                  {material.description}
                </p>
                
                {material.files && material.files.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-zinc-100">
                    <h4 className="text-sm font-medium text-zinc-900 uppercase tracking-wider mb-4">
                      Прикрепленные файлы
                    </h4>
                    <div className="flex flex-col gap-3">
                      {material.files.map((file, index) => (
                        <a
                          key={index}
                          href={file.url}
                          className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                              <FileText className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-zinc-900">{file.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-zinc-500 group-hover:text-zinc-900">
                            <Download className="h-4 w-4" />
                          </Button>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {material.prompt && (
              <TabsContent active={activeTab === 'prompt'} className="mt-0 outline-none">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-zinc-900">Текст промпта</h3>
                  <PromptCopyButton text={material.prompt} />
                </div>
                <div className="relative rounded-xl bg-zinc-900 p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-700 to-zinc-800"></div>
                  <pre className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                    {material.prompt}
                  </pre>
                </div>
              </TabsContent>
            )}

            {material.example_result && (
              <TabsContent active={activeTab === 'example'} className="mt-0 outline-none">
                <h3 className="text-xl font-semibold text-zinc-900 mb-6">Пример результата</h3>
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                  <div className="prose prose-zinc max-w-none">
                    <pre className="text-zinc-700 font-sans text-base leading-relaxed whitespace-pre-wrap bg-transparent p-0 border-0">
                      {material.example_result}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>

      {/* Related Materials */}
      <RelatedCards materials={relatedMaterials} />
    </div>
  );
}
