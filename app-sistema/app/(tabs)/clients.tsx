import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { Toast } from "../../components/ui/Toast";
import { ClientCard } from "../../components/ClientCard";
import type { Cliente, ClienteCreate } from "../../types";
import {
  getClientesPorMicroempresa,
  crearCliente,
  actualizarCliente,
  bajaLogicaCliente,
  habilitarCliente
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
  error: "#EF4444",
};

const ClientsScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({ nombre: "", documento: "", telefono: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({
    visible: false,
    message: ""
  });
  const [filter, setFilter] = useState<"todos" | "activos" | "inactivos">("todos");

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Cargar clientes desde el backend
  const loadClientes = useCallback(async () => {
    if (!user?.microempresa?.id_microempresa) return;

    try {
      setLoading(true);
      const response = await getClientesPorMicroempresa(
        user.microempresa.id_microempresa.toString()
      );
      setClientes(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      setToast({ visible: true, message: "Error al cargar clientes", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [user?.microempresa?.id_microempresa]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadClientes();
    setRefreshing(false);
  };

  // Filtrar clientes
  const filteredClientes = clientes.filter((cliente) => {
    // Filtro de búsqueda
    const matchSearch =
      cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cliente.documento?.includes(searchQuery) ?? false);

    // Filtro de estado
    if (filter === "activos") return matchSearch && cliente.estado;
    if (filter === "inactivos") return matchSearch && !cliente.estado;
    return matchSearch;
  });

  // Abrir diálogo
  const handleOpenDialog = (cliente?: Cliente) => {
    if (cliente) {
      setEditingClient(cliente);
      setFormData({
        nombre: cliente.nombre,
        documento: cliente.documento ?? "",
        telefono: cliente.telefono ?? "",
        email: cliente.email ?? "",
      });
    } else {
      setEditingClient(null);
      setFormData({ nombre: "", documento: "", telefono: "", email: "" });
    }
    setShowDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingClient(null);
    setFormData({ nombre: "", documento: "", telefono: "", email: "" });
  };

  // Guardar cliente
  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      setToast({ visible: true, message: "El nombre es obligatorio", type: "error" });
      return;
    }
    if (!user?.microempresa?.id_microempresa) {
      setToast({ visible: true, message: "Error: sin microempresa", type: "error" });
      return;
    }

    setSubmitting(true);
    try {
      if (editingClient) {
        // Editar cliente existente
        await actualizarCliente(editingClient.id_cliente.toString(), {
          id_microempresa: user.microempresa.id_microempresa,
          nombre: formData.nombre,
          documento: formData.documento || undefined,
          telefono: formData.telefono || undefined,
          email: formData.email || undefined,
        });
        setToast({ visible: true, message: "Cliente actualizado", type: "success" });
      } else {
        // Crear nuevo cliente
        const nuevoCliente: ClienteCreate = {
          id_microempresa: user.microempresa.id_microempresa,
          nombre: formData.nombre,
          documento: formData.documento || undefined,
          telefono: formData.telefono || undefined,
          email: formData.email || undefined,
        };
        await crearCliente(nuevoCliente);
        setToast({ visible: true, message: "Cliente creado", type: "success" });
      }
      handleCloseDialog();
      await loadClientes();
    } catch (error: any) {
      console.error("Error guardando cliente:", error);
      setToast({
        visible: true,
        message: error.response?.data?.detail || "Error al guardar",
        type: "error"
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Cambiar estado de cliente
  const handleToggleActive = async (cliente: Cliente) => {
    try {
      if (cliente.estado) {
        await bajaLogicaCliente(cliente.id_cliente.toString());
        setToast({ visible: true, message: "Cliente desactivado", type: "success" });
      } else {
        await habilitarCliente(cliente.id_cliente.toString());
        setToast({ visible: true, message: "Cliente activado", type: "success" });
      }
      await loadClientes();
    } catch (error) {
      console.error("Error cambiando estado:", error);
      setToast({ visible: true, message: "Error al cambiar estado", type: "error" });
    }
  };

  // Render item de la lista
  const renderItem = ({ item }: { item: Cliente }) => (
    <ClientCard
      cliente={item}
      onPress={() => {
        Alert.alert(
          item.nombre,
          `Documento: ${item.documento || "N/A"}\nTeléfono: ${item.telefono || "N/A"}\nEmail: ${item.email || "N/A"}`,
          [
            { text: "Cerrar", style: "cancel" },
            { text: item.estado ? "Desactivar" : "Activar", onPress: () => handleToggleActive(item) },
            { text: "Editar", onPress: () => handleOpenDialog(item) },
          ]
        );
      }}
      onEdit={() => handleOpenDialog(item)}
    />
  );

  if (loading && clientes.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Cargando clientes...</Text>
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
        <Text style={styles.headerTitle}>Clientes</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => handleOpenDialog()}>
          <Ionicons name="person-add" size={18} color="#FFF" />
          <Text style={styles.addBtnText}>Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color={COLORS.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o documento..."
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
        {(["todos", "activos", "inactivos"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Contador */}
      <Text style={styles.countText}>
        {filteredClientes.length} cliente{filteredClientes.length !== 1 ? "s" : ""}
      </Text>

      {/* Lista */}
      <FlatList
        data={filteredClientes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id_cliente.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={COLORS.muted} />
            <Text style={styles.emptyText}>
              {searchQuery ? "No se encontraron clientes" : "No hay clientes registrados"}
            </Text>
          </View>
        }
      />

      {/* Diálogo para agregar/editar */}
      <Dialog visible={showDialog} onClose={handleCloseDialog} style={styles.dialog}>
        <Text style={styles.dialogTitle}>
          {editingClient ? "Editar cliente" : "Nuevo cliente"}
        </Text>

        <Text style={styles.label}>Nombre completo *</Text>
        <TextInput
          style={styles.input}
          value={formData.nombre}
          onChangeText={(text) => setFormData((f) => ({ ...f, nombre: text }))}
          placeholder="Nombre completo"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.label}>Documento (CI/NIT)</Text>
        <TextInput
          style={styles.input}
          value={formData.documento}
          onChangeText={(text) => setFormData((f) => ({ ...f, documento: text }))}
          placeholder="Documento"
          placeholderTextColor={COLORS.muted}
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={formData.telefono}
          onChangeText={(text) => setFormData((f) => ({ ...f, telefono: text }))}
          placeholder="Teléfono"
          placeholderTextColor={COLORS.muted}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData((f) => ({ ...f, email: text }))}
          placeholder="Email"
          placeholderTextColor={COLORS.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.dialogButtons}>
          <Button
            onPress={handleSubmit}
            style={styles.saveBtn}
            disabled={submitting}
          >
            <Text style={styles.saveBtnText}>
              {submitting ? "Guardando..." : (editingClient ? "Guardar" : "Crear")}
            </Text>
          </Button>
          <TouchableOpacity onPress={handleCloseDialog} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </View>
  );
};

export default ClientsScreen;

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
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.button,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addBtnText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500"
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
    marginBottom: 8,
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
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
  countText: {
    color: COLORS.muted,
    fontSize: 13,
    paddingHorizontal: 16,
    marginBottom: 8,
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
  dialog: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
  },
  dialogTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dialogButtons: {
    marginTop: 20,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: COLORS.button,
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  saveBtnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  cancelBtn: {
    backgroundColor: "transparent",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: COLORS.muted,
    fontSize: 15,
  },
});
