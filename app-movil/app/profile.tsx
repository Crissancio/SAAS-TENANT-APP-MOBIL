import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  User,
  Mail,
  Building2,
  LogOut,
  Shield,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react-native";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";

export default function Profile() {
  const { user, logout } = useApp();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 24, padding: 16, maxWidth: 400, alignSelf: 'center' }}>
      {/* Header */}
      <View style={{ padding: 16, borderBottomWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111' }}>Perfil</Text>
      </View>

      {/* Información del usuario */}
      <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', marginBottom: 16 }}>
        <CardContent style={{ padding: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <View style={{ width: 64, height: 64, backgroundColor: '#107361', borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} color="#F5F7F8" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#F5F7F8', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{user?.name}</Text>
              <Badge variant="outline">{user?.role === "admin" ? "Administrador" : "Vendedor"}</Badge>
            </View>
          </View>
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Mail size={16} color="#E6EAEA" />
              <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{user?.email}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Building2 size={16} color="#E6EAEA" />
              <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{user?.company}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Shield size={16} color="#E6EAEA" />
              <Text style={{ color: '#F5F7F8', fontSize: 14 }}>Rol: {user?.role === "admin" ? "Administrador" : "Vendedor"}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Opciones de cuenta */}
      <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', marginBottom: 16 }}>
        <CardHeader>
          <CardTitle style={{ color: '#F5F7F8' }}>Configuración de cuenta</CardTitle>
        </CardHeader>
        <CardContent style={{ gap: 8 }}>
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} textStyle={{ color: '#F5F7F8' }}>
            <Settings size={20} color="#F5F7F8" style={{ marginRight: 12 }} />
            Configuración general
          </Button>
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} textStyle={{ color: '#F5F7F8' }}>
            <User size={20} color="#F5F7F8" style={{ marginRight: 12 }} />
            Editar perfil
          </Button>
        </CardContent>
      </Card>

      {/* Ayuda y soporte */}
      <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', marginBottom: 16 }}>
        <CardHeader>
          <CardTitle style={{ color: '#F5F7F8' }}>Ayuda y soporte</CardTitle>
        </CardHeader>
        <CardContent style={{ gap: 8 }}>
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} textStyle={{ color: '#F5F7F8' }}>
            <HelpCircle size={20} color="#F5F7F8" style={{ marginRight: 12 }} />
            Centro de ayuda
          </Button>
          <Button variant="ghost" style={{ width: '100%', justifyContent: 'flex-start' }} textStyle={{ color: '#F5F7F8' }}>
            <FileText size={20} color="#F5F7F8" style={{ marginRight: 12 }} />
            Términos y condiciones
          </Button>
        </CardContent>
      </Card>

      {/* Información de la app */}
      <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', marginBottom: 16 }}>
        <CardContent style={{ padding: 16 }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#E6EAEA', fontSize: 14 }}>Mi Microempresa SaaS</Text>
            <Text style={{ color: '#E6EAEA', fontSize: 14 }}>Versión 1.0.0</Text>
            <Text style={{ color: '#E6EAEA', fontSize: 14, marginTop: 8 }}>© 2025 Todos los derechos reservados</Text>
          </View>
        </CardContent>
      </Card>

      {/* Botón de cerrar sesión */}
      <AlertDialog visible={true} onClose={() => {}}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a la aplicación.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onPress={() => {}}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onPress={handleLogout}>
            Cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
      <Button
        variant="outline"
        style={{ width: '100%', marginTop: 16, borderColor: '#ef4444' }}
        textStyle={{ color: '#ef4444' }}
        onPress={handleLogout}
      >
        <LogOut size={20} color="#ef4444" style={{ marginRight: 8 }} />
        Cerrar sesión
      </Button>
    </ScrollView>
  );
}
