import React from 'react';
import { Box, Button, Icon, IconButton, Slider, Text, VStack, HStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/src/context/AudioPlayerContext';
import { formatTime } from '@/src/utils/time';
import { Image } from 'react-native';
import { sampleTracks } from '@/src/data/sampleTracks';
import { AudioTrack } from '../../types';
import { useTheme } from '@/src/theme/ThemeProvider';

export default function PlayerScreen() {
  const { state, play, pause, stop, seek, skipForward, skipBackward, setPlaybackRate } = useAudioPlayer();
  const { background, surface, onSurface, primary, onPrimary } = useTheme();

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
    <Box flex={1} bg={background} safeArea>
      <VStack flex={1} space={2} p={2}>
        {/* Album Art */}
        <Box
          flex={4}
          w="100%"
          bg={surface}
          rounded="xl"
          justifyContent="center"
          alignItems="center"
        >
          {state.currentTrack?.artwork ? (
            <Image
              source={{ uri: state.currentTrack.artwork }}
              alt="Album Art"
              style={{ width: '100%', height: '100%', borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <Icon
              as={MaterialIcons}
              name="music-note"
              size={100}
              color={onSurface}
            />
          )}
        </Box>

        {/* Track Info */}
        <VStack flex={1} space={1} alignItems="center" justifyContent="center">
          <Text fontSize="xl" bold numberOfLines={1} ellipsizeMode="tail" color={onSurface}>
            {state.currentTrack?.title || 'No Track Selected'}
          </Text>
          <Text fontSize="md" color={onSurface} opacity={0.7} numberOfLines={1} ellipsizeMode="tail">
            {state.currentTrack?.artist || 'Unknown Artist'}
          </Text>
        </VStack>

        {/* Progress Bar */}
        <VStack flex={1} space={1} justifyContent="center">
          <Slider
            value={Math.floor(state.progress)}
            defaultValue={0}
            maxValue={Math.floor(state.duration)}
            onChange={handleSeek}
            isDisabled={!state.currentTrack}
          >
            <Slider.Track>
              <Slider.FilledTrack bg={primary} />
            </Slider.Track>
            <Slider.Thumb bg={primary} />
          </Slider>
          <HStack justifyContent="space-between">
            <Text color={onSurface}>{formatTime(state.progress)}</Text>
            <Text color={onSurface}>{formatTime(state.duration)}</Text>
          </HStack>
        </VStack>

        {/* Controls */}
        <VStack flex={2} space={2} alignItems="center" justifyContent="center">
          {/* First row: skip backward 15s, stop, skip forward 15s */}
          <HStack space={4} justifyContent="center" alignItems="center">
            <HStack alignItems="center">
              <Text fontSize="xs" color={onSurface}>15</Text>
              <IconButton
                icon={<Icon as={MaterialIcons} name="fast-rewind" size={8} color={onSurface} />}
                onPress={skipBackward}
                isDisabled={!state.currentTrack}
              />
            </HStack>
            <IconButton
              icon={<Icon as={MaterialIcons} name="stop" size={10} color={onSurface} />}
              onPress={async () => {
                await seek(0);
                await pause();
              }}
              isDisabled={!state.currentTrack}
            />
            <HStack alignItems="center">
              <IconButton
                icon={<Icon as={MaterialIcons} name="fast-forward" size={8} color={onSurface} />}
                onPress={skipForward}
                isDisabled={!state.currentTrack}
              />
              <Text fontSize="xs" color={onSurface}>15</Text>
            </HStack>
          </HStack>
          {/* Second row: skip previous, play/pause, skip next */}
          <HStack space={4} justifyContent="center" alignItems="center">
            <IconButton
              icon={<Icon as={MaterialIcons} name="skip-previous" size={8} color={onSurface} />}
              onPress={handleSkipPrevious}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name={state.isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                  size={16}
                  color={primary}
                />
              }
              onPress={handlePlayPause}
              isDisabled={!state.currentTrack}
            />
            <IconButton
              icon={<Icon as={MaterialIcons} name="skip-next" size={8} color={onSurface} />}
              onPress={handleSkipNext}
              isDisabled={!state.currentTrack}
            />
          </HStack>
        </VStack>

        {/* Playback Speed */}
        <HStack flex={1} space={2} justifyContent="center" alignItems="center">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <Button
              key={rate}
              size="sm"
              variant={state.playbackRate === rate ? 'solid' : 'outline'}
              onPress={() => handlePlaybackRateChange(rate)}
              isDisabled={!state.currentTrack}
              bg={state.playbackRate === rate ? primary : 'transparent'}
              _text={{ color: state.playbackRate === rate ? onPrimary : onSurface }}
              borderColor={primary}
            >
              {`${rate}x`}
            </Button>
          ))}
        </HStack>
      </VStack>
    </Box>
  );
} 