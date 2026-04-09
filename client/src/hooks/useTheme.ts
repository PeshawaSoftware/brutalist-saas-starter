import { useTheme as useThemeContext } from '@/contexts/ThemeContext';
import type { UseThemeReturn } from '@/types';

export const useTheme = (): UseThemeReturn => {
  const { theme, toggleTheme, switchable } = useThemeContext();

  return {
    isDarkMode: theme === 'dark',
    toggleTheme: toggleTheme || (() => {}),
    theme,
  };
};
