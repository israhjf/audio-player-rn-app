import React, { useEffect } from 'react';
import { Box, HStack, Text, IconButton, Icon, Slider } from 'native-base';
import { TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sampleTracks } from '../data/sampleTracks';
import { AudioTrack } from '../types';
import { useTheme } from '../theme/ThemeProvider';

type RootStackParamList = {
  Playlist: undefined;
  Player: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MiniPlayer = () => {
  const { state, play, pause, seek } = useAudioPlayer();
  const navigation = useNavigation<NavigationProp>();
  const { surface, onSurface, primary, onPrimary, secondaryContainer } = useTheme();

  useEffect(() => {
    console.log('MiniPlayer.tsx: MiniPlayer mounted');
    return () => console.log('MiniPlayer.tsx MiniPlayer unmounted');
  }, []);

  if (!state.currentTrack) return null;

  // Ensure we have valid numbers and prevent division by zero
  const progress = Math.floor(state.progress || 0);
  const duration = Math.floor(state.duration || 1); // Use 1 as fallback to prevent division by zero

  const handleNextTrack = () => {
    console.log('MiniPlayer.tsx: MiniPlayer skip forward pressed');
    const currentIndex = sampleTracks.findIndex((track: AudioTrack) => track.id === state.currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < sampleTracks.length - 1) {
      const nextTrack = sampleTracks[currentIndex + 1];
      play(nextTrack);
    }
  };

  return (
    <TouchableOpacity onPress={() => {
      console.log('MiniPlayer.tsx: MiniPlayer pressed, navigating to player screen');
      navigation.navigate('Player');
    }}>
      <Box bg={secondaryContainer} px={3} py={2} borderTopWidth={1} borderColor={primary}>
        <HStack alignItems="center" space={3}>
          <Image
            source={{ uri: state.currentTrack.artwork }}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
          <Box flex={1}>
            <Text color={onSurface} bold numberOfLines={1}>{state.currentTrack.title}</Text>
            <Text color={onSurface} opacity={0.7} fontSize="xs" numberOfLines={1}>{state.currentTrack.artist}</Text>
            <Slider
              value={progress}
              defaultValue={0}
              maxValue={duration}
              onChange={seek}
              size="sm"
              mt={1}
            >
              <Slider.Track bg={onPrimary}>
                <Slider.FilledTrack bg={primary} />
              </Slider.Track>
              <Slider.Thumb bg={primary} />
            </Slider>
          </Box>
          <IconButton
            icon={
              <Icon
                as={MaterialIcons}
                name={state.isPlaying ? 'pause' : 'play-arrow'}
                color={onSurface}
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
            icon={<Icon as={MaterialIcons} name="skip-next" color={onSurface} size={6} />}
            onPress={handleNextTrack}
            variant="ghost"
          />
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default MiniPlayer;