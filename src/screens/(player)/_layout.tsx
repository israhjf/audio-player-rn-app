import { Stack } from 'expo-router';
import SafeScreen from '@/src/components/SafeScreen';
import { Slot } from 'expo-router';

export default function PlayerLayout() {
  return (
    <Stack>
        <Slot />
    </Stack>
  );
}
