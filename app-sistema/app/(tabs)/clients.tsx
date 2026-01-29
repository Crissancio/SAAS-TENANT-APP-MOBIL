import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Dialog } from "../../components/ui/Dialog";
import { AlertDialog } from "../../components/ui/AlertDialog";
import { Toast } from "../../components/ui/Toast";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";

// Tipado para cliente
type Client = {
  id: string;
  name: string;
  document: string;
  phone: string;
  email?: string;
  active: boolean;
};

const initialClients: Client[] = [
  {
    id: "1",
    name: "Juan Pérez García",
    document: "1234567",
    phone: "71234567",
    email: "juan.perez@email.com",
    active: true,
  },
  {
    id: "2",
    name: "María López Rodríguez",
    document: "7654321",
    phone: "72345678",
    email: "maria.lopez@email.com",
    active: true,
  },
  {
    id: "3",
    name: "Carlos Mendoza Silva",
    document: "5555555",
    phone: "73456789",
    email: "carlos.mendoza@email.com",
    active: false,
  },
];

const ClientsScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", document: "", phone: "", email: "" });
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({ visible: false, message: "" });

  const filteredClients = clients.filter(
    (client: Client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.document.includes(searchQuery)
  );

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        document: client.document,
        phone: client.phone,
        email: client.email ?? "",
      });
    } else {
      setEditingClient(null);
      setFormData({ name: "", document: "", phone: "", email: "" });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingClient(null);
    setFormData({ name: "", document: "", phone: "", email: "" });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.document || !formData.phone) {
      setToast({ visible: true, message: "Complete los campos obligatorios", type: "error" });
      return;
    }
    if (editingClient) {
      setClients((prev: Client[]) =>
        prev.map((c: Client) => (c.id === editingClient.id ? { ...c, ...formData } : c))
      );
      setToast({ visible: true, message: "Cliente editado", type: "success" });
    } else {
      setClients((prev: Client[]) => [
        ...prev,
        { ...formData, id: Date.now().toString(), active: true },
      ]);
      setToast({ visible: true, message: "Cliente creado", type: "success" });
    }
    handleCloseDialog();
  };

  const handleToggleActive = (client: Client) => {
    setClients((prev: Client[]) =>
      prev.map((c: Client) => (c.id === client.id ? { ...c, active: !c.active } : c))
    );
    setToast({
      visible: true,
      message: client.active ? "Cliente desactivado" : "Cliente activado",
      type: "success",
    });
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    setClients((prev: Client[]) => prev.filter((c: Client) => c.id !== clientToDelete));
    setDeleteDialogOpen(false);
    setClientToDelete(null);
    setToast({ visible: true, message: "Cliente eliminado", type: "success" });
  };

  return (
    <View style={styles.container}>
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clientes</Text>
        <Button onPress={() => handleOpenDialog()} style={styles.addBtn}>
          <Ionicons name="person-add" size={18} color="#FFF" style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>Nuevo</Text>
        </Button>
      </View>
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#FFF" style={{ marginLeft: 8, marginRight: 4 }} />
        <Input
          placeholder="Buscar por nombre o documento..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#FFFFFF"
        />
      </View>
      <View style={styles.divider} />
      {/* Lista de clientes */}
      <ScrollView style={styles.list}>
        {filteredClients.length === 0 ? (
          <Text style={styles.emptyText}>No se encontraron clientes</Text>
        ) : (
          filteredClients.map((client: Client) => (
            <Card key={client.id} style={styles.card}>
              <CardContent style={styles.cardContentColumn}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Badge style={client.active ? styles.activeBadge : styles.inactiveBadge}>
                    <Text style={styles.badgeText}>{client.active ? "Activo" : "Inactivo"}</Text>
                  </Badge>
                </View>
                <View style={styles.cardInfoColumn}>
                  <Text style={styles.clientDoc}>Doc: {client.document}</Text>
                  <Text style={styles.clientPhone}>Tel: {client.phone}</Text>
                  {client.email && <Text style={styles.clientEmail}>Email: {client.email}</Text>}
                </View>
                <View style={styles.cardButtonsRow}>
                  <Button variant="outline" style={styles.actionBtn} onPress={() => handleOpenDialog(client)}>
                    <Feather name="edit" size={16} color="#F5F7FA" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnText}>Editar</Text>
                  </Button>
                  <Button variant="outline" style={styles.actionBtn} onPress={() => handleToggleActive(client)}>
                    <Feather name={client.active ? "user-x" : "user-check"} size={16} color="#F5F7FA" style={{ marginRight: 4 }} />
                    <Text style={styles.actionBtnText}>{client.active ? "Desactivar" : "Activar"}</Text>
                  </Button>
                  <Button variant="outline" style={styles.deleteBtn} onPress={() => handleDeleteClick(client.id)}>
                    <Feather name="trash-2" size={16} color="#E74C3C" style={{ marginRight: 4 }} />
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Dialogo para agregar/editar */}
      <Dialog visible={showDialog} onClose={handleCloseDialog} style={styles.dialogModal}>
        <Text style={styles.dialogTitle}>{editingClient ? "Editar cliente" : "Nuevo cliente"}</Text>
        <Text style={styles.dialogSubtitle}>Complete los datos del cliente</Text>
        <Label style={styles.dialogLabel}>Nombre completo *</Label>
        <Input value={formData.name} onChangeText={(text) => setFormData((f) => ({ ...f, name: text }))} style={styles.dialogInput} placeholder="Nombre completo" placeholderTextColor="#A3B3BF" />
        <Label style={styles.dialogLabel}>NIT / CI *</Label>
        <Input value={formData.document} onChangeText={(text) => setFormData((f) => ({ ...f, document: text }))} style={styles.dialogInput} placeholder="NIT / CI" placeholderTextColor="#A3B3BF" />
        <Label style={styles.dialogLabel}>Teléfono *</Label>
        <Input value={formData.phone} onChangeText={(text) => setFormData((f) => ({ ...f, phone: text }))} style={styles.dialogInput} placeholder="Teléfono" placeholderTextColor="#A3B3BF" />
        <Label style={styles.dialogLabel}>Email</Label>
        <Input value={formData.email} onChangeText={(text) => setFormData((f) => ({ ...f, email: text }))} style={styles.dialogInput} placeholder="Email" placeholderTextColor="#A3B3BF" />
        <View style={styles.dialogBtnRow}>
          <Button onPress={handleSubmit} style={styles.saveBtn}>{editingClient ? "Guardar" : "Crear"}</Button>
          <Button variant="outline" onPress={handleCloseDialog} style={styles.cancelBtn}>Cancelar</Button>
        </View>
      </Dialog>

      {/* Dialogo de confirmación de borrado */}
      <AlertDialog
        visible={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar cliente?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
    </View>
  );
};

export default ClientsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#08232A", paddingTop: 28 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 },
  headerTitle: { color: "#FFFFFF", fontSize: 15, letterSpacing: 0.1 },
  addBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#1CA085", paddingHorizontal: 18, paddingVertical: 7, borderRadius: 10, height: 36 },
  addBtnText: { color: "#FFFFFF", marginLeft: 6, fontSize: 15, letterSpacing: 0.1 },
  divider: { height: 1, backgroundColor: "#15545A", marginHorizontal: 0, marginBottom: 16, marginTop: 16 },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#0A3A40", borderRadius: 10, borderWidth: 1, borderColor: "#15545A", marginHorizontal: 16, marginBottom: 4, height: 38 },
  searchInput: { flex: 1, color: "#FFFFFF", fontSize: 15, paddingHorizontal: 10, backgroundColor: "transparent" , borderWidth: 0 },
  list: { flex: 1, paddingHorizontal: 10 },
  emptyText: { color: "#B6C2CF", textAlign: "center", marginTop: 32, fontSize: 15 },
  card: { marginBottom: 18, backgroundColor: "#0A3A40", borderRadius: 14, padding: 0, shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 6, borderWidth: 1, borderColor: "#15545A" },
  cardContentColumn: { flexDirection: "column", alignItems: "stretch", justifyContent: "flex-start", padding: 16, gap: 10 },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  cardInfoColumn: { flexDirection: "column", alignItems: "flex-start", gap: 0, marginBottom: 10 },
  cardButtonsRow: { flexDirection: "row", alignItems: "center", justifyContent: "flex-start"},
  actionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#0F2326", borderRadius: 8, height: 24, paddingHorizontal: 12, borderWidth: 0, flexBasis: "40.5%", minWidth: 0, marginRight: 10 },
  actionBtnText: { color: "#FFFFFF", fontSize: 14, letterSpacing: 0.1 },
  deleteBtn: { backgroundColor: "#0F2326", borderRadius: 8, borderWidth: 0, flexBasis: "10%", justifyContent: "center", alignItems: "center", marginRight: 0, height: 24 },
  activeBadge: { backgroundColor: "#1D7373", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 3, alignSelf: "flex-start" },
  inactiveBadge: { backgroundColor: "#C94A4A", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 3, alignSelf: "flex-start" },
  badgeText: { color: "#fff", fontSize: 12 },
  clientName: { color: "#FFFFFF", fontSize: 16, marginBottom: 2, letterSpacing: 0.1 },
  clientDoc: { color: "#FFFFFF", fontSize: 14 },
  clientPhone: { color: "#FFFFFF", fontSize: 14 },
  clientEmail: { color: "#FFFFFF", fontSize: 14 },

  dialogModal: {
    backgroundColor: "#0A3A40",
    borderRadius: 20,
    padding: 32,
    margin: 0,
    width: "100%",
    minHeight: 420,
    alignSelf: "stretch",
    justifyContent: "flex-start",
  },
  dialogTitle: { color: "#FFFFFF", fontSize: 20, letterSpacing: 0.1, textAlign: "left", marginBottom: 2 },
  dialogSubtitle: { color: "#B6C2CF", fontSize: 15, marginBottom: 18, textAlign: "left" },
  dialogLabel: { color: "#FFFFFF", fontSize: 15, marginBottom: 2, marginTop: 12 },
  dialogInput: {
    marginBottom: 12,
    backgroundColor: "#08232A",
    color: "#FFFFFF",
    borderRadius: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#15545A",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dialogBtnRow: { flexDirection: "column", gap: 8, marginTop: 18 },
  saveBtn: { backgroundColor: "#1CA085", marginLeft: 0, borderRadius: 8, height: 40, justifyContent: "center", alignItems: "center" },
  cancelBtn: { backgroundColor: "#0F2326", borderColor: "#0F2326", marginLeft: 0, borderRadius: 8, height: 40, justifyContent: "center", alignItems: "center" },
});
