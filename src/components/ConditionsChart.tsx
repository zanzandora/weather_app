'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AirPolluton } from '@/types/apiType';
import { useAirPollution, useWeather } from '@/hooks/useWeather';
import { Loader2 } from 'lucide-react';

// Khoảng thời gian options
const TIME_RANGE_OPTIONS = [
  { value: 90, label: 'Last 3 months' },
  { value: 30, label: 'Last 30 days' },
  { value: 7, label: 'Last 7 days' },
];

// Hàm chuyển đổi dữ liệu API thành dạng biểu đồ
const transformAirData = (data: AirPolluton[]) => {
  if (!data) return [];

  // Tạo map để gộp dữ liệu theo ngày
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyData: Record<string, any> = {};

  data.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];

    if (!dailyData[date]) {
      dailyData[date] = {
        date,
        pm2_5: 0,
        pm10: 0,
        no2: 0,
        o3: 0,
        count: 0,
        aqi: 0,
      };
    }

    // Tính tổng để sau tính trung bình
    dailyData[date].pm2_5 += item.components.pm2_5;
    dailyData[date].pm10 += item.components.pm10;
    dailyData[date].no2 += item.components.no2;
    dailyData[date].o3 += item.components.o3;
    dailyData[date].aqi += item.main.aqi;
    dailyData[date].count += 1;
  });

  // Tính giá trị trung bình và làm tròn
  return Object.values(dailyData).map((day) => ({
    date: day.date,
    pm2_5: Math.round(day.pm2_5 / day.count),
    pm10: Math.round(day.pm10 / day.count),
    no2: Math.round(day.no2 / day.count),
    o3: Math.round(day.o3 / day.count),
    aqi: Math.round(day.aqi / day.count),
  }));
};

// Hàm xác định chất lượng không khí dựa trên AQI
const getAirQuality = (aqi: number) => {
  switch (aqi) {
    case 1:
      return { label: 'Good', color: 'text-green-500' };
    case 2:
      return { label: 'Rather', color: 'text-yellow-500' };
    case 3:
      return { label: 'Medium', color: 'text-orange-500' };
    case 4:
      return { label: 'Bad', color: 'text-red-500' };
    case 5:
      return { label: 'Very Bad', color: 'text-purple-500' };
    default:
      return { label: 'Not Determined', color: 'text-gray-500' };
  }
};

const chartConfig = {
  pm2_5: {
    label: 'PM2.5',
    color: 'var(--chart-1)',
  },
  pm10: {
    label: 'PM10',
    color: 'var(--chart-2)',
  },
  no2: {
    label: 'NO₂',
    color: 'var(--chart-3)',
  },
  o3: {
    label: 'O₃',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;

export default function ConditionChart() {
  const { data: currentWeather, error } = useWeather();

  const [timeRange, setTimeRange] = useState<number>(90); // Mặc định 90 ngày
  const [timestamps, setTimestamps] = useState({ start: 0, end: 0 });

  // Tính toán timestamp khi timeRange thay đổi
  useEffect(() => {
    const end = Math.floor(Date.now() / 1000);
    const start = end - timeRange * 24 * 60 * 60;
    setTimestamps({ start, end });
  }, [timeRange]);

  // Lấy dữ liệu ô nhiễm
  const {
    data: airData,
    isLoading,
    isError,
  } = useAirPollution(
    currentWeather!.coord.lat,
    currentWeather!.coord.lon,
    timestamps.start,
    timestamps.end
  );

  // Chuyển đổi dữ liệu
  const chartData = transformAirData(airData || []);

  // Tính AQI trung bình
  const avgAqi =
    chartData.length > 0
      ? Math.round(
          chartData.reduce((sum, day) => sum + day.aqi, 0) / chartData.length
        )
      : 0;

  const airQuality = getAirQuality(avgAqi);

  if (error) return <p>Failed to fetch data : {error?.message}</p>;

  return (
    <Card className='bg-card-foreground border-none'>
      <CardHeader className='flex flex-row justify-between items-center pb-4'>
        <div>
          <CardTitle className='text-xl font-semibold text-foreground'>
            AIR POLLUTION
          </CardTitle>
          <CardDescription>
            <span>Average AQI: </span>
            <span className={`font-semibold ${airQuality.color}`}>
              {airQuality.label}
            </span>
          </CardDescription>
        </div>

        {/* Dropdown chọn khoảng thời gian */}
        <div className='flex items-center space-x-2'>
          <Select
            value={timeRange.toString()}
            onValueChange={(value) => setTimeRange(Number(value))}
          >
            <SelectTrigger className='w-[150px] bg-slate-900 text-foreground border-slate-400'>
              <SelectValue placeholder='Chọn khoảng thời gian' />
            </SelectTrigger>
            <SelectContent className='bg-slate-800 text-foreground'>
              {TIME_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        {isLoading ? (
          <div className='h-[250px] flex items-center justify-center'>
            <Loader2 className='animate-spin h-8 w-8 text-blue-500' />
          </div>
        ) : isError ? (
          <div className='h-[250px] flex items-center justify-center text-red-500'>
            <p>Lỗi khi tải dữ liệu ô nhiễm</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className='h-[250px] flex items-center justify-center'>
            <p>Không có dữ liệu ô nhiễm cho khoảng thời gian này</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[250px] w-full'
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='fillPm25' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillPm10' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillNo2' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-3)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillO3' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--chart-4)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--chart-4)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('vi-VN', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                    indicator='dot'
                  />
                }
              />
              <Area
                dataKey='pm2_5'
                type='natural'
                fill='url(#fillPm25)'
                stroke='var(--chart-1)'
                stackId='a'
              />
              <Area
                dataKey='pm10'
                type='natural'
                fill='url(#fillPm10)'
                stroke='var(--chart-2)'
                stackId='a'
              />
              <Area
                dataKey='no2'
                type='natural'
                fill='url(#fillNo2)'
                stroke='var(--chart-3)'
                stackId='a'
              />
              <Area
                dataKey='o3'
                type='natural'
                fill='url(#fillO3)'
                stroke='var(--chart-4)'
                stackId='a'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
