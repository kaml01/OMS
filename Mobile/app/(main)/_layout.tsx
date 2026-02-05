import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '@/src/components/common/CustomDrawer';
import { COLORS, RADIUS } from '@/src/constants/theme';

export default function MainLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primaryDark,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          drawerActiveBackgroundColor: COLORS.primaryLight,
          drawerActiveTintColor: COLORS.primaryDark,
          drawerInactiveTintColor: COLORS.textSecondary,
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
            marginLeft: -8,
          },
          drawerItemStyle: {
            borderRadius: RADIUS.md,
            marginHorizontal: 8,
            marginVertical: 2,
            paddingLeft: 8,
          },
        }}>
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="orders/index"
          options={{
            drawerLabel: 'Orders',
            title: 'Orders',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={22} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="users/create"
          options={{
            drawerLabel: 'New User',
            title: 'New User',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={22} color={color} />
            ),
          }}
        />
        
      </Drawer>
    </GestureHandlerRootView>
  );
}