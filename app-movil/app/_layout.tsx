import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/contexts/AppContext";

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Login */}
        <Stack.Screen name="login" />

        {/* Tabs (ventas, clientes, inventario, etc) */}
        <Stack.Screen name="(tabs)" />

        {/* Modal eliminado: la ruta 'modal' no existe en el proyecto */}
      </Stack>
    </AppProvider>
  );
}