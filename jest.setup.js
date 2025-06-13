// Mock expo-av
jest.mock('expo-av', () => ({
  Audio: {
    Sound: jest.fn(),
    setAudioModeAsync: jest.fn(),
  },
}));

// Setup jest-native
require('@testing-library/jest-native/extend-expect'); 