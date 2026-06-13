import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

interface LiveBadgeProps {
  isLive: boolean;
}

export const LiveBadge = ({ isLive }: LiveBadgeProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scale.setValue(1);
    }
  }, [isLive]);

  return (
    <View style={styles.container}>
      {isLive ? (
        <>
          <Animated.View style={[styles.dot, styles.liveDot, { transform: [{ scale }] }]} />
          <Text style={styles.liveText}>LIVE</Text>
        </>
      ) : (
        <>
          <View style={[styles.dot, styles.offlineDot]} />
          <Text style={styles.offlineText}>OFFLINE</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveDot: {
    backgroundColor: theme.red,
  },
  offlineDot: {
    backgroundColor: theme.textMuted,
  },
  liveText: {
    color: theme.red,
    fontWeight: 'bold',
    fontSize: 11,
  },
  offlineText: {
    color: theme.textMuted,
    fontWeight: 'bold',
    fontSize: 11,
  },
});
