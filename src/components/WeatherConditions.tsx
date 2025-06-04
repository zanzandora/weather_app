import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Droplet, Sun, ThermometerSun, Wind } from 'lucide-react';
import { useWeather } from '@/hooks/useWeather';

const WeatherConditions = () => {
  const { data, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <Card className='bg-card-foreground border-none'>
      <CardHeader className='flex flex-row justify-between items-center pb-4'>
        <div>
          <CardTitle className='text-xl font-semibold text-foreground'>
            AIR CONDITIONS
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div className='flex items-center'>
            <div className='w-10 h-full flex items-start justify-end text-slate-400'>
              <ThermometerSun width={25} height={25} />
            </div>
            <div className='ml-3'>
              <p className='text-slate-400'>Real Feel</p>
              <p className='text-2xl font-semibold text-slate-200'>
                {data?.main.feels_like}°
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='w-10 h-full flex items-start justify-end text-slate-400'>
              <Wind width={25} height={25} />
            </div>
            <div className='ml-3'>
              <p className='text-slate-400'>Wind</p>
              <p className='text-2xl font-semibold text-slate-200'>
                {data?.wind.speed} km/h
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='w-10 h-full flex items-start justify-end text-slate-400'>
              <Droplet width={25} height={25} />
            </div>
            <div className='ml-3'>
              <p className='text-slate-400'>Chance of rain</p>
              <p className='text-2xl font-semibold text-slate-200'>
                {data?.rain?.['1h'] ? `${data.rain['1h']} mm/h` : '0 mm/h'}
              </p>
            </div>
          </div>

          <div className='flex items-center'>
            <div className='w-10 h-full flex items-start justify-end text-slate-400'>
              <Sun width={25} height={25} />
            </div>
            <div className='ml-3'>
              <p className='text-slate-400'>UV Index</p>
              <p className='text-2xl font-semibold text-slate-200'>
                {data?.daily?.uv_index_max || 0}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherConditions;
