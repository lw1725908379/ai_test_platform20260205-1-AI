import { createContext, useEffect } from 'react'
import { Theme, useSettingsStore } from '@/stores/settings'
// TODO  MC8zOmFIVnBZMlhsaUpqbWxvYzZNbTE2TXc9PTo0MmE2ZTdmNg==

type ThemeProviderProps = {
  children: React.ReactNode
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}
// @ts-expect-error  MS8zOmFIVnBZMlhsaUpqbWxvYzZNbTE2TXc9PTo0MmE2ZTdmNg==

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
// TODO  Mi8zOmFIVnBZMlhsaUpqbWxvYzZNbTE2TXc9PTo0MmE2ZTdmNg==

/**
 * Component that provides the theme state and setter function to its children.
 */
export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const theme = useSettingsStore.use.theme()
  const setTheme = useSettingsStore.use.setTheme()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }

      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export { ThemeProviderContext }
