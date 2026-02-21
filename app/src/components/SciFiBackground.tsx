import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const { width, height } = Dimensions.get('window');

const SciFiBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const gridSize = 40;
  const horizontalLines = Math.ceil(height / gridSize);
  const verticalLines = Math.ceil(width / gridSize);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Grid Lines */}
      <View style={StyleSheet.absoluteFill}>
        {[...Array(horizontalLines)].map((_, i) => (
          <View
            key={`h-${i}`}
            style={[
              styles.line,
              {
                top: i * gridSize,
                width: '100%',
                height: 1,
                backgroundColor: theme.colors.primary,
                opacity: theme.dark ? 0.05 : 0.1
              }
            ]}
          />
        ))}
        {[...Array(verticalLines)].map((_, i) => (
          <View
            key={`v-${i}`}
            style={[
              styles.line,
              {
                left: i * gridSize,
                height: '100%',
                width: 1,
                backgroundColor: theme.colors.primary,
                opacity: theme.dark ? 0.05 : 0.1
              }
            ]}
          />
        ))}
      </View>

      {/* Decorative Glows */}
      <View style={[styles.glow, { top: -100, left: -100, width: 300, height: 300, opacity: 0.1, backgroundColor: theme.colors.primary }]} />
      <View style={[styles.glow, { bottom: -50, right: -50, width: 250, height: 250, opacity: theme.dark ? 0.05 : 0.08, backgroundColor: theme.colors.primary }]} />

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  line: {
    position: 'absolute',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    // Note: Blur is tricky in plain RN without extra libs,
    // but we can use opacity and large border radius.
  },
});

export default SciFiBackground;
