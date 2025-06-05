import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import SideBar from '@/components/SideBar';
import SearchInput from '@/components/SearchInput';
import Providers from './providers';
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weather App',
  description: 'Awesome weather app',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className='flex min-h-screen font-[family-name:var(--font-geist-sans)] gap-4'>
            <SideBar />
            {/* MAIN CONTENT */}
            <div className='flex-1 flex flex-col  mx-4 sm:mx-8 '>
              {/* Search bar always on top */}
              <div className='sticky top-0 z-20 bg-slate-800/80 backdrop-blur-md '>
                <SearchInput />
              </div>
              {children}
            </div>
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
