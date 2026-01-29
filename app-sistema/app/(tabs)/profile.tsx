import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/Dialog";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth-context";




export default function ProfileScreen() {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Datos del usuario
  const nombreUsuario = user?.nombre || "";
  const emailUsuario = user?.email || "";
  const rolUsuario = user?.rol || "";
  const rolTexto = rolUsuario === "adminmicroempresa" ? "Administrador" : rolUsuario === "vendedor" ? "Vendedor" : rolUsuario;

  // Recuperar microempresa directamente del contexto
  const microempresa = user?.microempresa;
  console.log("Microempresa en ProfileScreen:", microempresa);

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    router.replace("/login");
  };

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>

      {/* Info usuario */}
      <Card style={styles.cardBox}>
        <CardContent style={styles.userContent}>
          <View style={styles.userRow}>
            <View style={styles.avatarBox}>
              <Feather name="user" size={36} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{nombreUsuario}</Text>
              <Badge variant="outline" style={styles.roleBadge} textStyle={styles.roleBadgeText}>
                {rolTexto}
              </Badge>
            </View>
          </View>
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Feather name="mail" size={16} color="#A0B6B8" style={styles.infoIcon} />
              <Text style={styles.infoText}>{emailUsuario}</Text>
            </View>
            <View style={styles.infoRow}>
              <Feather name="briefcase" size={16} color="#A0B6B8" style={styles.infoIcon} />
              <Text style={styles.infoText}>
                Microempresa: {microempresa?.nombre || "Sin microempresa"}
              </Text>
            </View>
            {microempresa && (
              <>
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={16} color="#A0B6B8" style={styles.infoIcon} />
                  <Text style={styles.infoText}>Dirección: {microempresa.direccion}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="phone" size={16} color="#A0B6B8" style={styles.infoIcon} />
                  <Text style={styles.infoText}>Teléfono: {microempresa.telefono}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="mail" size={16} color="#A0B6B8" style={styles.infoIcon} />
                  <Text style={styles.infoText}>Correo: {microempresa.correo_contacto}</Text>
                </View>
              </>
            )}
            <View style={styles.infoRow}>
              <Feather name="shield" size={16} color="#A0B6B8" style={styles.infoIcon} />
              <Text style={styles.infoText}>Rol: {rolTexto}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Configuración de cuenta */}
      <Card style={styles.cardBox}>
        <CardHeader style={styles.sectionHeader}>
          <CardTitle style={styles.sectionTitle}>Configuración de cuenta</CardTitle>
        </CardHeader>
        <CardContent style={styles.sectionContent}>
          <TouchableOpacity style={styles.optionRow}>
            <Feather name="settings" size={20} color="#A0B6B8" style={styles.optionIcon} />
            <Text style={styles.optionText}>Configuración general</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Feather name="user" size={20} color="#A0B6B8" style={styles.optionIcon} />
            <Text style={styles.optionText}>Editar perfil</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* Ayuda y soporte */}
      <Card style={styles.cardBox}>
        <CardHeader style={styles.sectionHeader}>
          <CardTitle style={styles.sectionTitle}>Ayuda y soporte</CardTitle>
        </CardHeader>
        <CardContent style={styles.sectionContent}>
          <TouchableOpacity style={styles.optionRow}>
            <Feather name="help-circle" size={20} color="#A0B6B8" style={styles.optionIcon} />
            <Text style={styles.optionText}>Centro de ayuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Feather name="file-text" size={20} color="#A0B6B8" style={styles.optionIcon} />
            <Text style={styles.optionText}>Términos y condiciones</Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* Información de la app */}
      <Card style={styles.cardBox}>
        <CardContent style={styles.appInfoContent}>
          <Text style={styles.appInfoText}>Mi Microempresa SaaS</Text>
          <Text style={styles.appInfoText}>Versión 1.0.0</Text>
          <Text style={[styles.appInfoText, { marginTop: 8 }]}>© 2025 Todos los derechos reservados</Text>
        </CardContent>
      </Card>

      {/* Botón cerrar sesión */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
        <Feather name="log-out" size={20} color="#E53935" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      {/* Dialogo de confirmación */}
      <Dialog visible={showLogout} onClose={() => setShowLogout(false)} style={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>¿Cerrar sesión?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder a la aplicación.
          </DialogDescription>
        </DialogHeader>
        <View style={styles.dialogFooter}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogout(false)}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleLogout}>
            <Text style={styles.confirmText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </Dialog>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#042326' },
  container: { padding: 0, paddingBottom: 32 },
  headerBox: {
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 8,
    backgroundColor: '#0a3a4000',
    borderBottomWidth: 1,
    borderColor: '#15545A',
    zIndex: 2,
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  cardBox: {
    marginHorizontal: 14,
    marginTop: 8, // Reducido de 18 a 8 para menos separación
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#15545A',
    backgroundColor: '#0A3A40',
    padding: 0,
  },
  userContent: {
    padding: 18,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 18,
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#107361',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 2,
  },
  roleBadge: {
    borderColor: '#107361',
    marginTop: 2,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    height: 22,
  },
  roleBadgeText: {
    color: '#107361',
    fontSize: 13,
  },
  infoList: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    color: '#E6EAEA',
    fontSize: 15,
  },
  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 0,
  },
  sectionTitle: {
    color: '#E6EAEA',
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContent: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    color: '#E6EAEA',
    fontSize: 15,
  },
  appInfoContent: {
    alignItems: 'center',
    padding: 14,
  },
  appInfoText: {
    color: '#A0B6B8',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E53935',
    borderRadius: 12,
    marginHorizontal: 14,
    marginTop: 18,
    marginBottom: 24,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '500',
  },
  dialogContent: {
    backgroundColor: '#0A3A40',
    borderRadius: 18,
    minWidth: 320,
    maxWidth: 400,
    padding: 20,
  },
  dialogFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 18,
    marginBottom: 2,
    paddingHorizontal: 18,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#14383C',
  },
  cancelText: {
    color: '#A0B6B8',
    fontSize: 15,
  },
  confirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#E53935',
  },
  confirmText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
