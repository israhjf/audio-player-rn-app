import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AudioPlayerProvider } from '@/src/context/AudioPlayerContext';
import PlaylistScreen from '@/src/screens/PlayList/PlayList';
import PlayerScreen from '@/src/screens/Player/Player';
import { useTheme } from '@/src/theme/ThemeProvider';
import { useLocalization } from '@/src/localization/LocalizationContext';

const Stack = createNativeStackNavigator();

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
});

export default function Index() {
  const { onPrimaryContainer, primaryContainer } = useTheme();
  const { t } = useLocalization();

  return (
    <NativeBaseProvider theme={theme}>
      <AudioPlayerProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: primaryContainer },
              headerTintColor: onPrimaryContainer,
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="Playlist"
              component={PlaylistScreen}
              options={{ title: t('screens.playlist.title') }}
            />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ title: t('screens.player.title'), presentation: 'modal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AudioPlayerProvider>
    </NativeBaseProvider>
  );
}
