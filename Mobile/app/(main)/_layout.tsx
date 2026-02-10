
import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/src/components/common/CustomDrawer";
import { useAuth } from "@/src/context/AuthContext";
import { COLORS, RADIUS } from "@/src/constants/theme";

export default function MainLayout() {

  const { user } = useAuth();
  const role = user?.role || "";

  const canSee = {
    dashboard: ["admin", "manager", "operator"],
    orders: ["manager", "operator"],
    "orders/create": ["manager"],
    "orders/orderslist": ["manager"],
    "users/create": ["admin"],
    approver: ["approver"],
    reports: ["admin", "manager"],
    settings: ["admin"],
  };

  useEffect(() => {
    console.log("useridd " + canSee["approver"].includes(role));
  });

  const isVisible = (screen: keyof typeof canSee) => {
    return canSee[screen].includes(role);
  };

  const hiddenStyle = { display: "none" as const };

  const visibleStyle = {
    borderRadius: RADIUS.md,
    marginHorizontal: 8,
    marginVertical: 2,
    paddingLeft: 8,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: COLORS.primaryDark },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
          },
          headerShadowVisible: false,
          drawerActiveBackgroundColor: COLORS.primaryLight,
          drawerActiveTintColor: COLORS.primaryDark,
          drawerInactiveTintColor: COLORS.textSecondary,
          drawerLabelStyle: {
            fontSize: 14,
            fontWeight: "500",
            marginLeft: -8,
          },
        }}>
        {/* Dashboard */}
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
            drawerIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("dashboard")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        {/* Orders */}
        <Drawer.Screen
          name="orders/orderlist"
          options={{
            drawerLabel: "Orders",
            title: "Orders",
            drawerIcon: ({ color }) => (
              <Ionicons
                name="document-text-outline"
                size={22}
                color={color}
              />
            ),
            drawerItemStyle: isVisible("orders")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        {/* Create Order */}
        <Drawer.Screen
          name="orders/create"
          options={{
            drawerLabel: "Create Order",
            title: "Create Order",
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("orders/create")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        {/* New User */}
        <Drawer.Screen
          name="users/create"
          options={{
            drawerLabel: "New User",
            title: "New User",
            drawerIcon: ({ color }) => (
              <Ionicons name="person-add-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("users/create")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        {/* Reports */}
        <Drawer.Screen
          name="reports"
          options={{
            drawerLabel: "Reports",
            title: "Reports",
            drawerIcon: ({ color }) => (
              <Ionicons name="bar-chart-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("reports")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        {/* Settings */}
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("settings")
              ? visibleStyle
              : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="approver"
          options={{
            drawerLabel: "Pending Approvals",
            title: "Pending Approvals",
            headerShown: true,
            drawerIcon: ({ color }) => (
              <Ionicons name="checkmark-done-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible("approver") ? visibleStyle : hiddenStyle,
          }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
