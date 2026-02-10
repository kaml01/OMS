import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { COLORS, SPACING, RADIUS } from '@/src/constants/theme';
import { api } from '@/src/services/api';
import { storage } from '@/src/utils/storage';

interface DashboardData {
  total_orders: number;
  total_revenue: string;
  today_orders: number;
  this_month_orders: number;
  status_counts: {
    submitted: number;
    pending_approval: number;
    approved: number;
    rejected: number;
    sap_created: number;
  };
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = await storage.getAccessToken();
      const result = await api.get('/orders/dashboard/admin/', token || undefined);
      if (result && !result.error) {
        setData(result);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = data
    ? [
        { title: 'Total Orders', value: String(data.total_orders), icon: 'document-text', color: '#2563EB' },
        { title: 'Approved', value: String(data.status_counts.approved), icon: 'checkmark-circle', color: '#22C55E' },
        { title: 'Pending', value: String(data.status_counts.pending_approval), icon: 'time', color: '#F59E0B' },
        { title: 'Rejected', value: String(data.status_counts.rejected), icon: 'close-circle', color: '#DC2626' },
        { title: "Today's Orders", value: String(data.today_orders), icon: 'today', color: '#8B5CF6' },
        { title: 'This Month', value: String(data.this_month_orders), icon: 'calendar', color: '#0891B2' },
        { title: 'Revenue', value: `₹${Number(data.total_revenue).toLocaleString('en-IN')}`, icon: 'cash', color: '#059669' },
        { title: 'SAP Created', value: String(data.status_counts.sap_created), icon: 'cloud-done', color: '#6366F1' },
      ]
    : [];

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
        <Text style={styles.userName}>{user?.name || user?.username}!</Text>
        <Text style={styles.welcomeSubtext}>
          Here's what's happening with your orders today.
        </Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
      ) : (
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
      )}

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
    width: '30%',
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
