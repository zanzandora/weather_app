'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { WeatherResponse } from '@/types/apiType';

type Props = {
  data: WeatherResponse;
};

export function Visibility({ data }: Props) {
  return (
    <Card className='bg-card-foreground border-none '>
      <CardHeader>
        <CardTitle className='text-foreground'>Visibility</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='flex justify-between w-full'>
          <div className='flex flex-col items-center'>
            <span className='font-semibold text-4xl text-foreground'>
              {data?.visibility / 1000 || '--'} KM
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
