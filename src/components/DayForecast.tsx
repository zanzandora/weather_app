import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { WeatherResponse } from '@/types/apiType';
import { iconMap } from '@/lib/constants/weather-icons';
import Image from 'next/image';
import { useWeather } from '@/hooks/useWeather';
import { useIsMobile } from '@/hooks/use-mobile';

type Props = {
  days?: number;
  className?: string;
};

const formatDailyForecast = (data: WeatherResponse) => {
  const { time, temperature_2m_max, temperature_2m_min, weathercode } =
    data.daily;

  return time.map((date: string, index: number) => {
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short', // e.g. "Mon", "Tue"
    });

    return {
      date,
      dayOfWeek,
      maxTemp: temperature_2m_max[index],
      minTemp: temperature_2m_min[index],
      weatherCode: weathercode[index],
    };
  });
};

const DayForecast = ({ days, className }: Props) => {
  const { data, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  const forecast = data ? formatDailyForecast(data) : [];

  const displayForecast =
    typeof days === 'number' ? forecast.slice(0, days) : forecast;

  return (
    <Card
      className={`bg-card-foreground border-none flex flex-col ${className}`}
    >
      <CardHeader className='pb-0'>
        <CardTitle className='text-xl font-semibold text-foreground'>
          5-DAY FORECAST
        </CardTitle>
      </CardHeader>
      <CardContent>
        {displayForecast.map((day, index) => {
          const Icon = iconMap[day.weatherCode] || '/icons/sun.png';
          return (
            <div key={index} className='mb-6'>
              <div className='py-4 flex items-center justify-between'>
                <div className='w-20'>
                  <p className='text-slate-400 text-xl'>{day.dayOfWeek}</p>
                </div>
                <div className='flex items-center justify-center w-10'>
                  <Image
                    src={Icon}
                    alt='Weather icon'
                    className='w-6 h-6 object-contain'
                    width={50}
                    height={50}
                  />
                </div>

                <div className='text-right'>
                  <span className='font-semibold text-white'>
                    {day?.maxTemp ? Math.round(day?.maxTemp) : '--'}°
                  </span>
                  <span className='text-slate-400'>
                    /{day?.minTemp ? Math.round(day?.minTemp) : '--'}°
                  </span>
                </div>
              </div>
              {index < displayForecast.length - 1 && (
                <Separator className='bg-card-foreground' />
              )}
              <Separator
                orientation='horizontal'
                className='bg-slate-400 rounded-full'
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DayForecast;
