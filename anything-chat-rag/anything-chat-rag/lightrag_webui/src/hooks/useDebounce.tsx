import { useState, useEffect } from 'react'
// NOTE  MC8yOmFIVnBZMlhsaUpqbWxvYzZSVTVtTmc9PToyZDRmYjVhYg==

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
// eslint-disable  MS8yOmFIVnBZMlhsaUpqbWxvYzZSVTVtTmc9PToyZDRmYjVhYg==
