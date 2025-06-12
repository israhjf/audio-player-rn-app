import React from 'react';
import { Box, Button, Icon, IconButton, Slider, Text, VStack, HStack, useColorMode } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/src/context/AudioPlayerContext';
import { formatTime } from '@/src/utils/time';
import { Image } from 'react-native';
import { sampleTracks } from '../(home)/home';
import { AudioTrack } from '../../types';

export default function PlayerScreen() {
  const { state, play, pause, stop, seek, skipForward, skipBackward, setPlaybackRate } = useAudioPlayer();
  const { colorMode } = useColorMode();

  const handlePlayPause = async () => {
    if (state.isPlaying) {
      await pause();
    } else if (state.currentTrack) {
      await play(state.currentTrack);
    }
  };

  const handleSeek = async (value: number) => {
    await seek(value);
  };

  const handlePlaybackRateChange = async (rate: number) => {
    await setPlaybackRate(rate);
  };

  const handleSkipPrevious = async () => {
    if (!state.currentTrack) return;
    const currentIndex = sampleTracks.findIndex((track: AudioTrack) => track.id === state.currentTrack?.id);
    if (currentIndex > 0) {
      await play(sampleTracks[currentIndex - 1]);
    }
  };

  const handleSkipNext = async () => {
    if (!state.currentTrack) return;
    const currentIndex = sampleTracks.findIndex((track: AudioTrack) => track.id === state.currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < sampleTracks.length - 1) {
      await play(sampleTracks[currentIndex + 1]);
    }
  };

  return (
    <Box flex={1} bg={colorMode === 'dark' ? 'gray.900' : 'white'} safeArea>
      <VStack space={4} flex={1} p={4}>
        {/* Album Art */}
        <Box
          w="100%"
          h="60%"
          bg={colorMode === 'dark' ? 'gray.800' : 'gray.200'}
          rounded="xl"
          justifyContent="center"
          alignItems="center"
        >
          {state.currentTrack?.artwork ? (
            <Image
              source={{ uri: state.currentTrack.artwork }}
              alt="Album Art"
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            <Icon
              as={MaterialIcons}
              name="music-note"
              size={100}
              color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
            />
          )}
        </Box>

        {/* Track Info */}
        <VStack space={2} alignItems="center">
          <Text fontSize="xl" bold>
            {state.currentTrack?.title || 'No Track Selected'}
          </Text>
          <Text fontSize="md" color="gray.500">
            {state.currentTrack?.artist || 'Unknown Artist'}
          </Text>
        </VStack>

        {/* Progress Bar */}
        <VStack space={2}>
          <Slider
            value={Math.floor(state.progress)}
            defaultValue={0}
            maxValue={Math.floor(state.duration)}
            onChange={handleSeek}
            isDisabled={!state.currentTrack}
          >
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
          <HStack justifyContent="space-between">
            <Text>{formatTime(state.progress)}</Text>
            <Text>{formatTime(state.duration)}</Text>
          </HStack>
        </VStack>

        {/* Controls */}
        <VStack space={2} alignItems="center">
          {/* First row: skip backward 15s, stop, skip forward 15s */}
          <HStack space={4} justifyContent="center" alignItems="center">
            <IconButton
              icon={<Icon as={MaterialIcons} name="replay-15" size={8} />}
              onPress={skipBackward}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={<Icon as={MaterialIcons} name="stop" size={10} />}
              onPress={async () => {
                await seek(0);
                await pause();
              }}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={<Icon as={MaterialIcons} name="forward-15" size={8} />}
              onPress={skipForward}
              isDisabled={!state.currentTrack}
            />
          </HStack>
          {/* Second row: skip previous, play/pause, skip next */}
          <HStack space={4} justifyContent="center" alignItems="center">
            <IconButton
              icon={<Icon as={MaterialIcons} name="skip-previous" size={8} />}
              onPress={handleSkipPrevious}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name={state.isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                  size={16}
                />
              }
              onPress={handlePlayPause}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={<Icon as={MaterialIcons} name="skip-next" size={8} />}
              onPress={handleSkipNext}
              isDisabled={!state.currentTrack}
            />
          </HStack>
        </VStack>

        {/* Playback Speed */}
        <HStack space={2} justifyContent="center">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <Button
              key={rate}
              size="sm"
              variant={state.playbackRate === rate ? 'solid' : 'outline'}
              onPress={() => handlePlaybackRateChange(rate)}
              isDisabled={!state.currentTrack}
            >
              {rate}x
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
} 