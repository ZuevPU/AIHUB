import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PenTool,
  Briefcase,
  Palette,
  Code,
  Image,
  Video,
  Presentation,
  BarChart3,
  PenLine,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { BentoGridItem } from '@/components/BentoGrid';
import { siteUi } from '@/lib/siteUi';
import { cn } from '@/lib/utils';

const bentoPromptHover = 'hover:shadow-lg hover:border-zinc-300 transition-all';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <section className={siteUi.heroSection}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="container relative mx-auto flex flex-col items-center px-4 text-center md:px-6">
          <div className="mb-8 inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm font-medium text-zinc-900">
            <Sparkles className="mr-2 h-4 w-4 text-zinc-500" />
            <span>немного про ии, от Центра Знаний Машук</span>
          </div>
          <h1 className={siteUi.heroTitle}>
            Промпты и конструкторы <br className="hidden sm:block" />
            <span className="text-zinc-500">для работы с ИИ</span>
          </h1>
          <p className={siteUi.heroSubtitle}>
            Готовые промпты под задачи в управлении, госслужбе, образовании, редактуре, дизайне и разработке. Соберите
            свой запрос по частям или возьмите шаблон из каталога.
          </p>
          <button
            type="button"
            onClick={() => navigate('/catalog?type=prompt')}
            className={cn(siteUi.ctaButton, siteUi.mobileMinTouch, 'w-full max-w-xs px-8 sm:w-auto')}
          >
            Найти промпт
          </button>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Собери свой промпт</h2>
            <p className="mt-4 text-lg text-zinc-600">
              Конструкторы по сфере и по типу контента — соберите запрос по частям перед отправкой в нейросеть
            </p>
          </div>

          <div className="mx-auto mb-14 max-w-4xl">
            <h3 className="mb-4 text-center text-lg font-semibold text-zinc-900">Госслужба и образование</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BentoGridItem
                title="Конструктор промптов для госслужащих"
                description="Промпты для кадровой службы: документооборот, аналитика, найм. Уровень органа подставляется во все шаблоны."
                icon={<ShieldCheck className="h-5 w-5 text-indigo-600" />}
                className={cn(bentoPromptHover, 'ring-1 ring-indigo-100')}
                onClick={() => navigate('/manager/hr-gov-prompt-builder')}
              />
              <BentoGridItem
                title="Конструктор материалов для учителя"
                description="Урок, задание, рабочий лист и интерактив — один профиль класса и эталонные промпты с проверкой согласованности."
                icon={<GraduationCap className="h-5 w-5 text-blue-600" />}
                className={cn(bentoPromptHover, 'ring-1 ring-blue-100')}
                onClick={() => navigate('/teacher/material-builder')}
              />
            </div>
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-zinc-900">По типу контента</h3>
            <p className="mt-2 text-sm text-zinc-600">Изображения, видео, тексты, данные и веб-приложения</p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              description="Промпт для простого веб-приложения и шаги для цифровых артефактов."
              icon={<Code className="h-5 w-5 text-teal-500" />}
              className={bentoPromptHover}
              onClick={() => navigate('/developer/single-page-apps')}
            />
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">Примеры использования</h2>
            <p className="mt-4 text-lg text-zinc-600">
              Готовые промпты в каталоге — по профессии или по аудитории «образование» и «госслужба»
            </p>
          </div>

          <div className="mx-auto mb-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
            <BentoGridItem
              title="Каталог: госслужба"
              description="Промпты и материалы с фильтром для государственной и муниципальной службы."
              icon={<ShieldCheck className="h-5 w-5 text-indigo-600" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&audience=gossluzhba')}
            />
            <BentoGridItem
              title="Каталог: образование"
              description="Промпты для педагогов, методистов и сопровождения урока."
              icon={<GraduationCap className="h-5 w-5 text-blue-600" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&audience=obrazovanie')}
            />
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BentoGridItem
              title="Редактор"
              description="Промпты для написания, редактуры и SEO-оптимизации текстов."
              icon={<PenTool className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&category=editor')}
            />
            <BentoGridItem
              title="Менеджер"
              description="Планирование, аналитика, документы и управление командой."
              icon={<Briefcase className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&category=manager')}
            />
            <BentoGridItem
              title="Дизайнер"
              description="Генерация изображений, концептов и UI-элементов."
              icon={<Palette className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&category=designer')}
            />
            <BentoGridItem
              title="Разработчик"
              description="Веб-страницы из документов: анонсы, педсоветы, портфолио уроков."
              icon={<Code className="h-5 w-5 text-zinc-500" />}
              className=""
              onClick={() => navigate('/catalog?type=prompt&category=developer')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
