import { useMemo, useState, type ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FilterableGridProps<T> {
  /** The full list of records to display. */
  items: T[];
  /** Returns the text that a given item should be matched against. */
  searchText: (item: T) => string;
  /** Renders a single item (typically a card). */
  renderItem: (item: T) => ReactNode;
  /** Stable React key for each item. */
  getKey: (item: T) => string;
  /** Tailwind classes for the results grid container. */
  gridClassName?: string;
  /** Placeholder shown in the search box. */
  placeholder?: string;
  /**
   * Lowercased plural noun used in the result count and empty state,
   * e.g. "barangays". Defaults to "results".
   */
  noun?: string;
}

/**
 * A search-as-you-type wrapper around a grid of cards. Drop it in anywhere a
 * page currently maps a long list straight into a grid: it adds a search box,
 * a live result count, and a clear empty state without the page needing its
 * own filtering state. Matching is case-insensitive substring over whatever
 * `searchText` returns.
 */
function FilterableGrid<T>({
  items,
  searchText,
  renderItem,
  getKey,
  gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  placeholder,
  noun = 'results',
}: FilterableGridProps<T>) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(item => searchText(item).toLowerCase().includes(q));
  }, [items, query, searchText]);

  const resolvedPlaceholder =
    placeholder ?? t('common.filterPlaceholder', 'Search…');

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={resolvedPlaceholder}
            aria-label={resolvedPlaceholder}
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-9 text-sm text-gray-800 focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('common.clearSearch', 'Clear search')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500" aria-live="polite">
          {t('common.showingCount', {
            shown: filtered.length,
            total: items.length,
            noun,
            defaultValue: `Showing {{shown}} of {{total}} {{noun}}`,
          })}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className={gridClassName}>
          {filtered.map(item => (
            <div key={getKey(item)}>{renderItem(item)}</div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          {t('common.noMatches', {
            query,
            noun,
            defaultValue: `No {{noun}} match “{{query}}”.`,
          })}
        </div>
      )}
    </div>
  );
}

export default FilterableGrid;
