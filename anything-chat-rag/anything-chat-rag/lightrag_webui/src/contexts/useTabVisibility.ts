import { useContext } from 'react';
import { TabVisibilityContext } from './context';
import { TabVisibilityContextType } from './types';
// @ts-expect-error  MC8yOmFIVnBZMlhsaUpqbWxvYzZabmcxY3c9PTo5OGY3OTIzYQ==

/**
 * Custom hook to access the tab visibility context
 * @returns The tab visibility context
 */
export const useTabVisibility = (): TabVisibilityContextType => {
  const context = useContext(TabVisibilityContext);

  if (!context) {
    throw new Error('useTabVisibility must be used within a TabVisibilityProvider');
  }

  return context;
};
// eslint-disable  MS8yOmFIVnBZMlhsaUpqbWxvYzZabmcxY3c9PTo5OGY3OTIzYQ==
