import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Search, UserPlus, Edit, Trash2, UserX, UserCheck } from "lucide-react-native";
import { toast } from "sonner";
import type { Client } from "../contexts/AppContext";

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    document: "",
    phone: "",
    email: "",
  });

  const filteredClients = clients.filter(
    (client) =>
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
        email: client.email,
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
      toast.error("Complete los campos obligatorios");
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);
      toast.success("Cliente actualizado");
    } else {
      addClient({ ...formData, active: true });
      toast.success("Cliente creado");
    }

    handleCloseDialog();
  };

  const handleToggleActive = (client: Client) => {
    updateClient(client.id, { active: !client.active });
    toast.success(client.active ? "Cliente desactivado" : "Cliente activado");
  };

  const handleDeleteClick = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      toast.success("Cliente eliminado");
      setClientToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={{ paddingTop: 24, paddingBottom: 12, borderBottomWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#fff" }}>
        <View style={{ paddingHorizontal: 16, maxWidth: 400, alignSelf: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#111" }}>Clientes</Text>
            <Button onPress={() => handleOpenDialog()} style={{ flexDirection: "row", alignItems: "center" }}>
              <UserPlus size={20} style={{ marginRight: 8 }} />
              Nuevo
            </Button>
          </View>
          {/* Buscador */}
          <View style={{ position: "relative", marginBottom: 0 }}>
            <Search size={20} style={{ position: "absolute", left: 12, top: 14 }} color="#6b7280" />
            <Input
              placeholder="Buscar por nombre o documento..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ paddingLeft: 40, backgroundColor: "#f3f4f6", color: "#111", borderColor: "#e5e7eb" }}
            />
          </View>
        </View>
      </View>

      {/* Lista de clientes */}
      <ScrollView contentContainerStyle={{ padding: 16, maxWidth: 400, alignSelf: "center" }}>
        <View style={{ gap: 12 }}>
          {filteredClients.map((client) => (
            <Card key={client.id} style={{ backgroundColor: "#fff", borderColor: "#e5e7eb" }}>
              <CardContent style={{ padding: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#111" }}>{client.name}</Text>
                      <Badge
                        variant={client.active ? "default" : "secondary"}
                        style={{ backgroundColor: client.active ? "#22c55e" : "#ef4444" }}
                      >
                        {client.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </View>
                    <Text style={{ fontSize: 14, color: "#6b7280" }}>Doc: {client.document}</Text>
                    <Text style={{ fontSize: 14, color: "#6b7280" }}>Tel: {client.phone}</Text>
                    {!!client.email && (
                      <Text style={{ fontSize: 14, color: "#6b7280" }}>Email: {client.email}</Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Button size="sm" variant="outline" onPress={() => handleOpenDialog(client)} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    <Edit size={16} style={{ marginRight: 4 }} />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" onPress={() => handleToggleActive(client)} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    {client.active ? (
                      <>
                        <UserX size={16} style={{ marginRight: 4 }} />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} style={{ marginRight: 4 }} />
                        Activar
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onPress={() => handleDeleteClick(client.id)} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Trash2 size={16} />
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
        {filteredClients.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <UserPlus size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={{ color: "#6b7280", marginBottom: 8 }}>No se encontraron clientes</Text>
            <Button onPress={() => handleOpenDialog()} variant="outline" style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}>
              <UserPlus size={16} style={{ marginRight: 8 }} />
              Crear primer cliente
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Dialog de crear/editar */}
      <Dialog visible={showDialog} onClose={handleCloseDialog}>
        <DialogHeader>
          <DialogTitle style={{ color: "#111" }}>{editingClient ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          <DialogDescription style={{ color: "#6b7280" }}>Complete los datos del cliente</DialogDescription>
        </DialogHeader>
        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Label htmlFor="name" style={{ color: "#111" }}>Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={{ backgroundColor: "#f3f4f6", color: "#111", borderColor: "#e5e7eb" }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="document" style={{ color: "#111" }}>NIT / CI *</Label>
            <Input
              id="document"
              value={formData.document}
              onChangeText={(text) => setFormData({ ...formData, document: text })}
              style={{ backgroundColor: "#f3f4f6", color: "#111", borderColor: "#e5e7eb" }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="phone" style={{ color: "#111" }}>Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              style={{ backgroundColor: "#f3f4f6", color: "#111", borderColor: "#e5e7eb" }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="email" style={{ color: "#111" }}>Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={{ backgroundColor: "#f3f4f6", color: "#111", borderColor: "#e5e7eb" }}
            />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={handleCloseDialog}>Cancelar</Button>
          <Button onPress={handleSubmit} style={{ backgroundColor: "#2563eb" }}>
            {editingClient ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Alert Dialog de confirmación de eliminación */}
      <AlertDialog visible={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => setDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirmDelete}>
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </View>
  );
}
