import React, { useState, useEffect } from 'react';
import PageLoader from '../components/PageLoader/PageLoader';

export interface PageLoaderContextProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageLoaderContext = React.createContext<PageLoaderContextProps | null>(null);

interface PageLoaderProviderProps {
  children: React.ReactNode;
}

export const PageLoaderProvider: React.FC<PageLoaderProviderProps> = (props: PageLoaderProviderProps) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, [isLoading]);

  return (
    <PageLoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading ? (
        <PageLoader />
      ) : children}
    </PageLoaderContext.Provider>
  );
};
