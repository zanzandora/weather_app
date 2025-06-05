import { SearchItem, WeatherResponse } from '@/types/apiType';
import axios, { AxiosError } from 'axios';

const KELVIN_TO_CELSIUS = 273.15;
const KMH_TO_MS = 3.6;
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY as string;

type Props = {
  time: string[];
  uv_index_max: number[];
};

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org',
});

const openMeteoApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
});

async function fetchOpenWeather(lat: number, lon: number, apiKey: string) {
  try {
    const { data } = await openWeatherApi.get(
      `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Status:', error.response?.status);
      throw new Error(
        'Error when fetching OpenWeatherMap data: ' + error.message
      );
    }
  }
}

async function fetchOpenWeatherLocationSearch(city: string, apiKey: string) {
  try {
    const { data } = await openWeatherApi.get(
      `/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Status:', error.response?.status);
      throw new Error(
        'Error when fetching OpenWeatherMap search location data: ' +
          error.message
      );
    }
  }
}

async function fetchOpenMeteo(lat: number, lon: number) {
  try {
    const { data } = await openMeteoApi.get(
      `/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,uv_index_max&timezone=auto`
    );
    return data?.daily;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Status:', error.response?.status);
      throw new Error('Error when fetching OprnMeteo data: ' + error.message);
    }
  }
}

export async function fetchAirPollution(
  lat: number,
  lon: number,
  start: number,
  end: number
) {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${API_KEY}`
    );
    return data?.list || [];
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log('Status:', error.response?.status);
      throw new Error(
        'Error when fetching Air Pollution data: ' + error.message
      );
    }
  }
}

function formatRainChance(rain: Record<string, number>): string {
  if (!rain) return '0 mm/h';
  if (rain['1h']) return `${rain['1h']} mm/h`;
  if (rain['3h']) return `${rain['3h']} mm/3h`;
  return 'Có mưa';
}

function getTodayUvIndex(daily: Props): number | undefined {
  const today = new Date().toISOString().slice(0, 10);
  const index = daily.time.findIndex((d: string) => d === today);
  return daily.uv_index_max[index];
}

function toCelsius(kelvin: number | undefined): string {
  return kelvin ? (kelvin - KELVIN_TO_CELSIUS).toFixed(1) : '--';
}

function toMs(kmh: number | undefined): string {
  return kmh ? (kmh * KMH_TO_MS).toFixed(1) : '--';
}

async function getCoordinates(
  latParam?: number,
  lonParam?: number
): Promise<{ lat: number; lon: number }> {
  if (latParam && lonParam) {
    return { lat: latParam, lon: lonParam };
  }
  if (typeof window !== 'undefined' && navigator.geolocation) {
    try {
      const { coords } = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      return { lat: coords.latitude, lon: coords.longitude };
    } catch {
      throw new Error('Không lấy được vị trí từ trình duyệt.');
    }
  }
  throw new Error('Không có toạ độ hợp lệ để lấy dữ liệu thời tiết.');
}

export async function fetchWeather(
  name?: string,
  latParam?: number,
  lonParam?: number
): Promise<WeatherResponse> {
  const { lat, lon } = await getCoordinates(latParam, lonParam);

  const [openWeatherData, openMeteoUvIndexDaily] = await Promise.all([
    fetchOpenWeather(lat, lon, API_KEY),
    fetchOpenMeteo(lat, lon),
  ]);

  const main = openWeatherData.main || {};
  const wind = openWeatherData.wind || {};

  return {
    ...openWeatherData,
    main: {
      ...main,
      feels_like: toCelsius(main.feels_like),
      temp: toCelsius(main.temp),
      temp_min: toCelsius(main.temp_min),
      temp_max: toCelsius(main.temp_max),
    },
    wind: {
      ...wind,
      speed: toMs(wind.speed),
    },
    rain: formatRainChance(openWeatherData.rain),
    daily: {
      ...openMeteoUvIndexDaily,
      uv_index_max: getTodayUvIndex(openMeteoUvIndexDaily),
    },
    name: name || 'Your Location',
  };
}

export async function fetchLocationSearch(city: string): Promise<SearchItem[]> {
  if (!city) throw new Error('City name is required');
  const normalizedCity = city.trim().toLowerCase();

  const locations = await fetchOpenWeatherLocationSearch(
    normalizedCity,
    API_KEY
  );

  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error('Không tìm thấy thành phố nào từ OpenWeatherMap');
  }

  return locations
    .map((location: SearchItem) => {
      const { lat, lon, name, country, state } = location;
      if (lat == null || lon == null) return null;
      return { lat, lon, name, country, state } as SearchItem;
    })
    .filter(Boolean) as SearchItem[];
}
