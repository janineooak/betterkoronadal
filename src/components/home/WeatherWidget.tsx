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
  Thermometer,
  Umbrella,
  Sunrise,
  Sunset,
  AlertCircle,
} from 'lucide-react';
import { Heading } from '../ui/Heading';

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
                      <p className="flex items-center gap-1 text-sm text-gray-500">
                        <Thermometer className="h-4 w-4" /> Feels like{' '}
                        {data.feelsLike}°C
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" /> {data.humidity}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Wind className="h-4 w-4" /> {data.windSpeed} km/h
                          {data.windGusts > data.windSpeed && (
                            <span className="text-gray-400">
                              {' '}
                              (gusts {data.windGusts})
                            </span>
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Umbrella className="h-4 w-4" /> {data.precipitation}{' '}
                          mm
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Sun className="h-4 w-4" /> UV {data.uvMax}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sunrise className="h-4 w-4" />{' '}
                          {clockTime(data.sunrise)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sunset className="h-4 w-4" />{' '}
                          {clockTime(data.sunset)}
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
                    <span className="mt-1 flex items-center gap-0.5 text-xs text-primary-600">
                      <Umbrella className="h-3 w-3" />
                      {day.rainChance}%
                    </span>
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
