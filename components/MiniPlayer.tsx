import React, { useEffect } from 'react';
import { Box, HStack, Text, IconButton, Icon, Slider } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useRouter } from 'expo-router';

const MiniPlayer = () => {
  const { state, play, pause, skipForward, seek } = useAudioPlayer();
  const router = useRouter();

  useEffect(() => {
    console.log('MiniPlayer.tsx: MiniPlayer mounted');
    return () => console.log('MiniPlayer.tsx MiniPlayer unmounted');
  }, []);

  if (!state.currentTrack) return null;

  // Ensure we have valid numbers and prevent division by zero
  const progress = Math.floor(state.progress || 0);
  const duration = Math.floor(state.duration || 1); // Use 1 as fallback to prevent division by zero

  return (
    <TouchableOpacity onPress={() => {
      console.log('MiniPlayer.tsx: MiniPlayer pressed, navigating to player screen');
      router.push('/(player)/player');
    }}>
      <Box bg="gray.900" px={3} py={2} borderTopWidth={1} borderColor="gray.700">
        <HStack alignItems="center" space={3}>
          <Image
            source={{ uri: state.currentTrack.artwork }}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
          <Box flex={1}>
            <Text color="white" bold numberOfLines={1}>{state.currentTrack.title}</Text>
            <Text color="gray.400" fontSize="xs" numberOfLines={1}>{state.currentTrack.artist}</Text>
            <Slider
              value={progress}
              defaultValue={0}
              maxValue={duration}
              onChange={seek}
              size="sm"
              mt={1}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name={state.isPlaying ? 'pause' : 'play-arrow'}
                color="white"
                size={6}
              />
            }
            onPress={() => {
              console.log('MiniPlayer.tsx: MiniPlayer play/pause pressed');
              if (state.isPlaying) {
                pause();
              } else {
                // If we have a current track, just resume playback
                if (state.currentTrack) {
                  play(state.currentTrack);
                }
              }
            }}
            variant="ghost"
          />
          <IconButton
            icon={<Icon as={MaterialIcons} name="skip-next" color="white" size={6} />}
            onPress={() => {
              console.log('MiniPlayer.tsx: MiniPlayer skip forward pressed');
              skipForward();
            }}
            variant="ghost"
          />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default MiniPlayer;