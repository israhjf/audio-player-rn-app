import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioTrack, PlayerState } from '../types';

interface AudioPlayerContextType {
  state: PlayerState;
  play: (track: AudioTrack) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  skipForward: () => Promise<void>;
  skipBackward: () => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
}

const initialState: PlayerState = {
  isPlaying: false,
  currentTrack: null,
  progress: 0,
  duration: 0,
  playbackRate: 1,
};

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

type Action =
  | { type: 'SET_TRACK'; payload: AudioTrack }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'RESET' };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SET_TRACK':
      return { ...state, currentTrack: action.payload };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_PLAYBACK_RATE':
      return { ...state, playbackRate: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const play = async (track: AudioTrack) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true, rate: state.playbackRate },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const pause = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    } catch (error) {
      console.error('Error pausing track:', error);
    }
  };

  const stop = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        dispatch({ type: 'RESET' });
      }
    } catch (error) {
      console.error('Error stopping track:', error);
    }
  };

  const seek = async (position: number) => {
    try {
      if (sound) {
        await sound.setPositionAsync(position);
        dispatch({ type: 'SET_PROGRESS', payload: position });
      }
    } catch (error) {
      console.error('Error seeking track:', error);
    }
  };

  const skipForward = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.min(
            status.positionMillis + 15000,
            status.durationMillis || 0
          );
          await seek(newPosition);
        }
      }
    } catch (error) {
      console.error('Error skipping forward:', error);
    }
  };

  const skipBackward = async () => {
    try {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          const newPosition = Math.max(status.positionMillis - 15000, 0);
          await seek(newPosition);
        }
      }
    } catch (error) {
      console.error('Error skipping backward:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (sound) {
        await sound.setRateAsync(rate, true);
        dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      dispatch({ type: 'SET_PROGRESS', payload: status.positionMillis });
      dispatch({ type: 'SET_DURATION', payload: status.durationMillis || 0 });
      dispatch({ type: 'SET_PLAYING', payload: status.isPlaying });
    }
  };

  const value = {
    state,
    play,
    pause,
    stop,
    seek,
    skipForward,
    skipBackward,
    setPlaybackRate,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
} 