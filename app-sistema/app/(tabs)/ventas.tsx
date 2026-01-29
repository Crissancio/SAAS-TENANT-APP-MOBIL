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
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { Toast } from "../../components/ui/Toast";
import { Button } from "../../components/ui/Button";
import type { Producto, Stock, ItemCarrito, Cliente, VentaCreate, DetalleVenta, Categoria } from "../../types";
import {
  getProductosActivosPorMicroempresa,
  getCategoriasPorMicroempresa,
  getClientesActivosPorMicroempresa,
  crearVentaPresencial,
  getStockPorMicroempresa,
} from "../../services/api";

// Colores del tema
const COLORS = {
  background: "#042326",
  card: "#0A3A40",
  cardLight: "#0D4A52",
  border: "#15545A",
  primary: "#1D7373",
  button: "#107361",
  text: "#FFFFFF",
  muted: "#B6C2CF",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
};

// Tipo combinado de producto con stock
interface ProductoConStock extends Producto {
  stockActual: number;
  stockMinimo: number;
}

const VentasScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Estados principales
  const [productos, setProductos] = useState<ProductoConStock[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);

  // Estados del carrito
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [showCarrito, setShowCarrito] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [procesando, setProcesando] = useState(false);

  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({
    visible: false,
    message: ""
  });

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Cargar datos desde el backend
  const loadData = useCallback(async () => {
    if (!user?.microempresa?.id_microempresa) return;

    try {
      setLoading(true);
      const idMicro = user.microempresa.id_microempresa.toString();

      // Cargar productos, stock, categorías y clientes en paralelo
      const [productosRes, stockRes, categoriasRes, clientesRes] = await Promise.all([
        getProductosActivosPorMicroempresa(idMicro),
        getStockPorMicroempresa(idMicro),
        getCategoriasPorMicroempresa(idMicro).catch(() => ({ data: [] })),
        getClientesActivosPorMicroempresa(idMicro),
      ]);

      // Crear mapa de stock por producto
      const stockMap = new Map<number, Stock>();
      (stockRes.data || []).forEach((s: Stock) => {
        stockMap.set(s.id_producto, s);
      });

      // Combinar productos con su stock
      const productosConStock: ProductoConStock[] = (productosRes.data || []).map((p: Producto) => {
        const stock = stockMap.get(p.id_producto);
        return {
          ...p,
          stockActual: stock?.cantidad ?? 0,
          stockMinimo: stock?.stock_minimo ?? 0,
        };
      });

      setProductos(productosConStock);
      setCategorias(categoriasRes.data || []);
      setClientes(clientesRes.data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setToast({ visible: true, message: "Error al cargar catálogo", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [user?.microempresa?.id_microempresa]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Filtrar productos
  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategoria = !categoriaSeleccionada || p.id_categoria === categoriaSeleccionada;
      return matchSearch && matchCategoria;
    });
  }, [productos, searchQuery, categoriaSeleccionada]);

  // Calcular total del carrito
  const totalCarrito = useMemo(() => {
    return carrito.reduce((sum, item) => sum + (item.producto.precio_venta * item.cantidad), 0);
  }, [carrito]);

  // Cantidad total de items
  const itemsEnCarrito = useMemo(() => {
    return carrito.reduce((sum, item) => sum + item.cantidad, 0);
  }, [carrito]);

  // Agregar al carrito
  const agregarAlCarrito = (producto: ProductoConStock) => {
    const stockDisponible = producto.stockActual;

    if (stockDisponible <= 0) {
      setToast({ visible: true, message: "Producto sin stock", type: "error" });
      return;
    }

    setCarrito(prev => {
      const existente = prev.find(item => item.producto.id_producto === producto.id_producto);

      if (existente) {
        // Verificar stock
        if (existente.cantidad >= stockDisponible) {
          setToast({ visible: true, message: "Stock insuficiente", type: "info" });
          return prev;
        }
        // Incrementar cantidad
        return prev.map(item =>
          item.producto.id_producto === producto.id_producto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Agregar nuevo - crear objeto compatible con ItemCarrito
        const productoParaCarrito = {
          ...producto,
          stock: {
            id_stock: 0,
            id_producto: producto.id_producto,
            cantidad: producto.stockActual,
            stock_minimo: producto.stockMinimo,
            ultima_actualizacion: new Date().toISOString(),
          }
        };
        return [...prev, { producto: productoParaCarrito as any, cantidad: 1 }];
      }
    });

    setToast({ visible: true, message: `${producto.nombre} agregado`, type: "success" });
  };

  // Obtener cantidad en carrito de un producto
  const getCantidadEnCarrito = (idProducto: number) => {
    const item = carrito.find(i => i.producto.id_producto === idProducto);
    return item?.cantidad || 0;
  };

  // Modificar cantidad en carrito
  const modificarCantidad = (idProducto: number, delta: number) => {
    setCarrito(prev => {
      return prev.map(item => {
        if (item.producto.id_producto === idProducto) {
          const nuevaCantidad = item.cantidad + delta;
          const stockDisponible = (item.producto as any).stockActual ?? item.producto.stock?.cantidad ?? 0;

          if (nuevaCantidad <= 0) return null as any;
          if (nuevaCantidad > stockDisponible) {
            setToast({ visible: true, message: "Stock insuficiente", type: "info" });
            return item;
          }
          return { ...item, cantidad: nuevaCantidad };
        }
        return item;
      }).filter(Boolean);
    });
  };

  // Eliminar del carrito
  const eliminarDelCarrito = (idProducto: number) => {
    setCarrito(prev => prev.filter(item => item.producto.id_producto !== idProducto));
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    Alert.alert(
      "Vaciar carrito",
      "¿Estás seguro de vaciar el carrito?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Vaciar", style: "destructive", onPress: () => setCarrito([]) },
      ]
    );
  };

  // Procesar venta
  const procesarVenta = async () => {
    if (carrito.length === 0) return;
    if (!user?.microempresa?.id_microempresa) return;

    setProcesando(true);

    try {
      // Crear detalles de venta
      const detalles: DetalleVenta[] = carrito.map(item => ({
        id_producto: item.producto.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio_venta,
        subtotal: item.producto.precio_venta * item.cantidad,
      }));

      const venta: VentaCreate = {
        id_microempresa: user.microempresa.id_microempresa,
        id_cliente: clienteSeleccionado?.id_cliente,
        total: totalCarrito,
        estado: "PAGADA",
        tipo: "PRESENCIAL",
        detalles,
      };

      await crearVentaPresencial(
        user.microempresa.id_microempresa.toString(),
        venta
      );

      setToast({ visible: true, message: "¡Venta registrada exitosamente!", type: "success" });
      setCarrito([]);
      setClienteSeleccionado(null);
      setShowCheckout(false);
      setShowCarrito(false);

      // Recargar productos para actualizar stock
      await loadData();

    } catch (error: any) {
      console.error("Error procesando venta:", error);
      setToast({
        visible: true,
        message: error.response?.data?.detail || "Error al procesar venta",
        type: "error"
      });
    } finally {
      setProcesando(false);
    }
  };

  // URL de imagen del producto
  const getImageUrl = (imagen?: string) => {
    if (!imagen) return null;
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
    return `${baseUrl}${imagen}`;
  };

  // Render producto (diseño mejorado)
  const renderProducto = ({ item }: { item: ProductoConStock }) => {
    const cantidadEnCarrito = getCantidadEnCarrito(item.id_producto);
    const sinStock = item.stockActual <= 0;
    const imageUrl = getImageUrl(item.imagen);

    return (
      <TouchableOpacity
        style={[styles.productCard, sinStock && styles.productCardDisabled]}
        onPress={() => !sinStock && agregarAlCarrito(item)}
        activeOpacity={sinStock ? 1 : 0.7}
      >
        {/* Imagen */}
        <View style={styles.productImageContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productImagePlaceholder}>
              <Ionicons name="cube-outline" size={28} color={COLORS.muted} />
            </View>
          )}

          {/* Badge sin stock */}
          {sinStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Agotado</Text>
            </View>
          )}

          {/* Badge cantidad en carrito */}
          {cantidadEnCarrito > 0 && (
            <View style={styles.cartQuantityBadge}>
              <Text style={styles.cartQuantityText}>{cantidadEnCarrito}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.nombre}
          </Text>

          <View style={styles.productBottomRow}>
            <Text style={styles.productPrice}>
              Bs. {item.precio_venta.toFixed(2)}
            </Text>
            <View style={[
              styles.stockBadge,
              { backgroundColor: sinStock ? COLORS.error + "22" : COLORS.success + "22" }
            ]}>
              <Text style={[
                styles.stockBadgeText,
                { color: sinStock ? COLORS.error : COLORS.success }
              ]}>
                {item.stockActual} disp.
              </Text>
            </View>
          </View>
        </View>

        {/* Botón agregar */}
        {!sinStock && (
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => agregarAlCarrito(item)}
          >
            <Ionicons name="add" size={20} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && productos.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
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
        <Text style={styles.headerTitle}>Punto de Venta</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => setShowCarrito(true)}
        >
          <Ionicons name="cart" size={24} color={COLORS.text} />
          {itemsEnCarrito > 0 && (
            <View style={styles.headerCartBadge}>
              <Text style={styles.headerCartBadgeText}>{itemsEnCarrito}</Text>
            </View>
          )}
        </TouchableOpacity>
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

      {/* Categorías */}
      {categorias.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriasScroll}
          contentContainerStyle={styles.categoriasContent}
        >
          <TouchableOpacity
            style={[styles.categoriaChip, !categoriaSeleccionada && styles.categoriaChipActive]}
            onPress={() => setCategoriaSeleccionada(null)}
          >
            <Text style={[styles.categoriaText, !categoriaSeleccionada && styles.categoriaTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id_categoria}
              style={[styles.categoriaChip, categoriaSeleccionada === cat.id_categoria && styles.categoriaChipActive]}
              onPress={() => setCategoriaSeleccionada(cat.id_categoria)}
            >
              <Text style={[styles.categoriaText, categoriaSeleccionada === cat.id_categoria && styles.categoriaTextActive]}>
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Contador */}
      <Text style={styles.countText}>
        {filteredProductos.length} producto{filteredProductos.length !== 1 ? "s" : ""}
      </Text>

      {/* Lista de productos */}
      <FlatList
        data={filteredProductos}
        renderItem={renderProducto}
        keyExtractor={(item) => item.id_producto.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="package-variant" size={48} color={COLORS.muted} />
            <Text style={styles.emptyText}>No hay productos disponibles</Text>
          </View>
        }
      />

      {/* Barra flotante del carrito */}
      {itemsEnCarrito > 0 && (
        <TouchableOpacity
          style={styles.floatingCart}
          onPress={() => setShowCarrito(true)}
        >
          <View style={styles.floatingCartLeft}>
            <View style={styles.floatingCartBadge}>
              <Text style={styles.floatingCartBadgeText}>{itemsEnCarrito}</Text>
            </View>
            <Text style={styles.floatingCartText}>Ver carrito</Text>
          </View>
          <Text style={styles.floatingCartTotal}>Bs. {totalCarrito.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* Modal del carrito */}
      <Modal
        visible={showCarrito}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCarrito(false)}
      >
        <View style={styles.modalContainer}>
          {/* Header del modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCarrito(false)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Mi Carrito ({itemsEnCarrito})</Text>
            {carrito.length > 0 && (
              <TouchableOpacity onPress={limpiarCarrito} style={styles.modalCloseBtn}>
                <Ionicons name="trash-outline" size={22} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>

          {/* Lista del carrito */}
          {carrito.length === 0 ? (
            <View style={styles.emptyCart}>
              <Ionicons name="cart-outline" size={64} color={COLORS.muted} />
              <Text style={styles.emptyCartText}>El carrito está vacío</Text>
              <TouchableOpacity
                style={styles.emptyCartBtn}
                onPress={() => setShowCarrito(false)}
              >
                <Text style={styles.emptyCartBtnText}>Agregar productos</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView style={styles.carritoList}>
              {carrito.map((item) => (
                <View key={item.producto.id_producto} style={styles.carritoItem}>
                  {/* Imagen del producto en carrito */}
                  <View style={styles.carritoItemImage}>
                    {item.producto.imagen ? (
                      <Image
                        source={{ uri: getImageUrl(item.producto.imagen) || '' }}
                        style={styles.carritoItemImageContent}
                        resizeMode="cover"
                      />
                    ) : (
                      <Ionicons name="cube-outline" size={24} color={COLORS.muted} />
                    )}
                  </View>

                  <View style={styles.carritoItemInfo}>
                    <Text style={styles.carritoItemName} numberOfLines={1}>
                      {item.producto.nombre}
                    </Text>
                    <Text style={styles.carritoItemPrice}>
                      Bs. {item.producto.precio_venta.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.carritoItemActions}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => modificarCantidad(item.producto.id_producto, -1)}
                    >
                      <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.cantidad}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => modificarCantidad(item.producto.id_producto, 1)}
                    >
                      <Ionicons name="add" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.carritoItemSubtotal}>
                    Bs. {(item.producto.precio_venta * item.cantidad).toFixed(2)}
                  </Text>

                  <TouchableOpacity
                    onPress={() => eliminarDelCarrito(item.producto.id_producto)}
                    style={styles.deleteBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Footer del carrito */}
          {carrito.length > 0 && (
            <View style={styles.carritoFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total a pagar</Text>
                <Text style={styles.totalValue}>Bs. {totalCarrito.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => {
                  setShowCarrito(false);
                  setShowCheckout(true);
                }}
              >
                <Text style={styles.checkoutBtnText}>Continuar al pago</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      {/* Modal de Checkout */}
      <Modal
        visible={showCheckout}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCheckout(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCheckout(false)} style={styles.modalCloseBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Finalizar Venta</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.checkoutContent}>
            {/* Seleccionar cliente (opcional) */}
            <Text style={styles.sectionTitle}>Cliente (opcional)</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.clientesScroll}
            >
              <TouchableOpacity
                style={[styles.clienteChip, !clienteSeleccionado && styles.clienteChipActive]}
                onPress={() => setClienteSeleccionado(null)}
              >
                <Ionicons name="person-outline" size={16} color={!clienteSeleccionado ? COLORS.text : COLORS.muted} />
                <Text style={[styles.clienteChipText, !clienteSeleccionado && styles.clienteChipTextActive]}>
                  Sin cliente
                </Text>
              </TouchableOpacity>
              {clientes.map((cliente) => (
                <TouchableOpacity
                  key={cliente.id_cliente}
                  style={[styles.clienteChip, clienteSeleccionado?.id_cliente === cliente.id_cliente && styles.clienteChipActive]}
                  onPress={() => setClienteSeleccionado(cliente)}
                >
                  <Ionicons
                    name="person"
                    size={16}
                    color={clienteSeleccionado?.id_cliente === cliente.id_cliente ? COLORS.text : COLORS.muted}
                  />
                  <Text style={[
                    styles.clienteChipText,
                    clienteSeleccionado?.id_cliente === cliente.id_cliente && styles.clienteChipTextActive
                  ]}>
                    {cliente.nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Resumen */}
            <Text style={styles.sectionTitle}>Resumen de Venta</Text>
            <View style={styles.resumenCard}>
              {carrito.map((item) => (
                <View key={item.producto.id_producto} style={styles.resumenItem}>
                  <Text style={styles.resumenItemQty}>{item.cantidad}x</Text>
                  <Text style={styles.resumenItemName} numberOfLines={1}>{item.producto.nombre}</Text>
                  <Text style={styles.resumenItemPrice}>
                    Bs. {(item.producto.precio_venta * item.cantidad).toFixed(2)}
                  </Text>
                </View>
              ))}
              <View style={styles.resumenDivider} />
              <View style={styles.resumenTotal}>
                <Text style={styles.resumenTotalLabel}>TOTAL</Text>
                <Text style={styles.resumenTotalValue}>Bs. {totalCarrito.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Botón confirmar */}
          <View style={styles.checkoutFooter}>
            <TouchableOpacity
              style={[styles.confirmBtn, procesando && styles.confirmBtnDisabled]}
              onPress={procesarVenta}
              disabled={procesando}
            >
              {procesando ? (
                <ActivityIndicator size="small" color={COLORS.text} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color={COLORS.text} />
                  <Text style={styles.confirmBtnText}>Confirmar Venta</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VentasScreen;

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
  cartButton: {
    position: "relative",
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 10,
  },
  headerCartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCartBadgeText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
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
  categoriasScroll: {
    maxHeight: 40,
    marginBottom: 8,
  },
  categoriasContent: {
    paddingHorizontal: 16,
  },
  categoriaChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  categoriaChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoriaText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  categoriaTextActive: {
    color: COLORS.text,
    fontWeight: "500",
  },
  countText: {
    color: COLORS.muted,
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Producto card - diseño mejorado (lista vertical)
  productCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    alignItems: "center",
    padding: 10,
  },
  productCardDisabled: {
    opacity: 0.6,
  },
  productImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    overflow: "hidden",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  outOfStockBadge: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: COLORS.error,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfStockText: {
    color: COLORS.text,
    fontSize: 8,
    fontWeight: "600",
  },
  cartQuantityBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: COLORS.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cartQuantityText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "700",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  productBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: "700",
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  addToCartBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.button,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
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

  // Floating cart bar
  floatingCart: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.button,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingCartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  floatingCartBadge: {
    backgroundColor: COLORS.text,
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  floatingCartBadgeText: {
    color: COLORS.button,
    fontSize: 12,
    fontWeight: "700",
  },
  floatingCartText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  floatingCartTotal: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },

  // Modal styles
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
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyCartText: {
    color: COLORS.muted,
    fontSize: 16,
  },
  emptyCartBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  emptyCartBtnText: {
    color: COLORS.text,
    fontWeight: "500",
  },
  carritoList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  carritoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  carritoItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carritoItemImageContent: {
    width: "100%",
    height: "100%",
  },
  carritoItemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  carritoItemName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
  },
  carritoItemPrice: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  carritoItemActions: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: "center",
  },
  carritoItemSubtotal: {
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "600",
    minWidth: 60,
    textAlign: "right",
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 4,
  },
  carritoFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  totalLabel: {
    color: COLORS.muted,
    fontSize: 16,
  },
  totalValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "700",
  },
  checkoutBtn: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  checkoutBtnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },

  // Checkout styles
  checkoutContent: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  clientesScroll: {
    marginBottom: 20,
  },
  clienteChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    gap: 6,
  },
  clienteChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  clienteChipText: {
    color: COLORS.muted,
    fontSize: 13,
  },
  clienteChipTextActive: {
    color: COLORS.text,
    fontWeight: "500",
  },
  resumenCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resumenItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  resumenItemQty: {
    color: COLORS.muted,
    fontSize: 13,
    width: 30,
  },
  resumenItemName: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  resumenItemPrice: {
    color: COLORS.text,
    fontSize: 14,
  },
  resumenDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  resumenTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumenTotalLabel: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  resumenTotalValue: {
    color: COLORS.success,
    fontSize: 22,
    fontWeight: "700",
  },
  checkoutFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  confirmBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  confirmBtnDisabled: {
    opacity: 0.7,
  },
  confirmBtnText: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "600",
  },
});
