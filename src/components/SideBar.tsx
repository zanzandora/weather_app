'use client';

import React from 'react';
import { Button } from './ui/button';
import { CloudSunRain, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SideBar = () => {
  const router = useRouter();
  return (
    <div className='w-3xs h-screen bg-card-foreground flex flex-col sticky top-0 items-center py-6 border-r border-slate-700 '>
      <div className=' flex-1 flex flex-col items-center justify-between'>
        <div className='mb-8'>
          <div className='w-12 h-12  rounded-lg flex items-center justify-center'>
            <Image src={'/logo.png'} alt={'logo'} width={80} height={50} />
          </div>
        </div>

        <div className='flex flex-col w-32 items-center space-y-8 flex-1'>
          <Button
            onClick={() => router.push('/')}
            className={`w-full bg-card-foreground hover:bg-sidebar-accent-foreground  flex flex-row items-center justify-start p-0 `}
          >
            <CloudSunRain />
            <span className='text-xl'>Weather</span>
          </Button>

          <Button
            onClick={() => router.push('/favorites')}
            className='w-full  bg-card-foreground hover:bg-sidebar-accent-foreground flex flex-row items-center justify-start p-0'
          >
            <Star />
            <span className='text-xl'>Favorites</span>
          </Button>
        </div>
      </div>

      <Button
        disabled
        variant='ghost'
        className='w-14 h-14 !rounded-button flex flex-col items-center justify-center p-0 mt-auto'
      >
        <i className='fas fa-cog text-lg mb-1'></i>
        <span className='text-xs'>Settings</span>
      </Button>
    </div>
  );
};

export default SideBar;
