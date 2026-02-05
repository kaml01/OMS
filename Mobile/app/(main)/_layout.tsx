<<<<<<< HEAD
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawer from '@/src/components/common/CustomDrawer';
import { COLORS, RADIUS } from '@/src/constants/theme';

export default function MainLayout() {
=======
import React from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/src/components/common/CustomDrawer";
import { useAuth } from "@/src/context/AuthContext";
import { COLORS, RADIUS } from "@/src/constants/theme";

export default function MainLayout() {
  const { user } = useAuth();
  const role = user?.role || "";

  // Define which screens each role can see
  const canSee = {
    dashboard: ["admin", "manager", "operator"],
    orders: ["admin", "manager", "operator"],
    "orders/create": ["admin", "manager"],
    "users/create": ["admin"],
    reports: ["admin", "manager"],
    settings: ["admin"],
  };

  // Check if user can see a screen
  const isVisible = (screen: string) => {
    const allowedRoles = canSee[screen as keyof typeof canSee] || [];
    return allowedRoles.includes(role);
  };

>>>>>>> 3ea987458ba0e0e91d2eb924d913520825684790
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
<<<<<<< HEAD
            fontWeight: '600',
=======
            fontWeight: "600",
>>>>>>> 3ea987458ba0e0e91d2eb924d913520825684790
            fontSize: 18,
          },
          headerShadowVisible: false,
          drawerActiveBackgroundColor: COLORS.primaryLight,
          drawerActiveTintColor: COLORS.primaryDark,
          drawerInactiveTintColor: COLORS.textSecondary,
          drawerLabelStyle: {
            fontSize: 14,
<<<<<<< HEAD
            fontWeight: '500',
=======
            fontWeight: "500",
>>>>>>> 3ea987458ba0e0e91d2eb924d913520825684790
            marginLeft: -8,
          },
          drawerItemStyle: {
            borderRadius: RADIUS.md,
            marginHorizontal: 8,
            marginVertical: 2,
            paddingLeft: 8,
          },
<<<<<<< HEAD
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
=======
        }}
      >
        {/* Dashboard - All roles */}
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            drawerIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("dashboard")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />

        {/* Orders - All roles */}
        <Drawer.Screen
          name="orders/index"
          options={{
            drawerLabel: "Orders",
            title: "Orders",
            drawerIcon: ({ color }) => (
              <Ionicons name="document-text-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("orders")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />

        {/* Create Order - Admin, Manager only */}
        <Drawer.Screen
          name="orders/create"
          options={{
            drawerLabel: "Create Order",
            title: "Create Order",
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("orders/create")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />

        {/* New User - Admin, Manager only */}
        <Drawer.Screen
          name="users/create"
          options={{
            drawerLabel: "New User",
            title: "New User",
            drawerIcon: ({ color }) => (
              <Ionicons name="person-add-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("users/create")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />

        {/* Reports - Admin, Manager only */}
        <Drawer.Screen
          name="reports"
          options={{
            drawerLabel: "Reports",
            title: "Reports",
            drawerIcon: ({ color }) => (
              <Ionicons name="bar-chart-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("reports")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />

        {/* Settings - Admin only */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("settings")
              ? {
                  borderRadius: RADIUS.md,
                  marginHorizontal: 8,
                  marginVertical: 2,
                  paddingLeft: 8,
                }
              : { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
>>>>>>> 3ea987458ba0e0e91d2eb924d913520825684790
