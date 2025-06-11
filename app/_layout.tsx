import { Stack } from 'expo-router';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AudioPlayerProvider } from '../context/AudioPlayerContext';
import { useEffect } from 'react';
import { Audio } from 'expo-av';

// Configure the theme
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
});

export default function Layout() {
  useEffect(() => {
    // Configure audio session
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };

    configureAudio();
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <AudioPlayerProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary[500],
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="player"
            options={{
              title: 'Now Playing',
            }}
          />
          <Stack.Screen
            name="playlist"
            options={{
              title: 'Playlist',
            }}
          />
        </Stack>
      </AudioPlayerProvider>
    </NativeBaseProvider>
  );
}
