import React from 'react';
import { Cloud, CloudSun, Sun } from 'lucide-react';

const iconMap = {
  cloud: Cloud,
  'cloud-sun': CloudSun,
  sun: Sun,
};

const iconColorMap = {
  cloud: '#60a5fa', // blue-400
  'cloud-sun': '#fbbf24', // yellow-400
  sun: '#fde68a', // yellow-200
};

export type ForecastItemProps = {
  time: string;
  temp: number;
  icon: keyof typeof iconMap;
};

const ForecastItem: React.FC<ForecastItemProps> = ({ time, temp, icon }) => {
  const IconComponent = iconMap[icon] || Cloud;
  const color = iconColorMap[icon] || '#60a5fa';

  return (
    <div className='flex flex-col items-center ml-2'>
      <p className='text-slate-400 mb-2'>{time}</p>
      <div className='my-2'>
        <IconComponent width={50} height={50} fill={color} stroke={color} />
      </div>
      <p className='text-xl font-semibold text-foreground'>{temp}°</p>
    </div>
  );
};

export default ForecastItem;
