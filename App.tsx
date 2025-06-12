import 'react-native-url-polyfill/auto';

import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./src/hooks/useLoadedAssets";
import Index from "./src/navigation";
import { useColorScheme } from "react-native";
import * as React from 'react';

export default function App() {
    const isLoadingComplete = useLoadedAssets();
    const colorScheme = useColorScheme() ?? 'light';
  
    if (!isLoadingComplete) {
      return null;
    } else {
      return (
        <SafeAreaProvider>
          <Index colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      );
    }
  }
