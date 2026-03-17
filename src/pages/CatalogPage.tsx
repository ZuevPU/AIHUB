import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { materials, MaterialType, Category } from '@/data/materials';
import { MaterialCard } from '@/components/MaterialCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter, Search, Image, Video, Presentation } from 'lucide-react';

export function CatalogPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [activeType, setActiveType] = useState<MaterialType | 'all'>('all');
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Parse URL params on mount and when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeParam = params.get('type') as MaterialType | null;
    const categoryParam = params.get('category') as Category | null;
    const qParam = params.get('q');

    if (typeParam && ['tool', 'prompt', 'agent'].includes(typeParam)) {
      setActiveType(typeParam);
    } else {
      setActiveType('all');
    }

    if (categoryParam && ['editor', 'manager', 'designer', 'developer'].includes(categoryParam)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory('all');
    }

    if (qParam) {
      setSearchQuery(qParam);
    } else {
      setSearchQuery('');
    }
  }, [location.search]);

  // Update URL when filters change
  const updateFilters = (type: MaterialType | 'all', category: Category | 'all') => {
    const params = new URLSearchParams(location.search);
    
    if (type === 'all') params.delete('type');
    else params.set('type', type);
    
    if (category === 'all') params.delete('category');
    else params.set('category', category);
    
    navigate(`/catalog?${params.toString()}`, { replace: true });
  };

  const clearFilters = () => {
    navigate('/catalog');
  };

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      // Type filter
      if (activeType !== 'all' && material.type !== activeType) return false;
      
      // Category filter
      if (activeCategory !== 'all' && !material.categories.includes(activeCategory)) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = material.title.toLowerCase().includes(query);
        const matchesDesc = material.description.toLowerCase().includes(query);
        const matchesTags = material.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }
      
      return true;
    });
  }, [activeType, activeCategory, searchQuery]);

  const categories: { id: Category | 'all'; label: string }[] = [
    { id: 'all', label: 'Все категории' },
    { id: 'editor', label: 'Редактор' },
    { id: 'manager', label: 'Менеджер' },
    { id: 'designer', label: 'Дизайнер' },
    { id: 'developer', label: 'Разработчик' },
  ];

  const types: { id: MaterialType | 'all'; label: string }[] = [
    { id: 'all', label: 'Все типы' },
    { id: 'tool', label: 'Инструменты' },
    { id: 'prompt', label: 'Промпты' },
  ];

  const hasActiveFilters = activeType !== 'all' || activeCategory !== 'all' || searchQuery !== '';

  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Фильтры
              </h2>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs text-zinc-500">
                  <X className="w-3 h-3 mr-1" />
                  Сбросить
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Тип материала</h3>
              <div className="flex flex-col gap-2">
                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateFilters(type.id, activeCategory)}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeType === type.id
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Категория</h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => updateFilters(activeType, category.id)}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeCategory === category.id
                        ? 'bg-zinc-900 text-white font-medium'
                        : 'text-zinc-600 hover:bg-zinc-100'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Каталог материалов
            </h1>
            <p className="mt-2 text-zinc-500">
              Найдено материалов: {filteredMaterials.length}
            </p>
            
            {searchQuery && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-zinc-500">Поиск по запросу:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{searchQuery}"
                  <button 
                    onClick={() => {
                      const params = new URLSearchParams(location.search);
                      params.delete('q');
                      navigate(`/catalog?${params.toString()}`);
                    }}
                    className="ml-1 rounded-full p-0.5 hover:bg-zinc-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>

          {activeCategory === 'designer' && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Собери свой промпт</h2>
              <p className="text-zinc-600 mb-6">
                Выберите тип контента и соберите идеальный промпт по частям
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <button
                  onClick={() => navigate('/designer/prompt-builder')}
                  className="text-left rounded-2xl border-2 border-zinc-200 bg-white p-6 transition-all hover:border-violet-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl p-2.5 bg-violet-100">
                      <Image className="w-6 h-6 text-violet-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">Изображение</h3>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Соберите промпт для генерации изображений в Алиса AI и GigaChat.
                  </p>
                </button>
                <div className="text-left rounded-2xl border-2 border-zinc-200 bg-white p-6 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl p-2.5 bg-amber-100">
                      <Video className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">Видео</h3>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Конструктор промптов для генерации видео. Скоро.
                  </p>
                  <span className="inline-block mt-4 text-xs font-medium text-zinc-400">В разработке</span>
                </div>
                <div className="text-left rounded-2xl border-2 border-zinc-200 bg-white p-6 opacity-60 cursor-not-allowed">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-xl p-2.5 bg-emerald-100">
                      <Presentation className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900">Презентации</h3>
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Шаблоны для создания презентаций. Скоро.
                  </p>
                  <span className="inline-block mt-4 text-xs font-medium text-zinc-400">В разработке</span>
                </div>
              </div>
            </div>
          )}

          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
              <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-zinc-900">Ничего не найдено</h3>
              <p className="mt-2 text-sm text-zinc-500 max-w-sm">
                Попробуйте изменить параметры фильтрации или поисковый запрос.
              </p>
              <Button variant="outline" className="mt-6" onClick={clearFilters}>
                Сбросить все фильтры
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
