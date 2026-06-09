import { createContext } from 'react';
import { TabVisibilityContextType } from './types';
// NOTE  MC8yOmFIVnBZMlhsaUpqbWxvYzZUbEV6Tnc9PTpjNjZmYTg1Mg==

// Default context value
const defaultContext: TabVisibilityContextType = {
  visibleTabs: {},
  setTabVisibility: () => {},
  isTabVisible: () => false,
};

// Create the context
export const TabVisibilityContext = createContext<TabVisibilityContextType>(defaultContext);
// @ts-expect-error  MS8yOmFIVnBZMlhsaUpqbWxvYzZUbEV6Tnc9PTpjNjZmYTg1Mg==
