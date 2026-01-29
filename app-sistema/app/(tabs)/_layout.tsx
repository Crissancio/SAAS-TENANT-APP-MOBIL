
import React from "react";
import { View, StyleSheet } from "react-native";
import BottomTabs from "../../components/ui/BottomTabs";
import { useRouter, usePathname, Slot } from "expo-router";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // Determinar el tab activo según la ruta
  let activeTab = "ventas";
  if (pathname.startsWith("/clients")) activeTab = "clientes";
  else if (pathname.startsWith("/inventory")) activeTab = "inventario";
  else if (pathname.startsWith("/notifications")) activeTab = "notificaciones";
  else if (pathname.startsWith("/profile")) activeTab = "perfil";

  const handleTabChange = (key: string) => {
    if (key === "ventas") router.push("/ventas" as any);
    else if (key === "clientes") router.push("/clients" as any);
    else if (key === "inventario") router.push("/inventory" as any);
    else if (key === "notificaciones") router.push("/notifications" as any);
    else if (key === "perfil") router.push("/profile" as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <BottomTabs activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#222" },
  content: { flex: 1, paddingBottom: 64 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabText: { color: "#E6EAEA", fontSize: 24, fontWeight: "bold" },
});
