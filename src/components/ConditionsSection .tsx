import React from 'react';
import ConditionChart from './ConditionsChart';
import WeatherCondionts from './WeatherConditions';
import { SunPosition } from './SunPosition';
import { Visibility } from './Visibility';
import { useIsMobile } from '@/hooks/use-mobile';

const ConditionsSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
      <div className={` contents ${isMobile ? 'order-2 mb-24' : 'order-1 '}`}>
        <ConditionChart />
      </div>
      <div className={`grid gap-4 ${isMobile ? ' order-2 mb-24' : ''} `}>
        <WeatherCondionts />
        <div className='grid grid-cols-2 gap-4'>
          <SunPosition />
          <Visibility />
        </div>
      </div>
    </div>
  );
};

export default ConditionsSection;
