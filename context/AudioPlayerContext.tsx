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
      return { ...state, progress: Math.floor(action.payload) };
    case 'SET_DURATION':
      return { ...state, duration: Math.floor(action.payload) };
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
    console.log('AudioPlayerContext.tsx: Provider mounted');
    return () => {
      console.log('AudioPlayerContext.tsx: Provider unmounting');
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const play = async (track: AudioTrack) => {
    console.log('AudioPlayerContext.tsx: Attempting to play track:', track.title);
    try {
      if (sound && state.currentTrack?.id === track.id) {
        console.log('AudioPlayerContext.tsx: Resuming current track from position:', state.progress);
        await sound.playAsync();
        dispatch({ type: 'SET_PLAYING', payload: true });
        return;
      }

      if (sound) {
        console.log('AudioPlayerContext.tsx: Unloading previous sound');
        await sound.unloadAsync();
      }
      console.log('AudioPlayerContext.tsx: Creating new sound instance');
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.url },
        { shouldPlay: true, rate: state.playbackRate },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
      console.log('AudioPlayerContext.tsx: Track started playing:', track.title);
    } catch (error) {
      console.error('AudioPlayerContext.tsx: Error playing track:', error);
    }
  };

  const pause = async () => {
    console.log('AudioPlayerContext.tsx: Attempting to pause track');
    try {
      if (sound) {
        await sound.pauseAsync();
        dispatch({ type: 'SET_PLAYING', payload: false });
        console.log('AudioPlayerContext.tsx: Track paused');
      }
    } catch (error) {
      console.error('AudioPlayerContext.tsx: Error pausing track:', error);
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
      console.error('AudioPlayerContext.tsx: Error stopping track:', error);
    }
  };

  const seek = async (position: number) => {
    console.log('AudioPlayerContext.tsx: Attempting to seek to position:', position);
    try {
      if (sound) {
        const flooredPosition = Math.floor(position);
        console.log('AudioPlayerContext.tsx: Seeking to floored position:', flooredPosition);
        await sound.setPositionAsync(flooredPosition);
        dispatch({ type: 'SET_PROGRESS', payload: flooredPosition });
      }
    } catch (error) {
      console.error('AudioPlayerContext.tsx: Error seeking track:', error);
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
      console.error('AudioPlayerContext.tsx: Error skipping forward:', error);
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
      console.error('AudioPlayerContext.tsx: Error skipping backward:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (sound) {
        await sound.setRateAsync(rate, true);
        dispatch({ type: 'SET_PLAYBACK_RATE', payload: rate });
      }
    } catch (error) {
      console.error('AudioPlayerContext.tsx: Error setting playback rate:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const flooredPosition = Math.floor(status.positionMillis);
      const flooredDuration = Math.floor(status.durationMillis || 0);

      dispatch({ type: 'SET_PROGRESS', payload: flooredPosition });
      dispatch({ type: 'SET_DURATION', payload: flooredDuration });
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
    throw new Error('AudioPlayerContext.tsx: useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
} 