import { useEffect, useState } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { Heading } from '../ui/Heading';

// Koronadal City (Marbel) — approximate city-center coordinates.
const KORONADAL_LAT = 6.5031;
const KORONADAL_LON = 124.8467;

const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${KORONADAL_LAT}` +
  `&longitude=${KORONADAL_LON}` +
  '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
  '&timezone=Asia%2FManila&forecast_days=4';

interface DailyForecast {
  date: string;
  code: number;
  max: number;
  min: number;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  code: number;
  daily: DailyForecast[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

// WMO weather interpretation codes → label + icon.
// https://open-meteo.com/en/docs#weathervariables
function describeWeather(code: number): {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
} {
  if (code === 0) return { label: 'Clear sky', Icon: Sun };
  if (code <= 2) return { label: 'Partly cloudy', Icon: CloudSun };
  if (code === 3) return { label: 'Overcast', Icon: Cloud };
  if (code <= 48) return { label: 'Fog', Icon: CloudFog };
  if (code <= 57) return { label: 'Drizzle', Icon: CloudDrizzle };
  if (code <= 67) return { label: 'Rain', Icon: CloudRain };
  if (code <= 77) return { label: 'Snow', Icon: CloudSnow };
  if (code <= 82) return { label: 'Rain showers', Icon: CloudRain };
  if (code <= 86) return { label: 'Snow showers', Icon: CloudSnow };
  return { label: 'Thunderstorm', Icon: CloudLightning };
}

function dayLabel(isoDate: string, index: number): string {
  if (index === 0) return 'Today';
  // isoDate is YYYY-MM-DD; parse as local date for the weekday name.
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(WEATHER_URL)
      .then(res => {
        if (!res.ok) throw new Error('Weather request failed');
        return res.json() as Promise<OpenMeteoResponse>;
      })
      .then(json => {
        if (cancelled) return;
        setData({
          temperature: Math.round(json.current.temperature_2m),
          humidity: Math.round(json.current.relative_humidity_2m),
          windSpeed: Math.round(json.current.wind_speed_10m),
          code: json.current.weather_code,
          daily: json.daily.time.map((date, i) => ({
            date,
            code: json.daily.weather_code[i],
            max: Math.round(json.daily.temperature_2m_max[i]),
            min: Math.round(json.daily.temperature_2m_min[i]),
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
      <Heading level={2}>Koronadal Weather</Heading>
      <p className="text-gray-600 mb-6">
        Current conditions and the days ahead for the City of Koronadal.
      </p>

      <div className="flex-grow rounded-lg border border-gray-200 bg-white p-6">
        {loading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Cloud className="h-6 w-6 animate-pulse" />
            <span>Loading current weather…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 text-gray-600">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900">
                Weather is unavailable right now
              </p>
              <p className="text-sm">
                Check{' '}
                <a
                  href="https://www.pagasa.dost.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 underline"
                >
                  PAGASA
                </a>{' '}
                for the latest forecast and weather advisories.
              </p>
            </div>
          </div>
        )}

        {data && (
          <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-center">
            {/* Current conditions */}
            <div className="flex items-center gap-4">
              {(() => {
                const { Icon, label } = describeWeather(data.code);
                return (
                  <>
                    <Icon className="h-16 w-16 text-primary-600" />
                    <div>
                      <p className="text-4xl font-bold text-gray-900">
                        {data.temperature}°C
                      </p>
                      <p className="text-gray-600">{label}</p>
                      <div className="mt-1 flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" /> {data.humidity}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="h-4 w-4" /> {data.windSpeed} km/h
                        </span>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Multi-day forecast */}
            <div className="grid grid-cols-4 gap-3 border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
              {data.daily.map((day, i) => {
                const { Icon, label } = describeWeather(day.code);
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="text-xs font-medium text-gray-500">
                      {dayLabel(day.date, i)}
                    </span>
                    <Icon
                      className="my-1 h-7 w-7 text-primary-500"
                      aria-label={label}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {day.max}°
                    </span>
                    <span className="text-xs text-gray-500">{day.min}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Weather data by{' '}
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Open-Meteo
        </a>
        . For official warnings and typhoon advisories, always check{' '}
        <a
          href="https://www.pagasa.dost.gov.ph"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          PAGASA
        </a>
        .
      </p>
    </div>
  );
}
