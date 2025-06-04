import { FavoriteCity } from '@/types/apiType';
import useLocalStorage from './useLocalStorage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const FAVORITE_KEY = 'favorite-cities';

export function useFavoriteCities() {
  const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>(
    FAVORITE_KEY,
    []
  );
  const queryClient = useQueryClient();

  const getFavorites = useQuery({
    queryKey: [FAVORITE_KEY],
    queryFn: () => favorites,
    initialData: favorites,
    staleTime: Infinity,
  });

  const addFavorite = useMutation({
    mutationFn: async (city: Omit<FavoriteCity, 'id' | 'addedTime'>) => {
      const newItem: FavoriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}-${Date.now()}`,
        addedTime: Date.now(),
      };
      const exists = favorites.some(
        (item) => item.lat === city.lat && item.lon === city.lon
      );
      if (exists) return favorites;

      const newList = [...favorites, newItem];
      setFavorites(newList);
      return newList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAVORITE_KEY] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (coord: { lat: number; lon: number }) => {
      const newList = favorites.filter(
        (item) => !(item.lat === coord.lat && item.lon === coord.lon)
      );
      setFavorites(newList);
      return newList;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAVORITE_KEY] });
    },
  });

  return {
    favorites: getFavorites.data || [],
    addFavorite,
    removeFavorite,
    isFavorite: (lat: number, lon: number) => {
      return favorites.some((item) => item.lat === lat && item.lon === lon);
    },
  };
}
