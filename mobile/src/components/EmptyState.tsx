import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export const EmptyState = React.memo(() => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.3, { duration: 1500 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Ionicons name="radio-outline" size={48} color={theme.textMuted} />
      </Animated.View>
      <Text style={styles.title}>Waiting for leads</Text>
      <Text style={styles.subtitle}>
        Submit a test lead via{'\n'}Meta Lead Testing Tool
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 18,
    color: theme.textSub,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
});
