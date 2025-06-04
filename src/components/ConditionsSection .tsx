import React from 'react';
import ConditionChart from './ConditionsChart';
import WeatherCondionts from './WeatherConditions';
import { SunPosition } from './SunPosition';
import { Visibility } from './Visibility';
import { WeatherResponse } from '@/types/apiType';

type Props = {
  data: WeatherResponse;
};
const ConditionsSection = ({ data }: Props) => {
  return (
    <div className='grid grid-cols-2 gap-6'>
      <ConditionChart data={data} />
      <div className='grid gap-4'>
        <WeatherCondionts data={data} />
        <div className='grid grid-cols-2 gap-4'>
          <SunPosition data={data} />
          <Visibility data={data} />
        </div>
      </div>
    </div>
  );
};

export default ConditionsSection;
