'use client';

import CurrentWeather from '@/components/CurrentWeather';
import DayForecast from '@/components/DayForecast';
import ConditionsSection from '@/components/ConditionsSection ';
import { useWeather } from '@/hooks/useWeather';
import SkeletonLoader from '@/components/SkeletonLoader';

export default function Home() {
  const { isLoading, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <main className='grid lg:grid-cols-4 mb-4 gap-4 flex-1'>
      {/* Left column */}
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          <div className='col-span-3'>
            <CurrentWeather />
            <ConditionsSection />
          </div>

          <div className='grid col-span-1 sticky top-0 mr-4'>
            <DayForecast />
          </div>
        </>
      )}
    </main>
  );
}
