import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';

export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left section with title and search */}
          <div className="animate-fade-in">
            <Text transform="uppercase">Welcome to</Text>
            <Heading>{import.meta.env.VITE_GOVERNMENT_NAME}</Heading>
            <Text>{t('hero.subtitle')}</Text>

            <form onSubmit={onSubmit} className="mt-6 max-w-md">
              <div className="flex items-center gap-2 rounded-lg bg-white p-1.5 shadow-sm">
                <Search className="ml-2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search services and information…"
                  aria-label="Search BetterKoronadal.org"
                  className="w-full bg-transparent py-1.5 text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
