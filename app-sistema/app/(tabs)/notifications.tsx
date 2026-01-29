import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { Toast } from "../../components/ui/Toast";
import { NotificationItem } from "../../components/NotificationItem";
import type { Notificacion } from "../../types";
import {
  getNotificacionesPorUsuario,
  marcarNotificacionLeida
} from "../../services/api";

// Colores del tema
const COLORS = {
  background: "#042326",
  card: "#0A3A40",
  border: "#15545A",
  primary: "#1D7373",
  button: "#107361",
  text: "#FFFFFF",
  muted: "#B6C2CF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

type FilterType = "todas" | "no_leidas" | "leidas";

const NotificationsScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Estados
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("todas");
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({
    visible: false,
    message: ""
  });

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Cargar notificaciones desde el backend
  const loadNotificaciones = useCallback(async () => {
    if (!user?.id_usuario) return;

    try {
      setLoading(true);
      const response = await getNotificacionesPorUsuario(
        user.id_usuario.toString()
      );
      // Ordenar por fecha más reciente
      const sorted = (response.data || []).sort((a: Notificacion, b: Notificacion) =>
        new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime()
      );
      setNotificaciones(sorted);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setToast({ visible: true, message: "Error al cargar notificaciones", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [user?.id_usuario]);

  useEffect(() => {
    loadNotificaciones();
  }, [loadNotificaciones]);

  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotificaciones();
    setRefreshing(false);
  };

  // Marcar como leída
  const handleMarkRead = async (notificacion: Notificacion) => {
    try {
      await marcarNotificacionLeida(notificacion.id_notificacion.toString());
      // Actualizar estado local
      setNotificaciones(prev =>
        prev.map(n =>
          n.id_notificacion === notificacion.id_notificacion
            ? { ...n, leido: true }
            : n
        )
      );
      setToast({ visible: true, message: "Notificación marcada como leída", type: "success" });
    } catch (error) {
      console.error("Error marcando como leída:", error);
      setToast({ visible: true, message: "Error al marcar como leída", type: "error" });
    }
  };

  // Marcar todas como leídas
  const handleMarkAllRead = async () => {
    const noLeidas = notificaciones.filter(n => !n.leido);
    if (noLeidas.length === 0) return;

    try {
      await Promise.all(
        noLeidas.map(n => marcarNotificacionLeida(n.id_notificacion.toString()))
      );
      setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })));
      setToast({ visible: true, message: "Todas las notificaciones marcadas como leídas", type: "success" });
    } catch (error) {
      setToast({ visible: true, message: "Error al marcar todas", type: "error" });
    }
  };

  // Filtrar notificaciones
  const filteredNotificaciones = notificaciones.filter((n) => {
    if (filter === "no_leidas") return !n.leido;
    if (filter === "leidas") return n.leido;
    return true;
  });

  // Contadores
  const noLeidasCount = notificaciones.filter(n => !n.leido).length;

  // Render item
  const renderItem = ({ item }: { item: Notificacion }) => (
    <NotificationItem
      notificacion={item}
      onPress={() => {
        if (!item.leido) handleMarkRead(item);
      }}
      onMarkRead={!item.leido ? () => handleMarkRead(item) : undefined}
    />
  );

  if (loading && notificaciones.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando notificaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notificaciones</Text>
          {noLeidasCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{noLeidasCount}</Text>
            </View>
          )}
        </View>
        {noLeidasCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead} style={styles.markAllBtn}>
            <Ionicons name="checkmark-done" size={18} color={COLORS.primary} />
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {([
          { key: "todas", label: "Todas" },
          { key: "no_leidas", label: "No leídas" },
          { key: "leidas", label: "Leídas" },
        ] as const).map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filteredNotificaciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_notificacion.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.muted} />
            <Text style={styles.emptyText}>
              {filter === "no_leidas"
                ? "No tienes notificaciones sin leer"
                : filter === "leidas"
                  ? "No hay notificaciones leídas"
                  : "No tienes notificaciones"
              }
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 48
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700"
  },
  headerBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  markAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  filterTextActive: {
    color: COLORS.text,
    fontWeight: "500",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 48,
  },
  emptyText: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 12,
    fontSize: 15
  },
});
