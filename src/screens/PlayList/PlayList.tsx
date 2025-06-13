import React, { useEffect } from 'react';
import { Box, HStack, Icon, Pressable, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/src/context/AudioPlayerContext';
import { AudioTrack } from '../../types';
import { Image, FlatList } from 'react-native';
import MiniPlayer from '@/src/components/MiniPlayer';
import { useTheme } from '@/src/theme/ThemeProvider';
import { sampleTracks } from '@/src/data/sampleTracks';

export default function PlaylistScreen() {
  const { state, play } = useAudioPlayer();
  const { background, surface, onSurface, primary, onPrimary, outlineVariant } = useTheme();

  useEffect(() => {
    console.log('PlayList.tsx: PlaylistScreen mounted');
    return () => console.log('PlayList.tsx: PlaylistScreen unmounted');
  }, []);

  const renderTrack = ({ item }: { item: AudioTrack }) => {
    const isPlaying = state.currentTrack?.id === item.id && state.isPlaying;

    return (
      <Pressable
        onPress={() => {
          console.log('PlayList.tsx: PlaylistScreen: Track selected:', {
            title: item.title,
            id: item.id,
            isCurrentlyPlaying: isPlaying
          });
          play(item);
        }}
        _pressed={{ opacity: 0.7 }}
      >
        <HStack
          space={4}
          p={4}
          bg={surface}
          borderBottomWidth={1}
          borderBottomColor={outlineVariant}
          alignItems="center"
        >
          <Box
            w={12}
            h={12}
            bg={background}
            rounded="md"
            justifyContent="center"
            alignItems="center"
          >
            {item.artwork ? (
              <Image
                source={{ uri: item.artwork }}
                alt={item.title}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Icon
                as={MaterialIcons}
                name="music-note"
                size={6}
                color={onSurface}
              />
            )}
          </Box>
          <VStack flex={1}>
            <Text
              fontSize="md"
              bold
              color={isPlaying ? primary : onSurface}
            >
              {item.title}
            </Text>
            <Text fontSize="sm" color={onSurface} opacity={0.7}>
              {item.artist}
            </Text>
          </VStack>
          {state.currentTrack?.id === item.id && (
            <Icon
              as={MaterialIcons}
              name="arrow-back"
              size={6}
              color={primary}
            />
          )}
        </HStack>
      </Pressable>
    );
  };

  return (
    <Box flex={1} bg={background} safeAreaBottom>
      <FlatList
        data={sampleTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <MiniPlayer />
    </Box>
  );
} 