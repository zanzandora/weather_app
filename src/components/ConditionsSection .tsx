import React from 'react';
import ConditionChart from './ConditionsChart';
import WeatherCondionts from './WeatherConditions';
import { SunPosition } from './SunPosition';
import { Visibility } from './Visibility';

const ConditionsSection = () => {
  return (
    <div className='grid grid-cols-2 gap-6'>
      <ConditionChart />
      <div className='grid gap-4'>
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
