import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { Activity, AlertCircle, MapPin } from 'lucide-react';
import { Heading } from '../ui/Heading';
import { fetchWithTimeout } from '../../lib/utils';

// Koronadal City (Marbel) — approximate city-center coordinates.
const KORONADAL_LAT = 6.5031;
const KORONADAL_LON = 124.8467;

// USGS earthquake feed (CORS-enabled). PHIVOLCS has no public JSON API, so we
// use USGS for near-real-time data and link to PHIVOLCS for official bulletins.
const QUAKE_URL =
  'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' +
  `&latitude=${KORONADAL_LAT}&longitude=${KORONADAL_LON}` +
  '&maxradiuskm=500&minmagnitude=2.5&orderby=time&limit=6';

interface Quake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  depth: number;
  url: string;
}

interface USGSFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [lon, lat, depth]
  };
}

interface USGSResponse {
  features: USGSFeature[];
}

// Color the magnitude badge by severity.
function magnitudeColor(mag: number): string {
  if (mag >= 6) return 'bg-red-100 text-red-700';
  if (mag >= 5) return 'bg-orange-100 text-orange-700';
  if (mag >= 4) return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
}

function timeAgo(ms: number, t: TFunction): string {
  const diff = Date.now() - ms;
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return t('home.earthquake.justNow');
  if (minutes < 60) return t('home.earthquake.minutesAgo', { count: minutes });
  const hours = Math.round(minutes / 60);
  if (hours < 24) return t('home.earthquake.hoursAgo', { count: hours });
  const days = Math.round(hours / 24);
  return t('home.earthquake.daysAgo', { count: days });
}

export default function EarthquakeWidget() {
  const { t } = useTranslation();
  const [quakes, setQuakes] = useState<Quake[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchWithTimeout(QUAKE_URL)
      .then(res => {
        if (!res.ok) throw new Error('Earthquake request failed');
        return res.json() as Promise<USGSResponse>;
      })
      .then(json => {
        if (cancelled) return;
        setQuakes(
          json.features.map(f => ({
            id: f.id,
            magnitude: f.properties.mag ?? 0,
            place: f.properties.place ?? t('home.earthquake.unknownLocation'),
            time: f.properties.time,
            depth: Math.round(f.geometry.coordinates[2]),
            url: f.properties.url,
          }))
        );
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
  }, [t]);

  return (
    <div className="flex h-full flex-col">
      <Heading level={2}>{t('home.earthquake.title')}</Heading>
      <p className="text-gray-600 mb-6">{t('home.earthquake.subtitle')}</p>

      <div className="flex-grow rounded-lg border border-gray-200 bg-white p-6">
        {loading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Activity className="h-6 w-6 animate-pulse" />
            <span>{t('home.earthquake.loading')}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 text-gray-600">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('home.earthquake.errorTitle')}
              </p>
              <p className="text-sm">
                {t('home.earthquake.errorBefore')}{' '}
                <a
                  href="https://earthquake.phivolcs.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  PHIVOLCS
                </a>{' '}
                {t('home.earthquake.errorAfter')}
              </p>
            </div>
          </div>
        )}

        {quakes && quakes.length === 0 && (
          <div className="flex items-center gap-3 text-gray-600">
            <Activity className="h-6 w-6 shrink-0 text-primary-500" />
            <p>{t('home.earthquake.noRecent')}</p>
          </div>
        )}

        {quakes && quakes.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {quakes.map(quake => (
              <li key={quake.id}>
                <a
                  href={quake.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-gray-50"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-md text-sm font-bold ${magnitudeColor(
                      quake.magnitude
                    )}`}
                  >
                    {quake.magnitude.toFixed(1)}
                  </span>
                  <span className="min-w-0 flex-grow">
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-900">
                      <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate">{quake.place}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeAgo(quake.time, t)} ·{' '}
                      {t('home.earthquake.depth', { depth: quake.depth })}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        {t('home.earthquake.attributionBefore')}{' '}
        <a
          href="https://earthquake.usgs.gov"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          USGS
        </a>
        {t('home.earthquake.attributionMiddle')}{' '}
        <a
          href="https://earthquake.phivolcs.dost.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          PHIVOLCS
        </a>
        {t('home.earthquake.attributionAfter')}
      </p>
    </div>
  );
}
