import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';
import { useLeadsStore } from '../store/leadsStore';
import { theme } from '../constants/theme';

export const ConnectionBar = () => {
  const { isConnected, leads } = useLeadsStore();
  
  const height = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    height.value = withSpring(isConnected ? 0 : 44, {
      damping: 15,
      stiffness: 100,
    });
    
    if (!isConnected) {
      opacity.value = withRepeat(withTiming(0.2, { duration: 800 }), -1, true);
    } else {
      opacity.value = 1;
    }
  }, [isConnected]);

  const containerStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View 
        style={[
          styles.dot, 
          { backgroundColor: isConnected ? theme.green : theme.red },
          dotStyle
        ]} 
      />
      <Text style={[styles.text, !isConnected && styles.textError]}>
        {isConnected 
          ? `Connected · ${leads.length} leads received` 
          : 'Reconnecting to server...'}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bgCard,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    overflow: 'hidden',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: theme.textSub,
  },
  textError: {
    color: theme.red,
  },
});
