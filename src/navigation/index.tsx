import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AudioPlayerProvider } from '@/src/context/AudioPlayerContext';
import PlaylistScreen from '@/src/screens/PlayList/PlayList';
import PlayerScreen from '@/src/screens/Player/Player';

const Stack = createNativeStackNavigator();

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
});

export default function Index({ colorScheme }: { colorScheme: string }) {
  return (
    <NativeBaseProvider theme={theme}>
      <AudioPlayerProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.primary[500] },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          >
            <Stack.Screen
              name="Playlist"
              component={PlaylistScreen}
              options={{ title: 'Playlist' }}
            />
            <Stack.Screen
              name="Player"
              component={PlayerScreen}
              options={{ title: 'Now Playing', presentation: 'modal' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AudioPlayerProvider>
    </NativeBaseProvider>
  );
}
