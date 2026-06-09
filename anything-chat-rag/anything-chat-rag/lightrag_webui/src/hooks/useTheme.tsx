import { useContext } from 'react'
import { ThemeProviderContext } from '@/components/ThemeProvider'
// FIXME  MC8yOmFIVnBZMlhsaUpqbWxvYzZRbTlUWkE9PTplM2E0NDE4MA==

const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
// @ts-expect-error  MS8yOmFIVnBZMlhsaUpqbWxvYzZRbTlUWkE9PTplM2E0NDE4MA==

export default useTheme
