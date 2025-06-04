import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { iconMap } from '@/lib/constants/weather-icons';
import FavoriteButton from './FavoriteButton';
import { useWeather } from '@/hooks/useWeather';

function getWeatherIcon(code?: number) {
  if (code !== undefined && iconMap[code]) {
    return iconMap[code];
  }
  return '/icons/sun.png';
}

const CurrentWeather = () => {
  const { data, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <Card className='bg-slate-800 shadow-none border-none mb-6 flex flex-row'>
      <div className='flex-1 flex flex-col justify-between'>
        <CardHeader>
          <CardTitle className='text-4xl font-semibold text-foreground'>
            {data?.name || 'N/A'}, {data?.sys?.country || ''}{' '}
          </CardTitle>
          <CardDescription className='text-gray-400 capitalize'>
            {data?.weather?.[0]?.description || ''}
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-row justify-start flex-1 gap-4 p-6'>
          <h1 className='text-7xl text-foreground font-bold my-auto'>
            {data?.main?.temp !== undefined ? Math.round(data.main.temp) : '--'}
            °
          </h1>
          <div className='grid grid-cols-1 grid-rows-2 items-center'>
            <Badge variant={'secondary'} className='text-base capitalize'>
              {data?.weather?.[0]?.main || 'N/A'}
            </Badge>
            <div className='flex gap-3'>
              <span className='flex gap-1 text-base text-blue-300 items-center'>
                <ArrowDown color='aqua' width={20} />{' '}
                {data?.main?.temp_min !== undefined
                  ? Math.round(data.main.temp_min)
                  : '--'}
                °
              </span>
              <span className='flex gap-1 text-base text-red-400 items-center'>
                <ArrowUp color='red' width={20} />{' '}
                {data?.main?.temp_max !== undefined
                  ? Math.round(data.main.temp_max)
                  : '--'}
                °
              </span>
            </div>
          </div>
        </CardContent>
      </div>
      <div className='px-6 flex items-start justify-center'>
        <Image
          src={`${getWeatherIcon(data?.daily?.weathercode[0]) || 'sun.png'}`}
          alt='Weather animation'
          width={220}
          height={200}
          className=''
          unoptimized
        />
        <FavoriteButton />
      </div>
    </Card>
  );
};

export default CurrentWeather;
