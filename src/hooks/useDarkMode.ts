import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export function useDarkMode() {
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme !== (e.matches ? 'dark' : 'light')) {
        toggleTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, toggleTheme]);

  return { isDark: theme === 'dark', toggleTheme };
}