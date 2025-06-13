import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { AudioTrack, PlayerState } from '../types';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const STORAGE_KEY = '@audio_player_state';

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

type Action =
  | { type: 'SET_TRACK'; payload: AudioTrack }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'SET_PROGRESS'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }
  | { type: 'RESTORE_STATE'; payload: PlayerState }
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
    case 'RESTORE_STATE':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        console.log('AudioPlayerContext.tsx: Attempting to load saved state');
        const savedState = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('AudioPlayerContext.tsx: Saved state from storage:', savedState);
        
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          console.log('AudioPlayerContext.tsx: Parsed state:', parsedState);
          
          dispatch({ type: 'RESTORE_STATE', payload: parsedState });
          
          // If there was a track playing, load it
          if (parsedState.currentTrack) {
            console.log('AudioPlayerContext.tsx: Loading saved track:', parsedState.currentTrack.title);
            const { sound: newSound } = await Audio.Sound.createAsync(
              { uri: parsedState.currentTrack.url },
              { 
                shouldPlay: false,
                positionMillis: parsedState.progress,
                rate: parsedState.playbackRate,
                volume: 1.0,
                isMuted: false,
              },
              onPlaybackStatusUpdate
            );
            console.log('AudioPlayerContext.tsx: Sound loaded successfully');
            setSound(newSound);
          }
        } else {
          console.log('AudioPlayerContext.tsx: No saved state found');
        }
      } catch (error) {
        console.error('AudioPlayerContext.tsx: Error loading state:', error);
      }
    };
    loadState();
  }, []);

  // Save state to AsyncStorage whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        console.log('AudioPlayerContext.tsx: Saving state:', state);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        console.log('AudioPlayerContext.tsx: State saved successfully');
      } catch (error) {
        console.error('AudioPlayerContext.tsx: Error saving state:', error);
      }
    };
    saveState();
  }, [state]);

  useEffect(() => {
    console.log('AudioPlayerContext.tsx: Provider mounted');
    
    // Configure audio session
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('AudioPlayerContext.tsx: Audio session configured successfully');
      } catch (error) {
        console.error('AudioPlayerContext.tsx: Error configuring audio session:', error);
      }
    };

    configureAudio();

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
        { 
          shouldPlay: true, 
          rate: state.playbackRate,
          volume: 1.0,
          isMuted: false,
        },
        onPlaybackStatusUpdate
      );

      // Ensure the sound is loaded before proceeding
      const status = await newSound.getStatusAsync();
      if (!status.isLoaded) {
        throw new Error('Failed to load audio track');
      }

      setSound(newSound);
      dispatch({ type: 'SET_TRACK', payload: track });
      dispatch({ type: 'SET_PLAYING', payload: true });
      console.log('AudioPlayerContext.tsx: Track started playing:', track.title);
    } catch (error) {
      console.error('AudioPlayerContext.tsx: Error playing track:', error);
      // Reset state on error
      dispatch({ type: 'RESET' });
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