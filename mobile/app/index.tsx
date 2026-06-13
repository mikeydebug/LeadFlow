import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, Platform, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLeadsStore } from '../src/store/leadsStore';
import { connectSocket, disconnectSocket } from '../src/services/socket';
import { theme } from '../src/constants/theme';
import { Lead } from '../src/types';

import { LiveBadge } from '../src/components/LiveBadge';
import { LeadCard } from '../src/components/LeadCard';
import { EmptyState } from '../src/components/EmptyState';
import { ConnectionBar } from '../src/components/ConnectionBar';

export default function HomeScreen() {
  const { leads, isConnected, newLeadId, clearLeads } = useLeadsStore();
  const flatListRef = useRef<FlatList>(null);
  const prevLeadsLength = useRef(leads.length);

  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (leads.length > prevLeadsLength.current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      if (Platform.OS === 'web') {
        try {
          // Play a nice "ding" sound
          const audio = new window.Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Audio play failed:', e));
        } catch (e) {}
      }
    }
    prevLeadsLength.current = leads.length;
  }, [leads.length]);

  const renderItem = useCallback(({ item }: { item: Lead }) => (
    <LeadCard lead={item} isNew={item.id === newLeadId} />
  ), [newLeadId]);

  const onClear = useCallback(() => {
    clearLeads();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [clearLeads]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.bg} />
      
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>LeadFlow</Text>
          <View style={styles.rightActions}>
            <LiveBadge isLive={isConnected} />
            {leads.length > 0 && (
              <TouchableOpacity onPress={onClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.subtitle}>
          {leads.length === 0 ? 'No leads yet' : `${leads.length} leads`}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />

      <ConnectionBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearText: {
    color: theme.textMuted,
    fontSize: 13,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: theme.textMuted,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 60,
  },
});
