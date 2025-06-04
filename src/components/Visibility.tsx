'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';

export function Visibility() {
  const { data, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <Card className='bg-card-foreground border-none '>
      <CardHeader>
        <CardTitle className='text-foreground'>Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between w-full'>
          <div className='flex flex-col items-center'>
            <span className='font-semibold text-4xl text-foreground'>
              {typeof data?.visibility === 'number'
                ? data.visibility / 1000
                : '--'}{' '}
              KM
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='text-muted-foreground'>
        Hoàn toàn rõ lúc này
      </CardFooter>
    </Card>
  );
}
