import React, { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@/src/components/common/CustomDrawer";
import { useAuth } from "@/src/context/AuthContext";
import { COLORS, RADIUS } from "@/src/constants/theme";

export default function MainLayout() {
  const { user } = useAuth();
  const userRole = user?.role?.toLowerCase() || '';

  const canSee: Record<string, string[]> = {
    dashboard: ['admin', 'manager', 'approver'],
    'orders/create': ['manager'],
    'orders/orderlist': ['billing'],
    'users/create': ['admin'],
    'approver/pending_approval': ['approver'],
  };

  const visibleStyle = {
    borderRadius: RADIUS.md,
    marginHorizontal: 8,
    marginVertical: 2,
    paddingLeft: 8,
  };
  const hiddenStyle = { display: 'none' as const };

  const isVisible = (screen: string) => {
    const roles = canSee[screen];
    return roles?.includes(userRole);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{ /* ...your existing screenOptions */ }}
      >
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
            drawerIcon: ({ color }) => (
              <Ionicons name="grid-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible('dashboard') ? visibleStyle : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="orders/create"
          options={{
            drawerLabel: 'Create Order',
            title: 'Create Order',
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible('orders/create') ? visibleStyle : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="orders/orderlist"
          options={{
            drawerLabel: 'Order List',
            title: 'Order List',
            drawerIcon: ({ color }) => (
              <Ionicons name="document-text-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible('orders/orderlist') ? visibleStyle : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="users/create"
          options={{
            drawerLabel: 'Create User',
            title: 'Create User',
            drawerIcon: ({ color }) => (
              <Ionicons name="person-add-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible('users/create') ? visibleStyle : hiddenStyle,
          }}
        />

        <Drawer.Screen
          name="approver/pending_approval"
          options={{
            drawerLabel: 'Pending Approvals',
            title: 'Pending Approvals',
            drawerIcon: ({ color }) => (
              <Ionicons name="checkmark-done-outline" size={22} color={color} />
            ),
            drawerItemStyle: isVisible('approver/pending_approval') ? visibleStyle : hiddenStyle,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// export default function MainLayout() {

//   const { user } = useAuth();
//   const role = user?.role || "";

//   const canSee = {
//     dashboard: ["Admin", "Manager"],
//     orders: ["Manager"],
//     "orders/create": ["Manager"],
//     "orders/orderslist": ["Manager"],
//     "users/create": ["Admin"],
//     approval: ["Approver"],
//     reports: ["Manager"],
//     settings: ["Admin"],
//   };
  
//   useEffect(() => {
//     console.log("useridd " + canSee["approval"].includes(role));
//   });
  
//   const isVisible = (screen: keyof typeof canSee) => {
//     const roles = canSee[screen as keyof typeof canSee];
//     return roles?.includes(role?.toLowerCase()); 
//   };
  
//   const hiddenStyle = { display: "none" as const };

//   const visibleStyle = {
//     borderRadius: RADIUS.md,
//     marginHorizontal: 8,
//     marginVertical: 2,
//     paddingLeft: 8,
//   };
  
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         drawerContent={(props) => <CustomDrawer {...props} />}
//         screenOptions={{
//           headerShown: true,
//           headerStyle: { backgroundColor: COLORS.primaryDark },
//           headerTintColor: COLORS.textLight,
//           headerTitleStyle: {
//             fontWeight: "600",
//             fontSize: 18,
//           },
//           headerShadowVisible: false,
//           drawerActiveBackgroundColor: COLORS.primaryLight,
//           drawerActiveTintColor: COLORS.primaryDark,
//           drawerInactiveTintColor: COLORS.textSecondary,
//           drawerLabelStyle: {
//             fontSize: 14,
//             fontWeight: "500",
//             marginLeft: -8,
//           },
//         }}>

//         {/* Dashboard */}
//         <Drawer.Screen
//           name="dashboard"
//           options={{
//             drawerLabel: "Dashboard",
//             title: "Dashboard",
//             drawerIcon: ({ color }) => (
//               <Ionicons name="grid-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("dashboard")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         {/* Orders */}
//         <Drawer.Screen
//           name="orders/orderlist"
//           options={{
//             drawerLabel: "Orders",
//             title: "Orders",
//             drawerIcon: ({ color }) => (
//               <Ionicons
//                 name="document-text-outline"
//                 size={22}
//                 color={color}
//               />
//             ),
//             drawerItemStyle: isVisible("orders")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         {/* Create Order */}
//         <Drawer.Screen
//           name="orders/create"
//           options={{
//             drawerLabel: "Create Order",
//             title: "Create Order",
//             drawerIcon: ({ color }) => (
//               <Ionicons name="add-circle-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("orders/create")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         {/* New User */}
//         <Drawer.Screen
//           name="users/create"
//           options={{
//             drawerLabel: "New User",
//             title: "New User",
//             drawerIcon: ({ color }) => (
//               <Ionicons name="person-add-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("users/create")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         {/* Reports */}
//         <Drawer.Screen
//           name="reports"
//           options={{
//             drawerLabel: "Reports",
//             title: "Reports",
//             drawerIcon: ({ color }) => (
//               <Ionicons name="bar-chart-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("reports")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         {/* Settings */}
//         <Drawer.Screen
//           name="settings"
//           options={{
//             drawerLabel: "Settings",
//             title: "Settings",
//             drawerIcon: ({ color }) => (
//               <Ionicons name="settings-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("settings")
//               ? visibleStyle
//               : hiddenStyle,
//           }}
//         />

//         <Drawer.Screen
//           name="approver"
//           options={{
//             drawerLabel: "Pending Approvals",
//             title: "Pending Approvals",
//             headerShown: true,  
//             drawerIcon: ({ color }) => (
//               <Ionicons name="checkmark-done-outline" size={22} color={color} />
//             ),
//             drawerItemStyle: isVisible("approval") ? visibleStyle : hiddenStyle,
//           }}
//         />

//       </Drawer>
//     </GestureHandlerRootView>
//   );

// }
 