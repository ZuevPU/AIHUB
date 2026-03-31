import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { materials } from '@/data/materials';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PromptCopyButton } from '@/components/PromptCopyButton';
import { RelatedCards } from '@/components/RelatedCards';
import { AIToolsSection } from '@/components/AIToolsSection';
import { PromptExampleMarkdown } from '@/components/PromptExampleMarkdown';
import { ArrowLeft, Download, ExternalLink, FileText, Wrench, MessageSquare, Bot } from 'lucide-react';
import { siteUi } from '@/lib/siteUi';
import { cn } from '@/lib/utils';

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
      <div className={cn(siteUi.page, 'py-24 text-center')}>
        <h1 className="text-2xl font-bold text-zinc-900">Материал не найден</h1>
        <p className="mt-4 text-zinc-500">Возможно, он был удален или перемещен.</p>
        <Button className="mt-8" onClick={() => navigate('/catalog')}>
          Вернуться в каталог
        </Button>
      </div>
    );
  }

  const relatedMaterials = materials
    .filter((m) => m.id !== material.id && m.categories.some((c) => material.categories.includes(c)))
    .slice(0, 3);

  const aiToolsForPrompt = materials.filter(
    (m) => m.type === 'tool' && m.url && m.categories.some((c) => material.categories.includes(c))
  );

  const Icon = typeIcons[material.type];
  const isPrompt = material.type === 'prompt';
  const isDeveloper = material.categories.includes('developer');

  const developerAlgorithm = [
    'Откройте интерфейс Qwen',
    'Выберите режим: «Веб-разработка» или «Артефакты»',
    'Добавьте задачу: прикрепите фото или опишите текстом',
    'Введите промпт и дождитесь генерации — ИИ создаст HTML/CSS/JS код',
    'Нажмите «Предварительный просмотр» или «Запустить», чтобы увидеть приложение прямо в чате',
    'Протестируйте приложение: проверьте работу кнопок и полей ввода, убедитесь, что логика верна — математическая и алгоритмическая',
    'Напишите правки агенту: «Исправь ошибку в расчёте» или «Сделай кнопку больше»',
    'Нажмите «Развернуть», чтобы открыть приложение на весь экран без интерфейса чата',
    'Скопируйте ссылку из адресной строки или через вкладку «Поделиться»',
    'Отправьте ученикам: в электронный журнал, чат класса или на образовательную платформу',
  ];

  return (
    <div className={siteUi.page}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={cn(siteUi.backLink, 'mb-8')}
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      {isPrompt ? (
        /* Промпт: заголовок, теги, описание, промпт, нейросети */
        <div className="mb-16">
          <div className="flex flex-wrap gap-2 mb-4">
            <Link to={`/catalog?type=${material.type}`} className="no-underline">
              <Badge variant="default" className="bg-zinc-900 text-white flex items-center gap-1.5 px-3 py-1 cursor-pointer hover:bg-zinc-800 transition-colors">
                <Icon className="w-3.5 h-3.5" />
                {typeLabels[material.type]}
              </Badge>
            </Link>
            <Link to={`/catalog?category=${material.categories[0]}`} className="no-underline">
              <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 px-3 py-1 cursor-pointer hover:bg-zinc-200 transition-colors">
                {categoryLabels[material.categories[0]]}
              </Badge>
            </Link>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
            {material.title}
          </h1>
          <div className="flex flex-wrap gap-2 mb-6">
            {material.tags.map((tag) => (
              <Link
                key={tag}
                to={`/catalog?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer no-underline"
              >
                #{tag}
              </Link>
            ))}
          </div>
          <p className="text-lg text-zinc-600 mb-8 leading-relaxed whitespace-pre-wrap">
            {material.description}
          </p>
          {material.prompts ? (
            <div className="space-y-6">
              {material.prompts.map((promptText, index) => (
                <div key={index} className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-zinc-50/50 border-b border-zinc-200">
                    <h3 className="text-lg font-semibold text-zinc-900">
                      {material.promptLabels?.[index] ?? `Промпт №${index + 1}`}
                    </h3>
                    <PromptCopyButton text={promptText} label="Скопировать" />
                  </div>
                  <div className="relative p-6 overflow-hidden">
                    <pre className="text-zinc-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {promptText}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          ) : material.prompt ? (
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 bg-zinc-50/50 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">Промпт</h3>
                <PromptCopyButton text={material.prompt} />
              </div>
              <div className="relative p-6 overflow-hidden">
                <pre className="text-zinc-700 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {material.prompt}
                </pre>
              </div>
            </div>
          ) : null}
          {isPrompt && material.example_result && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">Пример результата</h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                  Фрагмент ответа нейросети по этому промпту
                  {material.id === 'prompt_008' &&
                    ' (тема в примере — этика ИИ для учителей математики).'}
                  {material.id === 'prompt_009' &&
                    ' (тема в примере — ИИ в образовании, три структуры сценария, ~30 мин).'}
                  {material.id === 'prompt_010' &&
                    ' (тема в примере — ИИ и обучение, 10 подач по пяти оптикам).'}
                  {material.id !== 'prompt_008' &&
                    material.id !== 'prompt_009' &&
                    material.id !== 'prompt_010' &&
                    '.'}
                  {material.example_url ? (
                    <>
                      {' '}
                      <a
                        href={material.example_url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
                      >
                        Открыть полный диалог в Qwen Chat
                      </a>
                      .
                    </>
                  ) : null}
                </p>
              </div>
              <div className="p-6 max-h-[min(70vh,780px)] overflow-y-auto border-t border-zinc-100">
                <PromptExampleMarkdown markdown={material.example_result} />
              </div>
            </div>
          )}
          {isPrompt && material.id === 'prompt_030' && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">Алгоритм выполнения</h3>
              </div>
              <div className="p-6">
                <ol className="text-zinc-700 text-base leading-relaxed space-y-2 list-decimal list-inside">
                  {developerAlgorithm.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}
          {isPrompt &&
            (material.url || (material.example_url && !material.example_result)) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {material.url && (
                <a
                  href={material.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть пример
                </a>
              )}
              {material.example_url && !material.example_result && (
                <a
                  href={material.example_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
                >
                  <ExternalLink className="w-4 h-4" />
                  Пример результата
                </a>
              )}
            </div>
          )}
          {isPrompt && material.example_url && /\.(png|jpg|jpeg|webp|gif)(\?|$)/i.test(material.example_url) && (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white overflow-hidden">
              <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-200">
                <h3 className="text-lg font-semibold text-zinc-900">Пример результата</h3>
              </div>
              <div className="p-4">
                <a href={material.example_url} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={material.example_url}
                    alt="Пример результата промпта"
                    className="w-full max-h-96 object-contain rounded-lg border border-zinc-200"
                  />
                </a>
              </div>
            </div>
          )}
          <AIToolsSection tools={aiToolsForPrompt} />
        </div>
      ) : (
        /* Инструменты и агенты: прежний макет */
        <>
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
                <Link to={`/catalog?type=${material.type}`} className="no-underline">
                  <Badge variant="default" className="bg-zinc-900 text-white flex items-center gap-1.5 px-3 py-1 cursor-pointer hover:bg-zinc-800 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                    {typeLabels[material.type]}
                  </Badge>
                </Link>
                <Link to={`/catalog?category=${material.categories[0]}`} className="no-underline">
                  <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 px-3 py-1 cursor-pointer hover:bg-zinc-200 transition-colors">
                    {categoryLabels[material.categories[0]]}
                  </Badge>
                </Link>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4">
                {material.title}
              </h1>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                {material.description}
              </p>
              {material.url && (
                <a
                  href={material.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 mb-6"
                >
                  Открыть ресурс
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <div className="flex flex-wrap gap-2 mt-auto">
                {material.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/catalog?q=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-md bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500 border border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer no-underline"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>

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
                      <PromptExampleMarkdown markdown={material.example_result} />
                    </div>
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>

          <RelatedCards materials={relatedMaterials} />
        </>
      )}
    </div>
  );
}
