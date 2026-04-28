import type { ReactNode } from 'react';
import { PortfolioDataProvider } from './PortfolioDataProvider';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <PortfolioDataProvider>{children}</PortfolioDataProvider>
    </ThemeProvider>
  );
};
