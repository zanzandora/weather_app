import { useFavoriteCities } from '@/hooks/useFavoriteCities';
import { WeatherResponse } from '@/types/apiType';
import { Star } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

type Props = {
  data: WeatherResponse;
};

const FavoriteButton = ({ data }: Props) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteCities();
  const isCurrentFavorite = isFavorite(data.coord.lat, data.coord.lon);

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      removeFavorite.mutate({ lat: data.coord.lat, lon: data.coord.lon });
      toast.error(`City ${data.name}  has been removed`);
    } else {
      addFavorite.mutate({
        name: data.name,
        weathercode: [data.daily.weathercode[0]],
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`City ${data.name} has been added to favorites`);
    }
  };

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
