import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Image,
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { Toast } from "../../components/ui/Toast";
import type { Producto, Stock } from "../../types";
import { getProductosActivosPorMicroempresa, getStockPorMicroempresa } from "../../services/api";

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

// Tipo combinado
interface ItemInventario {
  producto: Producto;
  stock: Stock | null;
  cantidad: number;
  stockMinimo: number;
  estado: "ok" | "bajo" | "sin";
}

type FilterType = "todos" | "ok" | "bajo" | "sin";

const InventoryScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Estados
  const [inventario, setInventario] = useState<ItemInventario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("todos");
  const [selectedItem, setSelectedItem] = useState<ItemInventario | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({
    visible: false,
    message: ""
  });

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Cargar inventario (productos + stock)
  const loadInventario = useCallback(async () => {
    if (!user?.microempresa?.id_microempresa) return;

    try {
      setLoading(true);
      const idMicro = user.microempresa.id_microempresa.toString();

      // Cargar productos y stock en paralelo
      const [productosRes, stockRes] = await Promise.all([
        getProductosActivosPorMicroempresa(idMicro),
        getStockPorMicroempresa(idMicro),
      ]);

      // Crear mapa de stock por producto
      const stockMap = new Map<number, Stock>();
      (stockRes.data || []).forEach((s: Stock) => {
        stockMap.set(s.id_producto, s);
      });

      // Combinar productos con stock
      const items: ItemInventario[] = (productosRes.data || []).map((p: Producto) => {
        const stock = stockMap.get(p.id_producto);
        const cantidad = stock?.cantidad ?? 0;
        const stockMinimo = stock?.stock_minimo ?? 0;

        let estado: "ok" | "bajo" | "sin" = "ok";
        if (cantidad === 0) estado = "sin";
        else if (cantidad <= stockMinimo) estado = "bajo";

        return {
          producto: p,
          stock,
          cantidad,
          stockMinimo,
          estado,
        };
      });

      setInventario(items);
    } catch (error) {
      console.error("Error cargando inventario:", error);
      setToast({ visible: true, message: "Error al cargar inventario", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [user?.microempresa?.id_microempresa]);

  useEffect(() => {
    loadInventario();
  }, [loadInventario]);

  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInventario();
    setRefreshing(false);
  };

  // Filtrar inventario
  const filteredInventario = useMemo(() => {
    return inventario.filter((item) => {
      const matchSearch = item.producto.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      if (filter === "ok") return matchSearch && item.estado === "ok";
      if (filter === "bajo") return matchSearch && item.estado === "bajo";
      if (filter === "sin") return matchSearch && item.estado === "sin";
      return matchSearch;
    });
  }, [inventario, searchQuery, filter]);

  // Estadísticas
  const stats = useMemo(() => ({
    total: inventario.length,
    ok: inventario.filter(i => i.estado === "ok").length,
    bajo: inventario.filter(i => i.estado === "bajo").length,
    sin: inventario.filter(i => i.estado === "sin").length,
  }), [inventario]);

  // URL de imagen
  const getImageUrl = (imagen?: string) => {
    if (!imagen) return null;
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
    return `${baseUrl}${imagen}`;
  };

  // Render item de la lista
  const renderItem = ({ item }: { item: ItemInventario }) => {
    const statusColor = item.estado === "sin" ? COLORS.error
      : item.estado === "bajo" ? COLORS.warning
        : COLORS.success;

    const statusText = item.estado === "sin" ? "Sin stock"
      : item.estado === "bajo" ? "Stock bajo"
        : "En stock";

    const porcentaje = item.stockMinimo > 0
      ? Math.min((item.cantidad / (item.stockMinimo * 2)) * 100, 100)
      : item.cantidad > 0 ? 100 : 0;

    const imageUrl = getImageUrl(item.producto.imagen);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedItem(item)}
        activeOpacity={0.7}
      >
        {/* Imagen */}
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <MaterialCommunityIcons name="package-variant" size={28} color={COLORS.muted} />
          )}
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={styles.nombre} numberOfLines={1}>{item.producto.nombre}</Text>

          <Text style={styles.precio}>
            Bs. {item.producto.precio_venta?.toFixed(2) || "0.00"}
          </Text>

          {/* Stock info */}
          <View style={styles.stockRow}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>Actual</Text>
              <Text style={[styles.stockValue, { color: statusColor }]}>{item.cantidad}</Text>
            </View>
            <View style={styles.stockDivider} />
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>Mínimo</Text>
              <Text style={styles.stockMinValue}>{item.stockMinimo}</Text>
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBg}>
            <View style={[styles.progressBar, { width: `${porcentaje}%`, backgroundColor: statusColor }]} />
          </View>
        </View>

        {/* Badge de estado */}
        <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
          <Ionicons
            name={item.estado === "sin" ? "alert-circle" : item.estado === "bajo" ? "alert" : "checkmark-circle"}
            size={14}
            color={statusColor}
          />
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && inventario.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando inventario...</Text>
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
        <Text style={styles.headerTitle}>Inventario</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
          <Feather name="refresh-cw" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: COLORS.success }]}>
          <Text style={styles.statNumber}>{stats.ok}</Text>
          <Text style={styles.statLabel}>En stock</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.warning }]}>
          <Text style={styles.statNumber}>{stats.bajo}</Text>
          <Text style={styles.statLabel}>Stock bajo</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: COLORS.error }]}>
          <Text style={styles.statNumber}>{stats.sin}</Text>
          <Text style={styles.statLabel}>Sin stock</Text>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={COLORS.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar producto..."
          placeholderTextColor={COLORS.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Feather name="x" size={18} color={COLORS.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros */}
      <View style={styles.filterRow}>
        {([
          { key: "todos", label: "Todos", count: stats.total },
          { key: "ok", label: "En stock", count: stats.ok },
          { key: "bajo", label: "Bajo", count: stats.bajo },
          { key: "sin", label: "Sin stock", count: stats.sin },
        ] as const).map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
            <View style={[styles.filterBadge, filter === f.key && styles.filterBadgeActive]}>
              <Text style={[styles.filterBadgeText, filter === f.key && styles.filterBadgeTextActive]}>
                {f.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filteredInventario}
        renderItem={renderItem}
        keyExtractor={(item) => item.producto.id_producto.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant" size={48} color={COLORS.muted} />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No se encontraron productos"
                : filter !== "todos"
                  ? `No hay productos con este estado`
                  : "No hay productos en inventario"
              }
            </Text>
          </View>
        }
      />

      {/* Modal de detalle */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Detalle de Producto</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.modalContent}>
              {/* Imagen grande */}
              <View style={styles.modalImageContainer}>
                {getImageUrl(selectedItem.producto.imagen) ? (
                  <Image
                    source={{ uri: getImageUrl(selectedItem.producto.imagen) || '' }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                ) : (
                  <MaterialCommunityIcons name="package-variant" size={80} color={COLORS.muted} />
                )}
              </View>

              {/* Info del producto */}
              <Text style={styles.modalProductName}>{selectedItem.producto.nombre}</Text>

              {selectedItem.producto.descripcion && (
                <Text style={styles.modalDescription}>{selectedItem.producto.descripcion}</Text>
              )}

              <Text style={styles.modalPrice}>
                Bs. {selectedItem.producto.precio_venta?.toFixed(2) || "0.00"}
              </Text>

              {/* Stock info */}
              <View style={styles.modalStockCard}>
                <View style={styles.modalStockRow}>
                  <View style={styles.modalStockItem}>
                    <Text style={styles.modalStockLabel}>Stock Actual</Text>
                    <Text style={[
                      styles.modalStockValue,
                      {
                        color: selectedItem.estado === "sin" ? COLORS.error
                          : selectedItem.estado === "bajo" ? COLORS.warning
                            : COLORS.success
                      }
                    ]}>
                      {selectedItem.cantidad}
                    </Text>
                  </View>
                  <View style={styles.modalStockItem}>
                    <Text style={styles.modalStockLabel}>Stock Mínimo</Text>
                    <Text style={styles.modalStockMinValue}>{selectedItem.stockMinimo}</Text>
                  </View>
                </View>

                {/* Estado */}
                <View style={[
                  styles.modalStatusBadge,
                  {
                    backgroundColor: (selectedItem.estado === "sin" ? COLORS.error
                      : selectedItem.estado === "bajo" ? COLORS.warning
                        : COLORS.success) + "22"
                  }
                ]}>
                  <Ionicons
                    name={selectedItem.estado === "sin" ? "alert-circle"
                      : selectedItem.estado === "bajo" ? "alert"
                        : "checkmark-circle"}
                    size={18}
                    color={selectedItem.estado === "sin" ? COLORS.error
                      : selectedItem.estado === "bajo" ? COLORS.warning
                        : COLORS.success}
                  />
                  <Text style={[
                    styles.modalStatusText,
                    {
                      color: selectedItem.estado === "sin" ? COLORS.error
                        : selectedItem.estado === "bajo" ? COLORS.warning
                          : COLORS.success
                    }
                  ]}>
                    {selectedItem.estado === "sin" ? "Sin stock"
                      : selectedItem.estado === "bajo" ? "Stock bajo - Requiere reposición"
                        : "Nivel de stock correcto"}
                  </Text>
                </View>

                {/* Última actualización */}
                {selectedItem.stock?.ultima_actualizacion && (
                  <Text style={styles.modalLastUpdate}>
                    Última actualización: {new Date(selectedItem.stock.ultima_actualizacion).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

export default InventoryScreen;

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
  headerTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700"
  },
  refreshBtn: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  filterBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 12,
  },
  filterTextActive: {
    color: COLORS.text,
    fontWeight: "500",
  },
  filterBadge: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
  },
  filterBadgeActive: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  filterBadgeText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "600",
  },
  filterBadgeTextActive: {
    color: COLORS.text,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  // Card de producto
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
  },
  nombre: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 2,
  },
  precio: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 6,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  stockInfo: {
    alignItems: "center",
  },
  stockLabel: {
    color: COLORS.muted,
    fontSize: 9,
    marginBottom: 1,
  },
  stockValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  stockMinValue: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  stockDivider: {
    width: 1,
    height: 18,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  progressBg: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  badge: {
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "600",
    textAlign: "center",
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

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
    alignItems: "center",
  },
  modalImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalProductName: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  modalDescription: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  modalPrice: {
    color: COLORS.success,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  modalStockCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalStockRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  modalStockItem: {
    alignItems: "center",
  },
  modalStockLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  modalStockValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  modalStockMinValue: {
    color: COLORS.muted,
    fontSize: 28,
    fontWeight: "600",
  },
  modalStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    marginBottom: 12,
  },
  modalStatusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  modalLastUpdate: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
  },
});
