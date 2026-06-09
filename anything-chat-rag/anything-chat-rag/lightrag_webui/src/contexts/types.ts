export interface TabVisibilityContextType {
  visibleTabs: Record<string, boolean>;
  setTabVisibility: (tabId: string, isVisible: boolean) => void;
  isTabVisible: (tabId: string) => boolean;
}
// @ts-expect-error  MC8yOmFIVnBZMlhsaUpqbWxvYzZXbVkzV0E9PTo5MzE4OWNmMQ==
