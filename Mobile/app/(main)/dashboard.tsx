import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, SPACING, RADIUS } from '@/src/constants/theme';

export default function DashboardScreen() {
  const { user } = useAuth();
  
  const stats = [
    { title: 'Total Orders', value: '156', icon: 'document-text', color: '#2563EB' },
    { title: 'Pending', value: '23', icon: 'time', color: '#F59E0B' },
    { title: 'Completed', value: '133', icon: 'checkmark-circle', color: '#22C55E' },
    { title: 'Revenue', value: '₹4.2L', icon: 'cash', color: '#8B5CF6' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <LinearGradient
        colors={[COLORS.primaryDark, COLORS.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.welcomeCard}>

        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.userName}>{user?.name || user?.username}! 👋</Text>
        <Text style={styles.welcomeSubtext}>
          Here's what's happening with your orders today.
        </Text>
      </LinearGradient>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Surface key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
              <Ionicons name={stat.icon as any} size={24} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statTitle}>{stat.title}</Text>
          </Surface>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <Surface style={styles.actionCard}>
            <Ionicons name="add-circle" size={28} color={COLORS.primary} />
            <Text style={styles.actionText}>New Order</Text>
          </Surface>
          <Surface style={styles.actionCard}>
            <Ionicons name="search" size={28} color={COLORS.primary} />
            <Text style={styles.actionText}>Search</Text>
          </Surface>
          <Surface style={styles.actionCard}>
            <Ionicons name="stats-chart" size={28} color={COLORS.primary} />
            <Text style={styles.actionText}>Reports</Text>
          </Surface>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  welcomeCard: {
    margin: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textLight,
    marginTop: 4,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
});