import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

// Define the theme type
type ThemeColors = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  background: string;
  onBackground: string;
  surface: string;
  onSurface: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  outlineVariant: string;
};

// Light theme colors
const lightTheme: ThemeColors = {
  primary: 'rgb(65 95 145)',
  onPrimary: 'rgb(255 255 255)',
  primaryContainer: 'rgb(214 227 255)',
  onPrimaryContainer: 'rgb(40 71 119)',
  secondary: 'rgb(86 95 113)',
  onSecondary: 'rgb(255 255 255)',
  secondaryContainer: 'rgb(218 226 249)',
  onSecondaryContainer: 'rgb(62 71 89)',
  background: 'rgb(249 249 255)',
  onBackground: 'rgb(25 28 32)',
  surface: 'rgb(249 249 255)',
  onSurface: 'rgb(25 28 32)',
  error: 'rgb(186 26 26)',
  onError: 'rgb(255 255 255)',
  errorContainer: 'rgb(255 218 214)',
  onErrorContainer: 'rgb(147 0 10)',
  outlineVariant: 'rgb(196 198 208)',
};

// Dark theme colors
const darkTheme: ThemeColors = {
  primary: 'rgb(170 199 255)',
  onPrimary: 'rgb(10 48 95)',
  primaryContainer: 'rgb(40 71 119)',
  onPrimaryContainer: 'rgb(214 227 255)',
  secondary: 'rgb(190 198 220)',
  onSecondary: 'rgb(40 49 65)',
  secondaryContainer: 'rgb(62 71 89)',
  onSecondaryContainer: 'rgb(218 226 249)',
  background: 'rgb(17 19 24)',
  onBackground: 'rgb(226 226 233)',
  surface: 'rgb(17 19 24)',
  onSurface: 'rgb(226 226 233)',
  error: 'rgb(255 180 171)',
  onError: 'rgb(105 0 5)',
  errorContainer: 'rgb(147 0 10)',
  onErrorContainer: 'rgb(255 218 214)',
  outlineVariant: 'rgb(68 71 78)',
};

// Create the theme context
const ThemeContext = createContext<ThemeColors>(lightTheme);

// Create the theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a hook to use the theme
export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
}; 