'use client';

import { useState } from 'react';
import { Clock, Loader2, Search, Star, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useDebounce } from 'use-debounce';
import { useLocationSearch } from '@/hooks/useWeather';
import { SearchItem } from '@/types/apiType';
import { CommandSeparator } from 'cmdk';
import { useRouter } from 'next/navigation';
import { useHistorySearch } from '@/hooks/useHistorySearch';
import { useFavoriteCities } from '@/hooks/useFavoriteCities';

const SearchInput = () => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const [debouncedQuery] = useDebounce(query, 500);

  const {
    data: locations = [],
    isLoading,
    isError,
  } = useLocationSearch(debouncedQuery);

  const { history, clearHistory, addHistory } = useHistorySearch();
  const { favorites } = useFavoriteCities();

  // Hàm xử lý khi chọn một thành phố từ kết quả search
  const handleSelected = (cityData: string) => {
    // cityData có dạng: `${index}|${loc.id}|${loc.location.name}|${loc.location.country}|${loc.location.state}|${loc.coord.lat}|${loc.coord.lon}`
    const [name, country, state, lat, lon] = cityData.split('|');

    router.push(`/city?name=${name}&lat=${lat}&lon=${lon}`);

    addHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
      state,
    });

    setOpen(false);
    setQuery('');
  };

  return (
    <div className='mb-6 flex items-center justify-between gap-8  min-w-xs my-4'>
      <Button
        className='relative pl-10 w-full pr-24 py-2 rounded-md border bg-card-foreground cursor-pointer text-sm text-muted-foreground sm:pr-12   flex-1'
        onClick={() => setOpen(true)}
        tabIndex={0}
        role='button'
        aria-label='Open search dialog'
      >
        <Search
          color='white'
          className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400'
        />
        Search...
      </Button>
      <Button
        className='cursor-pointer '
        onClick={() => window.location.reload()}
      >
        Reload
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder='Search cities..'
          value={query}
          onValueChange={setQuery}
          className='text-foreground'
          autoFocus
        />
        <CommandList>
          {!isLoading && isError && query.length > 1 && (
            <CommandEmpty>Error loading data</CommandEmpty>
          )}

          {!isLoading &&
            !isError &&
            locations.length === 0 &&
            query.length > 1 && <CommandEmpty>No cities found</CommandEmpty>}

          {isLoading && (
            <div className='flex items-center justify-center p-4'>
              <Loader2 className=' animate-spin h-4 w-4' />
            </div>
          )}

          {/* Favorite */}
          {favorites.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading='Favorites' className='mb-2'>
                {favorites.map((loc, index) => (
                  <CommandItem
                    key={`${loc.name}-${loc?.country}-${loc?.lat}-${loc?.lon}-${index}`}
                    value={`${loc.name || 'Unknown'}|${
                      loc.country || 'Unknown'
                    }|${loc?.state || 'Unknown'}|${loc?.lat || 0}|${
                      loc?.lon || 0
                    }`}
                    onSelect={handleSelected}
                  >
                    <Star />
                    <span>{loc.name}, </span>
                    {loc?.state && (
                      <span className='text-muted-foreground text-sm'>
                        {loc?.state || ''},{' '}
                      </span>
                    )}
                    <span className='text-muted-foreground text-sm'>
                      {loc?.country || ''}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          {/* History  */}
          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup className='mb-2'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-muted-foreground px-2'>
                    Recent Searched
                  </p>
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={() => clearHistory.mutate()}
                    className='my-1'
                  >
                    <XCircle className='h-4 w-4' /> Clear
                  </Button>
                </div>
                {history.map((loc, index) => (
                  <CommandItem
                    key={`${loc.name}-${loc?.country}-${loc?.lat}-${loc?.lon}-${index}`}
                    value={`${loc.name || 'Unknown'}|${
                      loc.country || 'Unknown'
                    }|${loc?.state || 'Unknown'}|${loc?.lat || 0}|${
                      loc?.lon || 0
                    }`}
                    onSelect={handleSelected}
                  >
                    <Clock />
                    <span>{loc.name}, </span>
                    {loc?.state && (
                      <span className='text-muted-foreground text-sm'>
                        {loc?.state || ''},{' '}
                      </span>
                    )}
                    <span className='text-muted-foreground text-sm'>
                      {loc?.country || ''}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />

          {/* Display Search */}
          {!isLoading && !isError && locations.length > 0 && (
            <CommandGroup heading='Suggestions' className='mb-2'>
              {locations.map((loc: SearchItem, index) => (
                <CommandItem
                  key={`${loc.name}-${loc?.country}-${loc?.lat}-${loc?.lon}-${index}`}
                  value={`${loc.name || 'Unknown'}|${
                    loc.country || 'Unknown'
                  }|${loc?.state || 'Unknown'}|${loc?.lat || 0}|${
                    loc?.lon || 0
                  }`}
                  onSelect={handleSelected}
                >
                  <Search />
                  <span>{loc.name}, </span>
                  {loc?.state && (
                    <span className='text-muted-foreground text-sm'>
                      {loc?.state || ''},{' '}
                    </span>
                  )}
                  <span className='text-muted-foreground text-sm'>
                    {loc?.country || ''}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchInput;
