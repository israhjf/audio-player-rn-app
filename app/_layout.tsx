import { Stack } from 'expo-router';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import { useEffect } from 'react';
import { Audio } from 'expo-av';
import SafeScreen from '@/components/SafeScreen';

// Configure the theme
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
});

export default function Layout() {
  useEffect(() => {
    console.log('_layout.tsx: Layout mounted');
    // Configure audio session
    const configureAudio = async () => {
      try {
        console.log('_layout.tsx: Configuring audio session');
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });
        console.log('_layout.tsx: Audio session configured successfully');
      } catch (error) {
        console.error('_layout.tsx: Error configuring audio:', error);
      }
    };

    configureAudio();

    return () => {
      console.log('_layout.tsx: Layout unmounting');
    };
  }, []);

  return (
    <NativeBaseProvider theme={theme}>
      <AudioPlayerProvider>
        <SafeScreen>
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
              name="(home)"
              options={{
                title: 'Playlist',
              }}
            />
            <Stack.Screen
              name="(player)"
              options={{
                title: 'Now Playing',
                presentation: 'modal',
              }}
            />
          </Stack>
        </SafeScreen>
      </AudioPlayerProvider>
    </NativeBaseProvider>
  );
}
