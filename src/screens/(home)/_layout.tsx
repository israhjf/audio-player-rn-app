import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="home"
        options={{ 
          headerTitle: 'Playlist',
          headerShown: false
        }} 
      />
    </Stack>
  );
}
