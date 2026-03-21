import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PenTool, Briefcase, Palette, Code, Image, Video, Presentation, BarChart3, PenLine } from 'lucide-react';
import { BentoGridItem } from '@/components/BentoGrid';

const bentoPromptHover = 'hover:shadow-lg hover:border-zinc-300 transition-all';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container relative mx-auto px-4 md:px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-900 mb-8">
            <Sparkles className="mr-2 h-4 w-4 text-zinc-500" />
            <span>немного про ии, от Центра Знаний Машук</span>
          </div>
          <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl mb-6">
            База знаний <br className="hidden sm:block" />
            <span className="text-zinc-500">для работы с ИИ</span>
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 mb-10">
            Каталог проверенных промптов и инструментов для решения реальных задач в дизайне, разработке, управлении.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/catalog')}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
            >
              Смотреть каталог
            </button>
            <button 
              onClick={() => navigate('/catalog?type=prompt')}
              className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
            >
              Найти промпт
            </button>
          </div>
        </div>
      </section>

      {/* Use Cases Bento */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Примеры использования</h2>
            <p className="mt-4 text-lg text-zinc-600">Найдите решения специально для вашей профессии</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <BentoGridItem
              title="Редактор"
              description="Промпты для написания, редактуры и SEO-оптимизации текстов."
              icon={<PenTool className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?category=editor')}
            />
            <BentoGridItem
              title="Менеджер"
              description="Инструменты для планирования, аналитики и управления командой."
              icon={<Briefcase className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?category=manager')}
            />
            <BentoGridItem
              title="Дизайнер"
              description="Генерация изображений, концептов и UI-элементов."
              icon={<Palette className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?category=designer')}
            />
            <BentoGridItem
              title="Разработчик"
              description="Создание веб-страниц из документов: анонсы мероприятий, итоги педсоветов, портфолио уроков."
              icon={<Code className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?category=developer')}
            />
          </div>
        </div>
      </section>

      {/* Собери свой промпт */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Собери свой промпт</h2>
            <p className="mt-4 text-lg text-zinc-600">Выберите тип контента и соберите идеальный промпт по частям — от изображений до одностраничных приложений</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            <BentoGridItem
              title="Конструктор изображения"
              description="Генерация изображений в Алиса AI и GigaChat. Соберите промпт по частям."
              icon={<Image className="h-5 w-5 text-violet-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/designer/prompt-builder')}
            />
            <BentoGridItem
              title="Конструктор видео"
              description="Субъект, действие, камера, освещение — параметры для генерации видео."
              icon={<Video className="h-5 w-5 text-amber-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/designer/video-prompt-builder')}
            />
            <BentoGridItem
              title="Конструктор презентаций"
              description="Тема, аудитория, структура, стиль, типографика, доступность."
              icon={<Presentation className="h-5 w-5 text-emerald-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/designer/presentation-prompt-builder')}
            />
            <BentoGridItem
              title="Конструктор анализа данных"
              description="3 шага: диагностика → планирование → отчёт. Роль, цель, формат."
              icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/manager/analytics-prompt-builder')}
            />
            <BentoGridItem
              title="Конструктор для редактора"
              description="Тема, аудитория, пресеты: углы подачи, сценарий, анти-клише, анонс, объяснение."
              icon={<PenLine className="h-5 w-5 text-rose-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/editor/prompt-builder')}
            />
            <BentoGridItem
              title="Конструктор для разработки"
              description="Единый промпт разработка страницы простого веб приложения. Плюс шаги для создания цифровых Артефактов."
              icon={<Code className="h-5 w-5 text-teal-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/developer/single-page-apps')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
