import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Section from '../components/ui/Section';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import SEO from '../components/SEO';
import { Card, CardContent } from '@bettergov/kapwa/card';
import {
  buildSearchEntries,
  searchEntries,
  type SearchEntry,
} from '../lib/searchEntries';

const sectionBadge: Record<SearchEntry['section'], string> = {
  Services: 'bg-primary-100 text-primary-700',
  Government: 'bg-accent-100 text-accent-700',
  Data: 'bg-emerald-100 text-emerald-700',
  Page: 'bg-gray-100 text-gray-700',
};

const Search: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [input, setInput] = useState(query);
  const [entries, setEntries] = useState<SearchEntry[]>([]);

  useEffect(() => {
    let active = true;
    buildSearchEntries().then(e => {
      if (active) setEntries(e);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = useMemo(
    () => searchEntries(entries, query),
    [entries, query]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    setSearchParams(trimmed ? { q: trimmed } : {});
  };

  return (
    <>
      <SEO
        title={t('pages.search.seoTitle')}
        description={t('pages.search.seoDescription')}
        keywords={t('pages.search.seoKeywords')}
      />
      <main className="flex-grow">
        <Section className="p-3 mb-12">
          <Breadcrumbs
            className="mb-8"
            items={[
              { label: t('pages.search.breadcrumbHome'), href: '/' },
              { label: t('pages.search.breadcrumbSearch'), href: '/search' },
            ]}
          />

          <Heading>{t('pages.search.heading')}</Heading>
          <Text className="text-gray-600 mb-6">{t('pages.search.intro')}</Text>

          <form onSubmit={onSubmit} className="mb-8 max-w-2xl">
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
              <SearchIcon className="h-5 w-5 text-gray-400" />
              <input
                type="search"
                autoFocus
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t('pages.search.placeholder')}
                className="w-full bg-transparent text-gray-900 outline-none"
                aria-label={t('pages.search.ariaLabel')}
              />
              <button
                type="submit"
                className="rounded-md bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                {t('pages.search.searchButton')}
              </button>
            </div>
          </form>

          {query && (
            <Text className="text-sm text-gray-500 mb-4">
              {t('pages.search.resultsCount', { count: results.length })} for{' '}
              <span className="font-medium text-gray-700">“{query}”</span>
            </Text>
          )}

          {query && results.length === 0 ? (
            <Card>
              <CardContent>
                <p className="text-gray-700">
                  {t('pages.search.noResults')}{' '}
                  <Link to="/services" className="text-primary-600 underline">
                    {t('pages.search.allServices')}
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {results.map(entry => (
                <Link key={entry.url} to={entry.url}>
                  <Card hoverable className="mb-3">
                    <CardContent>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {entry.title}
                          </h4>
                          {entry.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {entry.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`shrink-0 rounded-sm px-2 py-1 text-xs font-medium ${sectionBadge[entry.section]}`}
                        >
                          {entry.category ?? entry.section}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </>
  );
};

export default Search;
