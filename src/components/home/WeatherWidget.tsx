import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  Umbrella,
  Sunrise,
  Sunset,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { Heading } from '../ui/Heading';
import { fetchWithTimeout } from '../../lib/utils';

// Koronadal City (Marbel) — approximate city-center coordinates.
const KORONADAL_LAT = 6.5031;
const KORONADAL_LON = 124.8467;

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${KORONADAL_LAT}` +
  `&longitude=${KORONADAL_LON}` +
  '&current=temperature_2m,relative_humidity_2m,apparent_temperature,' +
  'precipitation,weather_code,wind_speed_10m,wind_gusts_10m' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,' +
  'precipitation_probability_max,uv_index_max,sunrise,sunset' +
  '&timezone=Asia%2FManila&forecast_days=4';

interface DailyForecast {
  date: string;
  code: number;
  max: number;
  min: number;
  rainChance: number;
}

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  code: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
  daily: DailyForecast[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

// WMO weather interpretation codes → label + icon.
// https://open-meteo.com/en/docs#weathervariables
function describeWeather(
  code: number,
  t: TFunction
): {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
} {
  if (code === 0)
    return { label: t('home.weather.conditions.clearSky'), Icon: Sun };
  if (code <= 2)
    return { label: t('home.weather.conditions.partlyCloudy'), Icon: CloudSun };
  if (code === 3)
    return { label: t('home.weather.conditions.overcast'), Icon: Cloud };
  if (code <= 48)
    return { label: t('home.weather.conditions.fog'), Icon: CloudFog };
  if (code <= 57)
    return { label: t('home.weather.conditions.drizzle'), Icon: CloudDrizzle };
  if (code <= 67)
    return { label: t('home.weather.conditions.rain'), Icon: CloudRain };
  if (code <= 77)
    return { label: t('home.weather.conditions.snow'), Icon: CloudSnow };
  if (code <= 82)
    return {
      label: t('home.weather.conditions.rainShowers'),
      Icon: CloudRain,
    };
  if (code <= 86)
    return {
      label: t('home.weather.conditions.snowShowers'),
      Icon: CloudSnow,
    };
  return {
    label: t('home.weather.conditions.thunderstorm'),
    Icon: CloudLightning,
  };
}

// Open-Meteo returns sunrise/sunset as "YYYY-MM-DDTHH:mm" (no zone, already in
// Asia/Manila). Show a friendly local time like "5:30 AM".
function clockTime(isoDateTime: string): string {
  const time = isoDateTime.split('T')[1] ?? '';
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h)) return '—';
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function dayLabel(isoDate: string, index: number, t: TFunction): string {
  if (index === 0) return t('home.weather.today');
  // isoDate is YYYY-MM-DD; parse as local date for the weekday name.
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function WeatherWidget() {
  const { t } = useTranslation();
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchWithTimeout(WEATHER_URL)
      .then(res => {
        if (!res.ok) throw new Error('Weather request failed');
        return res.json() as Promise<OpenMeteoResponse>;
      })
      .then(json => {
        if (cancelled) return;
        setData({
          temperature: Math.round(json.current.temperature_2m),
          feelsLike: Math.round(json.current.apparent_temperature),
          humidity: Math.round(json.current.relative_humidity_2m),
          windSpeed: Math.round(json.current.wind_speed_10m),
          windGusts: Math.round(json.current.wind_gusts_10m),
          precipitation: json.current.precipitation,
          code: json.current.weather_code,
          uvMax: Math.round(json.daily.uv_index_max[0]),
          sunrise: json.daily.sunrise[0],
          sunset: json.daily.sunset[0],
          daily: json.daily.time.map((date, i) => ({
            date,
            code: json.daily.weather_code[i],
            max: Math.round(json.daily.temperature_2m_max[i]),
            min: Math.round(json.daily.temperature_2m_min[i]),
            rainChance: Math.round(
              json.daily.precipitation_probability_max[i] ?? 0
            ),
          })),
        });
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
      <Heading level={2}>{t('home.weather.title')}</Heading>
      <p className="text-gray-600 mb-6">{t('home.weather.subtitle')}</p>

      <div className="flex-grow rounded-lg border border-gray-200 bg-white p-6">
        {loading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Cloud className="h-6 w-6 animate-pulse" />
            <span>{t('home.weather.loading')}</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 text-gray-600">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">
                {t('home.weather.errorTitle')}
              </p>
              <p className="text-sm">
                {t('home.weather.errorBefore')}{' '}
                <a
                  href="https://www.pagasa.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  PAGASA
                </a>{' '}
                {t('home.weather.errorAfter')}
              </p>
            </div>
          </div>
        )}

        {data && (
          <div className="flex h-full flex-col justify-center">
            {/* Current conditions — given the full width of the card */}
            <div className="flex flex-wrap items-center gap-6">
              {(() => {
                const { Icon, label } = describeWeather(data.code, t);
                return (
                  <>
                    <div className="flex items-center gap-4">
                      <Icon className="h-20 w-20 text-primary-600" />
                      <div>
                        <p className="text-5xl font-bold text-gray-900">
                          {data.temperature}°C
                        </p>
                        <p className="text-gray-600">{label}</p>
                        <p className="flex items-center gap-1 text-sm text-gray-500">
                          <Thermometer className="h-4 w-4" />{' '}
                          {t('home.weather.feelsLike', {
                            temp: data.feelsLike,
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Detail metrics fill the remaining width */}
                    <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 sm:grid-cols-3">
                      <span className="flex items-center gap-1.5">
                        <Droplets className="h-4 w-4 text-primary-500" />{' '}
                        {data.humidity}%
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Wind className="h-4 w-4 text-primary-500" />{' '}
                        {data.windSpeed} km/h
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Umbrella className="h-4 w-4 text-primary-500" />{' '}
                        {data.precipitation} mm
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sun className="h-4 w-4 text-primary-500" />{' '}
                        {t('home.weather.uv', { value: data.uvMax })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sunrise className="h-4 w-4 text-primary-500" />{' '}
                        {clockTime(data.sunrise)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sunset className="h-4 w-4 text-primary-500" />{' '}
                        {clockTime(data.sunset)}
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Daily forecast lives behind a disclosure link so the main widget
          stays uncluttered. */}
      {data && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowForecast(v => !v)}
            aria-expanded={showForecast}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800"
          >
            {showForecast
              ? t('home.weather.hideForecast')
              : t('home.weather.showForecast')}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showForecast ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showForecast && (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-4">
              {data.daily.map((day, i) => {
                const { Icon, label } = describeWeather(day.code, t);
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center rounded-lg bg-gray-50 py-3 text-center"
                  >
                    <span className="text-xs font-medium text-gray-500">
                      {dayLabel(day.date, i, t)}
                    </span>
                    <Icon
                      className="my-1 h-7 w-7 text-primary-500"
                      aria-label={label}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {day.max}°
                    </span>
                    <span className="text-xs text-gray-500">{day.min}°</span>
                    <span className="mt-1 flex items-center gap-0.5 text-xs text-primary-600">
                      <Umbrella className="h-3 w-3" />
                      {day.rainChance}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        {t('home.weather.attributionBefore')}{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open-Meteo
        </a>
        {t('home.weather.attributionMiddle')}{' '}
        <a
          href="https://www.pagasa.dost.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          PAGASA
        </a>
        {t('home.weather.attributionAfter')}
      </p>
    </div>
  );
}
