import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box } from 'native-base';
import { useTheme } from '../theme/ThemeProvider';

export default function LoadingOverlay() {
  const { primary } = useTheme();

  return (
    <Box style={styles.container}>
      <ActivityIndicator size="large" color={primary} />
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
}); 