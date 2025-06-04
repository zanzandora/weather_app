'use client';

import CurrentWeather from '@/components/CurrentWeather';
import DayForecast from '@/components/DayForecast';
import ConditionsSection from '@/components/ConditionsSection ';
import { useWeather } from '@/hooks/useWeather';
import { useSearchParams } from 'next/navigation';

export default function City() {
  const searchParams = useSearchParams();

  const name = searchParams.get('name') ?? undefined;
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const lat = latStr !== null ? Number(latStr) : undefined;
  const lon = lonStr !== null ? Number(lonStr) : undefined;

  const { data, isLoading, error } = useWeather(name, lat, lon);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to fetch data : {error?.message}</p>;
  console.log(data);
  return (
    <main className='grid lg:grid-cols-4 mb-4 gap-4 flex-1'>
      {/* Left column */}
      <div className='col-span-3'>
        <CurrentWeather />
        <ConditionsSection />
      </div>
      {/* Right column */}
      <div className='grid col-span-1 sticky top-0 mr-4'>
        <DayForecast />
      </div>
    </main>
  );
}
