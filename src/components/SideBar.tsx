'use client';

import React from 'react';
import { Button } from './ui/button';
import { CloudSunRain, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from './ui/card';

const SideBar = () => {
  const isMobile = useIsMobile();
  const router = useRouter();

  return (
    <Card
      className={`bg-card-foreground border-slate-700 ${
        isMobile
          ? 'fixed bottom-0 bg-card-foreground/100 z-50  min-w-full h-20 flex flex-row items-center justify-around rounded-t-2xl rounded-b-none border-t-1 border-x-white border-t-white'
          : 'sticky top-0 md:w-[180px] lg:w-3xs h-screen flex flex-col items-center py-6 rounded-r-2xl rounded-l-none border-r-red-900 '
      }`}
    >
      {!isMobile && (
        <div className='mb-8'>
          <div className='w-12 h-12 rounded-lg flex items-center justify-center'>
            <Image src={'/logo.png'} alt={'logo'} width={80} height={50} />
          </div>
        </div>
      )}

      <div
        className={`${
          isMobile
            ? 'flex flex-row justify-around w-full'
            : 'flex flex-col w-32 items-center space-y-8 flex-1'
        }`}
      >
        <Button
          onClick={() => router.push('/')}
          className={`${
            isMobile ? 'flex-1 justify-center' : 'w-full justify-start'
          } bg-card-foreground hover:bg-sidebar-accent-foreground flex items-center p-0 gap-2`}
        >
          <CloudSunRain />
          {!isMobile && <span className='text-xl'>Weather</span>}
        </Button>

        <Button
          onClick={() => router.push('/favorites')}
          className={`${
            isMobile ? 'flex-1 justify-center' : 'w-full justify-start'
          } bg-card-foreground hover:bg-sidebar-accent-foreground flex items-center p-0 gap-2`}
        >
          <Star />
          {!isMobile && <span className='text-xl'>Favorites</span>}
        </Button>
      </div>

      {!isMobile && (
        <Button
          disabled
          variant='ghost'
          className='w-14 h-14 !rounded-button flex flex-col items-center justify-center p-0 mt-auto'
        >
          <i className='fas fa-cog text-lg mb-1'></i>
          <span className='text-xs'>Settings</span>
        </Button>
      )}
    </Card>
  );
};

export default SideBar;
