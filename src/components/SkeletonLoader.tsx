import { Skeleton } from './ui/skeleton';

const SkeletonLoader = () => {
  return (
    <>
      <div className='flex flex-col space-y-3 col-span-3'>
        <div className='h-64 space-y-4'>
          <Skeleton className='h-2/12 w-2/5 rounded-xl' />
          <Skeleton className='h-1/12 w-2/12 rounded-xl' />
          <Skeleton className='h-5/12 w-2/5 mt-12 rounded-xl' />
        </div>

        <div className='grid grid-cols-2 gap-6'>
          <Skeleton className='h-full w-full' />
          <div className='grid gap-4'>
            <Skeleton className='h-52 w-full' />

            <div className='grid grid-cols-2 gap-4'>
              <Skeleton className='h-52 w-full' />
              <Skeleton className='h-52 w-full' />
            </div>
          </div>
        </div>
      </div>
      <div className='grid col-span-1 sticky top-0 mr-4'>
        <Skeleton className='h-full rounded-xl' />
      </div>
    </>
  );
};

export default SkeletonLoader;
