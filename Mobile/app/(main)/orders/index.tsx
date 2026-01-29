import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, SPACING } from '@/src/constants/theme';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>Orders List</Text>
      <Text style={styles.subtitle}>Your orders will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    color: COLORS.text,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
});