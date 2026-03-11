import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-900">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg tracking-tight">ИИ Каталог</span>
            </Link>
            <p className="text-sm text-zinc-500 mt-2">
              Современная база знаний ИИ-инструментов, промптов и агентов для вашей продуктивности.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 mb-4">Категории</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/catalog?category=editor" className="hover:text-zinc-900 transition-colors">Редактор</Link></li>
              <li><Link to="/catalog?category=manager" className="hover:text-zinc-900 transition-colors">Менеджер</Link></li>
              <li><Link to="/catalog?category=designer" className="hover:text-zinc-900 transition-colors">Дизайнер</Link></li>
              <li><Link to="/catalog?category=developer" className="hover:text-zinc-900 transition-colors">Разработчик</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 mb-4">Типы</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link to="/catalog?type=tool" className="hover:text-zinc-900 transition-colors">Инструменты</Link></li>
              <li><Link to="/catalog?type=prompt" className="hover:text-zinc-900 transition-colors">Промпты</Link></li>
              <li><Link to="/catalog?type=agent" className="hover:text-zinc-900 transition-colors">Агенты</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-zinc-900 mb-4">О проекте</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-zinc-900 transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-zinc-900 transition-colors">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-200 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} Центр Знаний Машук. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
