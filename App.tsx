import 'react-native-url-polyfill/auto';

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./src/hooks/useLoadedAssets";
import Index from "./src/navigation";
import * as React from 'react';
import { ThemeProvider } from './src/theme/ThemeProvider';
import { LocalizationProvider } from './src/localization/LocalizationContext';

export default function App() {
    const isLoadingComplete = useLoadedAssets();
  
    if (!isLoadingComplete) {
      return null;
    } else {
      return (
        <ThemeProvider>
          <LocalizationProvider>
            <SafeAreaProvider>
              <Index />
              <StatusBar />
            </SafeAreaProvider>
          </LocalizationProvider>
        </ThemeProvider>
      );
    }
  }
