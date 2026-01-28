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


// COLORES DEL TEMA (ajusta si tienes theme.ts)
const BG = '#05292E';
const CARD = '#0A3A40';
const BORDER = '#1B424A';
const PRIMARY = '#107361';
const TEXT = '#F5F7F8';
const TEXT_SECONDARY = '#B5C2C7';
const BADGE_ACTIVE_BG = '#22c55e';
const BADGE_ACTIVE_TEXT = '#fff';
const BADGE_INACTIVE_BG = '#ef4444';
const BADGE_INACTIVE_TEXT = '#fff';
const BUTTON_BG = 'transparent';
const BUTTON_BORDER = '#2DD4BF';
const BUTTON_TEXT = '#F5F7F8';
const INPUT_BG = '#0A3A40';
const INPUT_BORDER = '#1B424A';
const INPUT_TEXT = '#F5F7F8';
const PLACEHOLDER = '#B5C2C7';

export default function Clients() {
  const { clients, addClient, updateClient, deleteClient } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", document: "", phone: "", email: "" });

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
    <View style={{ flex: 1, backgroundColor: BG }}>
      {/* Header */}
      <View style={{ paddingTop: 24, paddingBottom: 12, borderBottomWidth: 0, backgroundColor: 'transparent' }}>
        <View style={{ paddingHorizontal: 12, maxWidth: 420, alignSelf: "center", width: '100%' }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: TEXT }}>Clientes</Text>
            <Button onPress={() => handleOpenDialog()} style={{ flexDirection: "row", alignItems: "center", backgroundColor: PRIMARY, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 6 }}>
              <UserPlus size={20} color={TEXT} style={{ marginRight: 8 }} />
              <Text style={{ color: TEXT, fontWeight: 'bold' }}>Nuevo</Text>
            </Button>
          </View>
          {/* Buscador */}
          <View style={{ position: "relative", marginBottom: 0 }}>
            <Search size={20} style={{ position: "absolute", left: 14, top: 14, zIndex: 1 }} color={PLACEHOLDER} />
            <Input
              placeholder="Buscar por nombre o documento..."
              placeholderTextColor={PLACEHOLDER}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ paddingLeft: 44, backgroundColor: INPUT_BG, color: INPUT_TEXT, borderColor: INPUT_BORDER, borderWidth: 1, borderRadius: 12, height: 44, fontSize: 15 }}
            />
          </View>
        </View>
      </View>

      {/* Lista de clientes */}
      <ScrollView contentContainerStyle={{ padding: 16, maxWidth: 420, alignSelf: "center", width: '100%' }}>
        <View style={{ gap: 16 }}>
          {filteredClients.map((client) => (
            <Card key={client.id} style={{ backgroundColor: CARD, borderRadius: 18, borderWidth: 0, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, marginBottom: 0 }}>
              <CardContent style={{ padding: 18 }}>
                <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <Text style={{ fontSize: 17, fontWeight: "bold", color: TEXT }}>{client.name}</Text>
                      <Badge
                        variant={client.active ? "default" : "secondary"}
                        style={{
                          backgroundColor: client.active ? BADGE_ACTIVE_BG : BADGE_INACTIVE_BG,
                          color: client.active ? BADGE_ACTIVE_TEXT : BADGE_INACTIVE_TEXT,
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 2,
                          fontWeight: 'bold',
                          fontSize: 13,
                        }}
                      >
                        {client.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </View>
                    <Text style={{ fontSize: 14, color: TEXT_SECONDARY }}>Doc: {client.document}</Text>
                    <Text style={{ fontSize: 14, color: TEXT_SECONDARY }}>Tel: {client.phone}</Text>
                    {!!client.email && (
                      <Text style={{ fontSize: 14, color: TEXT_SECONDARY }}>Email: {client.email}</Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Button size="sm" variant="outline" onPress={() => handleOpenDialog(client)} style={{ flex: 1, flexDirection: "row", alignItems: "center", borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center' }}>
                    <Edit size={16} color={BUTTON_TEXT} style={{ marginRight: 4 }} />
                    <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Editar</Text>
                  </Button>
                  <Button size="sm" variant="outline" onPress={() => handleToggleActive(client)} style={{ flex: 1, flexDirection: "row", alignItems: "center", borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center' }}>
                    {client.active ? (
                      <>
                        <UserX size={16} color={BUTTON_TEXT} style={{ marginRight: 4 }} />
                        <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Desactivar</Text>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} color={BUTTON_TEXT} style={{ marginRight: 4 }} />
                        <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Activar</Text>
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" onPress={() => handleDeleteClick(client.id)} style={{ flexDirection: "row", alignItems: "center", borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center', width: 44, paddingHorizontal: 0 }}>
                    <Trash2 size={16} color={BUTTON_TEXT} />
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
        {filteredClients.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 48 }}>
            <UserPlus size={48} color={PLACEHOLDER} style={{ marginBottom: 12 }} />
            <Text style={{ color: PLACEHOLDER, marginBottom: 8 }}>No se encontraron clientes</Text>
            <Button onPress={() => handleOpenDialog()} variant="outline" style={{ marginTop: 8, flexDirection: "row", alignItems: "center", borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center' }}>
              <UserPlus size={16} color={BUTTON_TEXT} style={{ marginRight: 8 }} />
              <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Crear primer cliente</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Dialog de crear/editar */}
      <Dialog visible={showDialog} onClose={handleCloseDialog}>
        <DialogHeader>
          <DialogTitle style={{ color: TEXT }}>{editingClient ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
          <DialogDescription style={{ color: TEXT_SECONDARY }}>Complete los datos del cliente</DialogDescription>
        </DialogHeader>
        <View style={{ gap: 16 }}>
          <View style={{ gap: 8 }}>
            <Label htmlFor="name" style={{ color: TEXT }}>Nombre completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={{ backgroundColor: INPUT_BG, color: INPUT_TEXT, borderColor: INPUT_BORDER, borderWidth: 1, borderRadius: 10, fontSize: 15 }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="document" style={{ color: TEXT }}>NIT / CI *</Label>
            <Input
              id="document"
              value={formData.document}
              onChangeText={(text) => setFormData({ ...formData, document: text })}
              style={{ backgroundColor: INPUT_BG, color: INPUT_TEXT, borderColor: INPUT_BORDER, borderWidth: 1, borderRadius: 10, fontSize: 15 }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="phone" style={{ color: TEXT }}>Teléfono *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              style={{ backgroundColor: INPUT_BG, color: INPUT_TEXT, borderColor: INPUT_BORDER, borderWidth: 1, borderRadius: 10, fontSize: 15 }}
            />
          </View>
          <View style={{ gap: 8 }}>
            <Label htmlFor="email" style={{ color: TEXT }}>Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={{ backgroundColor: INPUT_BG, color: INPUT_TEXT, borderColor: INPUT_BORDER, borderWidth: 1, borderRadius: 10, fontSize: 15 }}
            />
          </View>
        </View>
        <DialogFooter>
          <Button variant="outline" onPress={handleCloseDialog} style={{ borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center' }}>
            <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Cancelar</Text>
          </Button>
          <Button onPress={handleSubmit} style={{ backgroundColor: PRIMARY, borderRadius: 10, height: 38, justifyContent: 'center', marginLeft: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>{editingClient ? "Actualizar" : "Crear"}</Text>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Alert Dialog de confirmación de eliminación */}
      <AlertDialog visible={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle style={{ color: TEXT }}>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription style={{ color: TEXT_SECONDARY }}>
            Esta acción no se puede deshacer. El cliente será eliminado permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => setDeleteDialogOpen(false)} style={{ borderColor: BUTTON_BORDER, borderWidth: 1, backgroundColor: BUTTON_BG, borderRadius: 10, height: 38, justifyContent: 'center' }}>
            <Text style={{ color: BUTTON_TEXT, fontWeight: 'bold' }}>Cancelar</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirmDelete} style={{ backgroundColor: BADGE_INACTIVE_BG, borderRadius: 10, height: 38, justifyContent: 'center', marginLeft: 8 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </View>
  );
}
