import React, { useEffect } from 'react';
import { Box, HStack, Icon, Pressable, Text, VStack, useColorMode } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useAudioPlayer } from '@/src/context/AudioPlayerContext';
import { AudioTrack } from '../../types';
import { Image, FlatList } from 'react-native';
import MiniPlayer from '@/src/components/MiniPlayer';

// Sample tracks - replace with your actual tracks
export const sampleTracks: AudioTrack[] = [
  {
    id: '1',
    title: 'Monkeys Spinning Monkeys',
    artist: 'Kevin MacLeod',
    url: 'https://www.chosic.com/wp-content/uploads/2021/02/Monkeys-Spinning-Monkeys(chosic.com).mp3',
    artwork: 'https://i.ibb.co/VdD44qD/Kevin-Mac-Leod.webp',
  },
  {
    id: '2',
    title: 'Awaken',
    artist: 'Alex-Productions',
    url: 'https://www.chosic.com/wp-content/uploads/2025/04/Awaken-chosic.com_.mp3',
    artwork: 'https://i.ibb.co/4gFjX5hz/alex-productions.jpg',
  },
  {
    id: '3',
    title: 'The Inspiration',
    artist: 'Keys of Moon',
    url: 'https://www.chosic.com/wp-content/uploads/2021/04/The-Inspiration-mp3(chosic.com).mp3',
    artwork: 'https://i.ibb.co/99zxCKhJ/keys-of-moon.webp',
  },
  {
    id: '4',
    title: 'Daylight',
    artist: 'Alex-Productions',
    url: 'https://www.chosic.com/wp-content/uploads/2024/05/Daylight-chosic.com_.mp3',
    artwork: 'https://i.ibb.co/4gFjX5hz/alex-productions.jpg',
  },
  {
    id: '5',
    title: 'Into The Wilds',
    artist: 'Scott Buckley',
    url: 'https://www.chosic.com/wp-content/uploads/2024/11/IntoTheWilds-chosic.com_.mp3',
    artwork: 'https://i.ibb.co/Xr7w651Y/scott-buckley.jpg',
  },
  {
    id: '6',
    title: 'Powerfulg',
    artist: 'MaxKoMusic',
    url: 'https://www.chosic.com/wp-content/uploads/2022/10/Powerful(chosic.com).mp3',
    artwork: 'https://i.ibb.co/tTM7z7Dy/Max-Ko-Music.jpg',
  },
  {
    id: '7',
    title: 'Superepic',
    artist: 'Alexander Nakarada',
    url: 'https://www.chosic.com/wp-content/uploads/2020/07/alexander-nakarada-superepic(chosic.com).mp3',
    artwork: 'https://i.ibb.co/VpCCVxJB/Alexander-Nakarada.jpg',
  },
  {
    id: '8',
    title: 'Victory',
    artist: 'MaxKoMusic',
    url: 'https://www.chosic.com/wp-content/uploads/2021/08/Victory(chosic.com).mp3',
    artwork: 'https://i.ibb.co/tTM7z7Dy/Max-Ko-Music.jpg',
  },
  {
    id: '9',
    title: 'Hope',
    artist: 'Ghostrifter Official',
    url: 'https://www.chosic.com/wp-content/uploads/2021/09/Hope-Emotional-Soundtrack(chosic.com).mp3',
    artwork: 'https://i.ibb.co/W46znWc6/Ghostrifter-Official.jpg',
  },
  {
    id: '10',
    title: 'The Army Of Minotaur',
    artist: 'Makai Symphony',
    url: 'https://www.chosic.com/wp-content/uploads/2021/11/The-Army-of-Minotaur(chosic.com).mp3',
    artwork: 'https://i.ibb.co/1YnpVBP0/Makai-Symphony.jpg',
  },
];

export default function PlaylistScreen() {
  const { state, play } = useAudioPlayer();
  const { colorMode } = useColorMode();

  useEffect(() => {
    console.log('home.tsx: PlaylistScreen mounted');
    return () => console.log('home.tsx: PlaylistScreen unmounted');
  }, []);

  const renderTrack = ({ item }: { item: AudioTrack }) => {
    const isPlaying = state.currentTrack?.id === item.id && state.isPlaying;

    return (
      <Pressable
        onPress={() => {
          console.log('home.tsx: PlaylistScreen: Track selected:', {
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
          bg={colorMode === 'dark' ? 'gray.800' : 'white'}
          borderBottomWidth={1}
          borderBottomColor={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
          alignItems="center"
        >
          <Box
            w={12}
            h={12}
            bg={colorMode === 'dark' ? 'gray.700' : 'gray.200'}
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
                color={colorMode === 'dark' ? 'gray.400' : 'gray.600'}
              />
            )}
          </Box>
          <VStack flex={1}>
            <Text
              fontSize="md"
              bold
              color={isPlaying ? 'primary.500' : undefined}
            >
              {item.title}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.artist}
            </Text>
          </VStack>
          {state.currentTrack?.id === item.id && (
            <Icon
              as={MaterialIcons}
              name="arrow-back"
              size={6}
              color="primary.500"
            />
          )}
        </HStack>
      </Pressable>
    );
  };

  return (
    <Box flex={1} bg={colorMode === 'dark' ? 'gray.900' : 'white'} safeArea>
      <FlatList
        data={sampleTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }} // Add extra space for mini player
      />
      <MiniPlayer />
    </Box>
  );
} 