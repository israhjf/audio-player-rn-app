import { Stack } from 'expo-router';
import SafeScreen from '@/components/SafeScreen';
import { Slot } from 'expo-router';

export default function PlayerLayout() {
  return (
    <SafeScreen>
        <Slot />
    </SafeScreen>
  );
}
