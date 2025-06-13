import React, { createContext, useContext, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import { en } from './translations/en';
import { es } from './translations/es';
import * as Localization from 'expo-localization';

type Translations = typeof en;

interface LocalizationContextType {
  t: (key: string) => string;
  locale: string;
}

const translations: Record<string, Translations> = {
  en,
  es,
};

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const getDeviceLanguage = () => {
      try {
        const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'en';
        console.log('Device language:', deviceLanguage);
        return translations[deviceLanguage] ? deviceLanguage : 'en';
      } catch (error) {
        console.error('Error getting device language:', error);
        return 'en';
      }
    };

    setLocale(getDeviceLanguage());
  }, []);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return value || key;
  };

  return (
    <LocalizationContext.Provider value={{ t, locale }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
} 