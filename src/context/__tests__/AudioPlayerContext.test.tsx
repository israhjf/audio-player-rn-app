import React from 'react';
import { render, act, renderHook } from '@testing-library/react-native';
import { AudioPlayerProvider, useAudioPlayer } from '../AudioPlayerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn().mockResolvedValue({
        sound: {
          playAsync: jest.fn(),
          pauseAsync: jest.fn(),
          stopAsync: jest.fn(),
          setPositionAsync: jest.fn(),
          setRateAsync: jest.fn(),
          unloadAsync: jest.fn(),
          getStatusAsync: jest.fn().mockResolvedValue({
            isLoaded: true,
            isPlaying: false,
            positionMillis: 0,
            durationMillis: 100000,
          }),
        },
      }),
    },
    setAudioModeAsync: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}));

const mockTrack = {
  id: '1',
  title: 'Test Track',
  artist: 'Test Artist',
  url: 'https://example.com/test.mp3',
  artwork: 'https://example.com/artwork.jpg',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AudioPlayerProvider>{children}</AudioPlayerProvider>
);

describe('AudioPlayerContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test #1: Play Functionality
  // Tests if the audio player can successfully play a track and update the state accordingly
  it('should play a track', async () => {
    const { result } = renderHook(() => useAudioPlayer(), { wrapper });
    
    await act(async () => {
      await result.current.play(mockTrack);
    });

    expect(result.current.state.currentTrack).toEqual(mockTrack);
    expect(result.current.state.isPlaying).toBe(true);
    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      { uri: mockTrack.url },
      expect.any(Object),
      expect.any(Function)
    );
  });

  // Test #2: Pause Functionality
  // Tests if the audio player can successfully pause a playing track and update the playing state to false
  it('should pause a track', async () => {
    const { result } = renderHook(() => useAudioPlayer(), { wrapper });
    
    // First play a track
    await act(async () => {
      await result.current.play(mockTrack);
    });

    // Then pause it
    await act(async () => {
      await result.current.pause();
    });

    expect(result.current.state.isPlaying).toBe(false);
  });

  // Test #3: State Persistence
  // Tests if the audio player can successfully restore its state from AsyncStorage when the app restarts
  it('should load state from AsyncStorage on mount', async () => {
    const savedState = {
      isPlaying: false,
      currentTrack: mockTrack,
      progress: 50000,
      duration: 100000,
      playbackRate: 1,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(savedState));

    const { result } = renderHook(() => useAudioPlayer(), { wrapper });

    // Wait for state to be loaded
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.state.currentTrack).toEqual(mockTrack);
    expect(result.current.state.progress).toBe(50000);
  });
}); 