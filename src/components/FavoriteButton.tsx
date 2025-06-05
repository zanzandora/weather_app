import { useFavoriteCities } from '@/hooks/useFavoriteCities';
import { Star } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useWeather } from '@/hooks/useWeather';

const FavoriteButton = () => {
  const { data, error } = useWeather();

  const { isFavorite, addFavorite, removeFavorite } = useFavoriteCities();
  const isCurrentFavorite = data
    ? isFavorite(data.coord.lat, data.coord.lon)
    : false;

  const handleToggleFavorite = () => {
    if (!data) return;
    if (isCurrentFavorite) {
      removeFavorite.mutate({ lat: data.coord.lat, lon: data.coord.lon });
      toast.error(`City ${data.name} has been removed`, {
        position: window.innerWidth < 640 ? 'top-center' : 'top-right',
      });
    } else {
      addFavorite.mutate({
        name: data.name,
        weathercode: [data.daily.weathercode[0]],
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`City ${data.name} has been added to favorites`, {
        position: window.innerWidth < 640 ? 'top-center' : 'top-right',
      });
    }
  };

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <Tooltip>
      <TooltipTrigger
        className={` cursor-pointer`}
        onClick={handleToggleFavorite}
      >
        <Star
          width={50}
          height={50}
          color={`${isCurrentFavorite ? 'black' : 'white'}`}
          fill={`${isCurrentFavorite ? 'yellow' : 'none'}`}
        />
      </TooltipTrigger>
      <TooltipContent>
        {isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </TooltipContent>
    </Tooltip>
  );
};

export default FavoriteButton;
