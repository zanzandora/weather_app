'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useFavoriteCities } from '@/hooks/useFavoriteCities';
import { useMultipleWeather } from '@/hooks/useWeather';
import { iconMap } from '@/lib/constants/weather-icons';
import { MapPin, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function getWeatherIcon(code?: number) {
  if (code !== undefined && iconMap[code]) {
    return iconMap[code];
  }
  return '/icons/sun.png';
}

const Favorites = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const router = useRouter();
  const { favorites, removeFavorite } = useFavoriteCities();

  const weatherList = useMultipleWeather(favorites);

  if (!mounted) return null;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-stretch'>
      {favorites.length === 0 ? (
        <div className='col-span-full text-center text-muted-foreground py-8'>
          No favorite cities yet.
        </div>
      ) : (
        favorites.map((city, index) => {
          const weather = weatherList[index];
          const temp = weather?.data?.main?.temp ?? '--';
          const iconSrc = city?.weathercode?.[0]
            ? getWeatherIcon(city.weathercode[0])
            : '/icons/sun.png';

          return (
            <Card
              key={city.id}
              className='bg-card-foreground border-none hover:bg-card-foreground/75 transition-colors  relative'
            >
              <CardHeader
                onClick={() =>
                  router.push(
                    `/city?name=${city.name}&lat=${city.lat}&lon=${city.lon}`
                  )
                }
                className='px-4 py-2 flex flex-row justify-between items-center'
              >
                <CardTitle className='flex items-center'>
                  <div className='mr-4'>
                    <Image
                      src={iconSrc}
                      alt={city?.name || 'weather'}
                      width={80}
                      height={50}
                    />
                  </div>
                  <div>
                    <div className='flex items-center gap-4'>
                      <h1 className='text-3xl font-semibold text-foreground'>
                        {city.name}
                      </h1>
                      <MapPin color='dodgerblue' width={30} height={30} />
                    </div>
                    <CardDescription className='text-base'>
                      {city.country}
                    </CardDescription>
                  </div>
                </CardTitle>
                <div className='flex items-center mr-8'>
                  <span className='text-5xl font-bold text-foreground'>
                    {temp}°
                  </span>
                </div>
              </CardHeader>
              <Button
                variant={'link'}
                className='absolute top-2 right-2  text-white hover:text-red-400 cursor-pointer'
                onClick={(e) => {
                  e.preventDefault();
                  removeFavorite.mutate({ lat: city.lat, lon: city.lon });
                }}
                title='Remove from favorites'
                size={'icon'}
              >
                <XIcon width={50} height={50} />
              </Button>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default Favorites;
