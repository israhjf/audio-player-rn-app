import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import PlaylistScreen from '../screens/PlayList/PlayList';
import PlayerScreen from '../screens/Player/Player';
import { useTheme } from '../theme/ThemeProvider';
import { useLocalization } from '../localization/LocalizationContext';

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
