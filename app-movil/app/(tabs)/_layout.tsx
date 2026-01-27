import { Tabs, Redirect } from "expo-router";
import { ShoppingCart, Users, Package, Bell, User } from "lucide-react-native";
import { useApp } from "@/contexts/AppContext";
import { Colors } from "@/constants/theme";
import { Text } from "react-native";

export default function TabsLayout() {
  const { user } = useApp();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card, // #0A3A40
          borderTopColor: Colors.border, // rgba(245,247,248,0.1)
          height: 64,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.primary, // #107361
        tabBarInactiveTintColor: '#F5F7F8',
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              color: focused ? Colors.primary : '#F5F7F8',
              fontWeight: focused ? 'bold' : 'normal',
              fontSize: 13,
              marginTop: 2,
            }}
          >
            {(() => {
              switch (route.name) {
                case 'sales': return 'Ventas';
                case 'clients': return 'Clientes';
                case 'inventory': return 'Inventario';
                case 'notifications': return 'Notificaciones';
                case 'profile': return 'Perfil';
                default: return '';
              }
            })()}
          </Text>
        ),
      })}
    >
      <Tabs.Screen
        name="sales"
        options={{
          title: "Ventas",
          tabBarIcon: ({ color, focused }) => (
            <ShoppingCart size={26} color={focused ? Colors.primary : '#F5F7F8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color, focused }) => (
            <Users size={26} color={focused ? Colors.primary : '#F5F7F8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: "Inventario",
          tabBarIcon: ({ color, focused }) => (
            <Package size={26} color={focused ? Colors.primary : '#F5F7F8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color, focused }) => (
            <Bell size={26} color={focused ? Colors.primary : '#F5F7F8'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <User size={26} color={focused ? Colors.primary : '#F5F7F8'} />
          ),
        }}
      />
    </Tabs>
  );
}