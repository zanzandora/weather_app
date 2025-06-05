'use client';

import CurrentWeather from '@/components/CurrentWeather';
import DayForecast from '@/components/DayForecast';
import ConditionsSection from '@/components/ConditionsSection ';
import { useWeather } from '@/hooks/useWeather';
import SkeletonLoader from '@/components/SkeletonLoader';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Home() {
  const isMobile = useIsMobile();

  const { isLoading, error } = useWeather();

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <main className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-4 flex-1'>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          {/* Mobile view: CurrentWeather -> DayForecast -> ConditionsSection */}
          {isMobile ? (
            <div className='col-span-1 flex flex-col gap-4'>
              <CurrentWeather />
              <DayForecast />
              <ConditionsSection />
            </div>
          ) : (
            // Desktop view: CurrentWeather + ConditionsSection (left), DayForecast (right)
            <>
              <div className='col-span-3'>
                <CurrentWeather />
                <ConditionsSection />
              </div>
              <div
                className={`grid lg:col-span-1 sticky top-0 md:col-span-3  `}
              >
                <DayForecast />
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
