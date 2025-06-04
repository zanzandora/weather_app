import {
  fetchAirPollution,
  fetchLocationSearch,
  fetchWeather,
} from '@/app/services/weather';
import {
  SearchItem,
  WeatherResponse,
  FavoriteCity,
  AirPolluton,
} from '@/types/apiType';
import { useQueries, useQuery } from '@tanstack/react-query';

export const useWeather = (name?: string, lat?: number, lon?: number) => {
  return useQuery<WeatherResponse>({
    queryKey: ['weather', name, lat, lon],
    queryFn: () => fetchWeather(name, lat, lon),
  });
};

export const useMultipleWeather = (favorites: FavoriteCity[]) => {
  return useQueries({
    queries: favorites.map((city) => ({
      queryKey: ['favorite', city.name, city.lat, city.lon],
      queryFn: () => fetchWeather(city.name, city.lat, city.lon),
    })),
  });
};

export const useLocationSearch = (city: string) => {
  return useQuery<SearchItem[]>({
    queryKey: ['weather', city],
    queryFn: () => fetchLocationSearch(city),
    enabled: !!city && city.trim().length > 1,
  });
};

export const useAirPollution = (
  lat: number,
  lon: number,
  start: number,
  end: number
) => {
  return useQuery<AirPolluton[]>({
    queryKey: ['air-pollution', lat, lon, start, end],
    queryFn: () => fetchAirPollution(lat, lon, start, end),
  });
};
