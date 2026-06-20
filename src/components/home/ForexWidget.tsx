import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, AlertCircle, TrendingUp } from 'lucide-react';
import { Heading } from '../ui/Heading';

// Bangko Sentral ng Pilipinas (BSP) reference exchange rates. This SharePoint
// OData list sends `Access-Control-Allow-Origin: *`, so — like the USGS feed in
// EarthquakeWidget — it can be fetched directly from the browser at runtime, no
// backend or scheduled job required. Group '1' is the daily reference rates.
const BSP_URL =
  "https://www.bsp.gov.ph/_api/web/lists/getByTitle('Exchange Rate')/items" +
  "?$select=*&$filter=Group eq '1'&$orderby=Ordering asc";

// The handful of currencies most relevant to Koronadal residents (OFW remittance
// corridors + trade), shown first and in this order.
const FEATURED = ['USD', 'SAR', 'AED', 'JPY', 'EUR', 'SGD', 'GBP', 'AUD'];

interface Rate {
  country: string;
  symbol: string;
  php: number;
}

interface BSPItem {
  Title?: string;
  Symbol?: string;
  PHPequivalent?: string;
  PublishedDate?: string;
}

interface BSPResponse {
  value: BSPItem[];
}

export default function ForexWidget() {
  const { t } = useTranslation();
  const [rates, setRates] = useState<Rate[] | null>(null);
  const [published, setPublished] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(BSP_URL, { headers: { Accept: 'application/json' } })
      .then(res => {
        if (!res.ok) throw new Error('Forex request failed');
        return res.json() as Promise<BSPResponse>;
      })
      .then(json => {
        if (cancelled) return;
        const all = (json.value || [])
          .filter(r => r.Symbol && Number(r.PHPequivalent))
          .map(r => ({
            country: r.Title ?? '',
            symbol: r.Symbol as string,
            php: Number(r.PHPequivalent),
          }));
        const featured = FEATURED.map(sym =>
          all.find(r => r.symbol === sym)
        ).filter((r): r is Rate => Boolean(r));
        setRates(featured.length ? featured : all.slice(0, 8));
        setPublished(json.value?.[0]?.PublishedDate ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <Heading level={2}>{t('home.forex.title')}</Heading>
      <p className="text-gray-600 mb-6">{t('home.forex.subtitle')}</p>

      <div className="flex-grow rounded-lg border border-gray-200 bg-white p-6">
        {loading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Coins className="h-6 w-6 animate-pulse" />
            <span>{t('home.forex.loading')}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 text-gray-600">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('home.forex.errorTitle')}
              </p>
              <p className="text-sm">
                {t('home.forex.errorBefore')}{' '}
                <a
                  href="https://www.bsp.gov.ph/SitePages/Statistics/ExchangeRate.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  {t('home.forex.errorLink')}
                </a>{' '}
                {t('home.forex.errorAfter')}
              </p>
            </div>
          </div>
        )}

        {rates && rates.length > 0 && (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {rates.map(rate => (
              <li
                key={rate.symbol}
                className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <TrendingUp className="h-3.5 w-3.5 text-primary-500" />
                  {rate.symbol}
                </span>
                <span className="text-sm tabular-nums text-gray-700">
                  ₱{rate.php.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {t('home.forex.ratesNote')}{' '}
        {published &&
          t('home.forex.published', { date: published.slice(0, 10) }) + ' '}
        {t('home.forex.sourceLabel')}{' '}
        <a
          href="https://www.bsp.gov.ph/SitePages/Statistics/ExchangeRate.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Bangko Sentral ng Pilipinas
        </a>
        .
      </p>
    </div>
  );
}
