import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import logo from '../assets/logo.png';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get('q') || '');
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <img src={logo} alt="Логотип" className="h-8 w-8 rounded-lg object-cover" />
          <span className="hidden sm:inline-block text-lg tracking-tight">ИИ Каталог</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Поиск по промптам и инструментам..."
              className="w-full bg-zinc-100 pl-9 border-transparent focus-visible:bg-white focus-visible:ring-zinc-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/catalog?type=tool" className="text-zinc-600 hover:text-zinc-900 transition-colors">Инструменты</Link>
            <Link to="/catalog?type=prompt" className="text-zinc-600 hover:text-zinc-900 transition-colors">Промпты</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
