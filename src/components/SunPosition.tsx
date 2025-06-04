'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherResponse } from '@/types/apiType';
import { Sunrise, Sunset } from 'lucide-react';

type Props = {
  data: WeatherResponse;
};

// Helper to convert unix timestamp (seconds) to local time string (AM/PM)
function formatTime(unix: number) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(unix * 1000));
}

export function SunPosition({ data }: Props) {
  const sunrise = data?.sys?.sunrise;
  const sunset = data?.sys?.sunset;

  const sunriseStr = sunrise !== undefined ? formatTime(sunrise) : '--';
  const sunsetStr = sunset !== undefined ? formatTime(sunset) : '--';

  return (
    <Card className='bg-card-foreground border-none '>
      <CardHeader>
        <CardTitle className='text-foreground mr-1 flex justify-between'>
          <span>Sunrise</span>
          <span>Sunset</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between w-full'>
          <div className='flex flex-col items-center'>
            <Sunrise color='white' width={50} height={50} />
            <span className='font-semibold text-base text-foreground'>
              {sunriseStr}
            </span>
          </div>
          <div className='flex flex-col items-center'>
            <Sunset color='white' width={50} height={50} />
            <span className='font-semibold text-base text-foreground'>
              {sunsetStr}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
