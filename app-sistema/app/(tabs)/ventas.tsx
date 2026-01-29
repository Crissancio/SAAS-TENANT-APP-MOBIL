import React from "react";
import { useAuth } from "../../contexts/auth-context";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useRouter } from "expo-router";


export default function VentasScreen() {
  // Simulación de datos (reemplaza por tu contexto real)
  const sales = [
    { id: 1, date: new Date().toISOString(), total: 100 },
    { id: 2, date: new Date().toISOString(), total: 200 },
  ];
  const products = [
    { id: 1, name: "Mouse Logitech", stock: 2, minStock: 3 },
    { id: 2, name: "Webcam HD", stock: 1, minStock: 2 },
    { id: 3, name: "Teclado", stock: 10, minStock: 2 },
  ];
  const clients = [
    { id: 1, name: "Cliente 1", active: true },
    { id: 2, name: "Cliente 2", active: true },
  ];
  const notifications = [
    { id: 1, read: false },
    { id: 2, read: false },
  ];

  const router = useRouter();
  const { user } = useAuth();
  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Métricas del día
  const todaySales = sales.filter(
    (sale) => new Date(sale.date).toDateString() === new Date().toDateString()
  );
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Para accesos rápidos: rectángulos delgados
  const screenWidth = Dimensions.get('window').width;
  const quickBtnWidth = (screenWidth - 14 * 2 - 12) / 2; // padding horizontal y gap
  const quickBtnHeight = 100;

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header como Card */}
      <View style={styles.headerBox}>
        <View style={styles.headerIconBox}>
          <MaterialCommunityIcons name="store" size={28} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Bienvenido</Text>
          <Text style={styles.headerSubtitle}>{user?.nombre || "Usuario"}</Text>
        </View>
      </View>

      {/* Resumen del día */}
      <Text style={styles.sectionTitle}>Resumen del día</Text>
      <View style={styles.row}>
        <Card style={styles.cardSmall}>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <Feather name="trending-up" size={16} color="#A0B6B8" />
              <Text style={styles.cardHeaderText}>Ventas hoy</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.cardValue}>{todaySales.length}</Text>
          </CardContent>
        </Card>
        <Card style={styles.cardSmall}>
          <CardHeader>
            <View style={styles.cardHeaderRow}>
              <Feather name="trending-up" size={16} color="#A0B6B8" />
              <Text style={styles.cardHeaderText}>Total hoy</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text style={[styles.cardValue, { color: '#107361' }]}>Bs. {todayTotal.toLocaleString()}</Text>
          </CardContent>
        </Card>
      </View>

      {/* Stock bajo */}
      {lowStockProducts.length > 0 && (
        <View style={styles.sectionBox}>
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <Feather name="alert-triangle" size={18} color="#E53935" />
              <Text style={styles.sectionTitleStock}>Stock bajo</Text>
            </View>
            <Badge variant="destructive">{lowStockProducts.length}</Badge>
          </View>
          <Card style={styles.cardFull}>
            <CardContent>
              {lowStockProducts.slice(0, 3).map((product, idx) => (
                <View key={product.id} style={[styles.rowBetween, idx < lowStockProducts.length - 1 && { marginBottom: 8 }] }>
                  <View>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productStock}>Stock: {product.stock} unidades</Text>
                  </View>
                  <Badge variant="outline" textStyle={{ color: '#E53935', borderColor: '#E53935' }}>Bajo</Badge>
                </View>
              ))}
            </CardContent>
          </Card>
        </View>
      )}

      {/* Accesos rápidos */}
      <Text style={styles.sectionTitle}>Accesos rápidos</Text>
      <View style={styles.quickGrid}>
        <Button
          style={{
            ...styles.quickBtn,
            backgroundColor: '#107361',
            width: quickBtnWidth,
            height: quickBtnHeight,
          }}
          onPress={() => router.push('/sales')}
        >
          <Feather name="shopping-cart" size={20} color="#fff" />
          <Text style={[styles.quickBtnText, { color: '#fff' }]}>Nueva venta</Text>
        </Button>
        <Button
          variant="outline"
          style={{
            ...styles.quickBtn,
            width: quickBtnWidth,
            height: quickBtnHeight,
          }}
          textStyle={{ color: '#E6EAEA' }}
          onPress={() => router.push('/clients')}
        >
          <Feather name="users" size={20} color="#E6EAEA" />
          <Text style={styles.quickBtnText}>Clientes</Text>
        </Button>
        <Button
          variant="outline"
          style={{
            ...styles.quickBtn,
            width: quickBtnWidth,
            height: quickBtnHeight,
          }}
          textStyle={{ color: '#E6EAEA' }}
          onPress={() => router.push('/inventory')}
        >
          <Feather name="box" size={20} color="#E6EAEA" />
          <Text style={styles.quickBtnText}>Inventario</Text>
        </Button>
        <Button
          variant="outline"
          style={{
            ...styles.quickBtn,
            width: quickBtnWidth,
            height: quickBtnHeight,
          }}
          textStyle={{ color: '#E6EAEA' }}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={20} color="#E6EAEA" />
          <Text style={styles.quickBtnText}>Notificaciones</Text>
          {unreadNotifications > 0 && (
            <Badge variant="destructive" style={styles.badgeNotif}>{unreadNotifications}</Badge>
          )}
        </Button>
      </View>

      {/* Estadísticas */}
      <Card style={styles.cardFull}>
        <CardHeader>
          <Text style={styles.sectionTitle}>Estadísticas</Text>
        </CardHeader>
        <CardContent>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total productos</Text>
            <Text style={styles.statsValue}>{products.length}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Clientes activos</Text>
            <Text style={styles.statsValue}>{clients.filter((c) => c.active).length}</Text>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statsLabel}>Total ventas</Text>
            <Text style={styles.statsValue}>{sales.length}</Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bg: { backgroundColor: '#042326', flex: 1 },
  container: { padding: 14, paddingBottom: 32 },
  headerCard: {
    marginBottom: 14,
    paddingVertical: 0,
    paddingHorizontal: 0,
    backgroundColor: '#0A3A40',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#15545A',
  },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#107361',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 1,
  },
  headerSubtitle: {
    color: '#B6C2CF',
    fontSize: 13,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#E6EAEA',
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionTitleStock: {
    color: '#E6EAEA',
    fontSize: 15,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  cardSmall: {
    flex: 1,
    minWidth: 110,
    backgroundColor: '#0A3A40',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#15545A',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 0,
  },
  cardHeaderText: {
    color: '#A0B6B8',
    fontSize: 13,
    marginLeft: 3,
  },
  cardValue: {
    color: '#E6EAEA',
    fontSize: 21,
    marginTop: 2,
  },
  sectionBox: {
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardFull: {
    width: '100%',
    backgroundColor: '#0A3A40',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#15545A',
  },
  productName: {
    color: '#E6EAEA',
    fontSize: 15,
  },
  productStock: {
    color: '#B6C2CF',
    fontSize: 12,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 2,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginBottom: 10,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#15545A',
    backgroundColor: '#0A3A40',
    paddingHorizontal: 10,
    paddingVertical: 0,
    // gap eliminado, usar marginLeft en el texto
  },
  quickBtnText: {
    color: '#E6EAEA',
    fontSize: 15,
    marginLeft: 8, // Espaciado entre icono y texto
    marginTop: 0,
  },
  badgeNotif: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statsLabel: {
    color: '#B6C2CF',
    fontSize: 13,
  },
  statsValue: {
    color: '#E6EAEA',
    fontSize: 15,
  },
});
