# Audio Player React Native App (Submitted June 13, 2025)

A feature-rich audio player built with React Native and Expo, supporting both iOS and Android platforms.

## Features

- 🎵 Playlist with artwork and track information
- 🎧 Mini player with playback controls
- 🎮 Full-screen player with advanced controls
- 🌓 Light and dark theme support
- 🌐 English/Spanish localization
- 💾 Persistent playback state
- 📱 Cross-platform support (iOS & Android)

## Demo Video

[![Audio Player Demo](https://img.youtube.com/vi/YtvtHzkm1e8/0.jpg)](https://www.youtube.com/watch?v=YtvtHzkm1e8)

Watch the demo video to see the app in action, showcasing all features and functionality.

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

1. **iOS Performance Issues:**
   - On the Player screen (tested on an iPhone 7), I've noticed occasional lag when:
     - Using the playback speed control
     - Skipping to the next or previous song
     - Dragging the progress slider
   - This may be related to the older hardware, but it's something I plan to optimize in a second iteration.

2. **Offline Mode (Bonus)**
   - Not implemented in this version.
   - I've researched approaches using `expo-media-library` and `expo-file-system` to cache audio files locally.
   - This feature could be added in a future update to support offline playback.

## Future Improvements

- Implement audio caching for offline playback
- Add playlist management features
- Support for more audio formats
- Enhanced background playback reliability
- Add more localization options

