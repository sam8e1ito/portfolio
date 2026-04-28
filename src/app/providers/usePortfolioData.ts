import { useContext } from 'react';
import { PortfolioDataContext } from './portfolio-data-context';

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);

  if (!context) {
    throw new Error('usePortfolioData must be used inside PortfolioDataProvider');
  }

  return context;
};
