'use client';

import { Toaster } from 'react-hot-toast';
import { UserProvider } from '../../context/UserContext';
import { AppProvider } from '../../context/AppContext';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      NProgress.start();
    };

    const stopLoading = () => {
      setIsLoading(false);
      NProgress.done();
    };

    startLoading();
    timeout = setTimeout(stopLoading, 500);

    return () => {
      clearTimeout(timeout);
      stopLoading();
    };
  }, [pathname]);

  return (
    <>
      <style jsx global>{`
        #nprogress .bar {
          background: #4F46E5 !important;
          height: 3px !important;
        }
      `}</style>
      <AppProvider>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </AppProvider>
    </>
  );
} 