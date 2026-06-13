import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { formatDistanceToNow } from 'date-fns';
import { Lead } from '../types';
import { theme } from '../constants/theme';

interface LeadCardProps {
  lead: Lead;
  isNew: boolean;
}

export const LeadCard = React.memo(({ lead, isNew }: LeadCardProps) => {
  const avatarLetter = lead.name ? lead.name.charAt(0).toUpperCase() : '?';
  const displayFormId = lead.formId.length > 12 ? `${lead.formId.substring(0, 12)}...` : lead.formId;
  const [, setTick] = useState(0);

  const highlightOpacity = useSharedValue(0);

  useEffect(() => {
    if (isNew) {
      highlightOpacity.value = withSequence(
        withTiming(0.2, { duration: 500 }),
        withTiming(0, { duration: 3000 })
      );
    }
  }, [isNew, highlightOpacity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: highlightOpacity.value,
  }));

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(14).stiffness(120)}
      style={[
        styles.card,
        isNew && styles.newCardStyles,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.highlightOverlay, overlayStyle]} pointerEvents="none" />
      <View style={styles.leftBorder} />
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarLetter}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{lead.name || 'Unknown'}</Text>
          <Text style={styles.email}>{lead.email || 'No email provided'}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.badges}>
          {!!lead.phone && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{lead.phone}</Text>
            </View>
          )}
          {!!lead.formId && (
            <View style={styles.pill}>
              <Text style={styles.pillText}>{displayFormId}</Text>
            </View>
          )}
        </View>
        <Text style={styles.time}>
          {formatDistanceToNow(lead.timestamp, { addSuffix: true })}
        </Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.bgCardElevated,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 10,
    overflow: 'hidden',
  },
  newCardStyles: {
    ...Platform.select({
      ios: {
        shadowColor: theme.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
        shadowColor: theme.accent,
      },
    }),
  },
  highlightOverlay: {
    backgroundColor: theme.accent,
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: theme.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.bgCard,
    borderColor: theme.accent,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.accent,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    color: theme.textSub,
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  pill: {
    backgroundColor: theme.textMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    color: theme.textSub,
    fontSize: 12,
  },
  time: {
    color: theme.textSub,
    fontSize: 12,
    marginLeft: 10,
  },
});
