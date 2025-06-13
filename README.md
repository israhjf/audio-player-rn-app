# Audio Player React Native App

A feature-rich audio player built with React Native and Expo, supporting both iOS and Android platforms.

## Features

- 🎵 Playlist with artwork and track information
- 🎧 Mini player with playback controls
- 🎮 Full-screen player with advanced controls
- 🌓 Light and dark theme support
- 🌐 Spanish localization
- 💾 Persistent playback state
- 📱 Cross-platform support (iOS & Android)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- Expo Go app (for physical devices)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd audio-player-rn-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical devices

## Development Trade-offs

1. **Audio Library Choice**
   - Using `expo-av` instead of the newer `expo-audio`
   - Trade-off: `expo-av` is marked as deprecated but more stable
   - Reason: `expo-audio` is still in beta and migration would be complex

2. **Navigation Implementation**
   - Switched from `expo-router` to `react-navigation`
   - Trade-off: More boilerplate code but better control over navigation
   - Reason: Better compatibility with existing navigation patterns

3. **State Management**
   - Using Context API instead of Redux
   - Trade-off: Simpler implementation but less scalable
   - Reason: Sufficient for current app complexity

## Known Limitations

1. **Audio Playback**
   - Background playback may be interrupted on some Android devices
   - Limited support for certain audio formats
   - No gapless playback between tracks

2. **Performance**
   - Large playlists might experience slight loading delays
   - Artwork loading depends on network conditions

3. **Platform Specific**
   - iOS: Requires additional setup for background audio
   - Android: Some devices may have inconsistent audio behavior

## Future Improvements

- Implement audio caching for offline playback
- Add playlist management features
- Support for more audio formats
- Enhanced background playback reliability
- Add more localization options

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
