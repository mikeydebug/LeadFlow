import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useLeadsStore } from '../store/leadsStore';
import { theme } from '../constants/theme';

export const ConnectionBar = () => {
  const { isConnected, leads } = useLeadsStore();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isConnected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      opacity.setValue(1);
    }
  }, [isConnected]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.dot, 
          { backgroundColor: isConnected ? theme.green : theme.red },
          !isConnected && { opacity }
        ]} 
      />
      <Text style={[styles.text, !isConnected && styles.textError]}>
        {isConnected 
          ? `Connected · ${leads.length} leads received` 
          : 'Reconnecting to server...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.bgCard,
    borderTopWidth: 1,
    borderTopColor: theme.border,
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
