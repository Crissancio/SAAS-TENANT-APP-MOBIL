import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

const TABS = [
  { key: "ventas", label: "Ventas", icon: <Feather name="shopping-cart" size={24} /> },
  { key: "productos", label: "Productos", icon: <Feather name="package" size={24} /> },
  { key: "clientes", label: "Clientes", icon: <Feather name="users" size={24} /> },
  { key: "notificaciones", label: "Alertas", icon: <Ionicons name="notifications-outline" size={24} /> },
  { key: "perfil", label: "Perfil", icon: <Feather name="user" size={24} /> },
];

export default function BottomTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (key: string) => void;
}) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            {React.cloneElement(tab.icon, {
              color: isActive ? "#107361" : "#E6EAEA",
            })}
            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#0A3A40",
    height: 64,
    borderTopWidth: 1,
    borderTopColor: "#1A4A50",
    justifyContent: "space-around",
    alignItems: "center",
    // Quitar border radius para que la división sea recta
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 60,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
    letterSpacing: 0.1,
  },
  activeLabel: {
    color: "#107361",
  },
  inactiveLabel: {
    color: "#E6EAEA",
  },
});
