import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";


// Tipos y datos simulados
const NOTIFICATIONS = [
  {
    id: 1,
    type: "STOCK_BAJO",
    message: "El producto 'Mouse Logitech' tiene stock bajo (2 unidades)",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    read: false,
  },
  {
    id: 2,
    type: "VENTA_REALIZADA",
    message: "Venta realizada a Juan Pérez García por Bs. 4,670",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    read: false,
  },
  {
    id: 3,
    type: "STOCK_BAJO",
    message: "El producto 'Webcam HD' tiene stock bajo (1 unidad)",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
    read: true,
  },
];

function formatDistanceToNow(date: Date): string {
  // Solo para demo: "hace alrededor de 1 año"
  return "hace alrededor de 1 año";
}

function getNotificationIcon(type: string): React.ReactNode {
  switch (type) {
    case "STOCK_BAJO":
      return <Feather name="alert-triangle" size={20} color="#E53935" />;
    case "VENTA_REALIZADA":
      return <Feather name="shopping-cart" size={20} color="#107361" />;
    case "COMPRA_CONFIRMADA":
      return <Feather name="package" size={20} color="#22c55e" />;
    case "PAGO_RECIBIDO":
      return <Feather name="dollar-sign" size={20} color="#22c55e" />;
    default:
      return <Feather name="bell" size={20} color="#A0B6B8" />;
  }
}

function getNotificationStyle(type: string, read: boolean) {
  if (read) {
    return styles.cardRead;
  }
  switch (type) {
    case "STOCK_BAJO":
      return styles.cardStockBajo;
    case "VENTA_REALIZADA":
      return styles.cardVenta;
    case "COMPRA_CONFIRMADA":
    case "PAGO_RECIBIDO":
      return styles.cardOk;
    default:
      return styles.cardRead;
  }
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        {unreadCount > 0 && (
          <Badge style={styles.unreadBadge}>{unreadCount} nuevas</Badge>
        )}
      </View>
      {/* Lista de notificaciones */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Feather name="bell" size={48} color="#A0B6B8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={[styles.card, getNotificationStyle(item.type, item.read)]}>
            <CardContent style={styles.cardContent}>
              <View style={styles.row}>
                <View style={styles.iconBox}>{getNotificationIcon(item.type)}</View>
                <View style={styles.infoBox}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.message, item.read ? styles.messageRead : styles.messageUnread]}>{item.message}</Text>
                    {!item.read && <View style={styles.dot} />}
                  </View>
                  <Text style={styles.date}>{formatDistanceToNow(item.date)}</Text>
                  {!item.read && (
                    <TouchableOpacity onPress={() => markNotificationAsRead(item.id)}>
                      <View style={styles.markReadBtn}>
                        <Feather name="check-circle" size={16} color="#107361" style={{ marginRight: 4 }} />
                        <Text style={styles.markReadText}>Marcar como leída</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#042326', paddingTop: 28 },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#0a3a4000',
    borderBottomWidth: 1,
    borderColor: '#15545A',
    zIndex: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#E53935',
    color: '#fff',
    fontSize: 13,
    height: 24,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: '#0A3A40',
    padding: 0,
  },
  cardContent: {
    padding: 0,
  },
  cardRead: {
    borderColor: '#15545A',
    backgroundColor: '#0A3A40',
  },
  cardStockBajo: {
    borderColor: '#E5393530',
    backgroundColor: '#E5393515',
  },
  cardVenta: {
    borderColor: '#10736130',
    backgroundColor: '#10736115',
  },
  cardOk: {
    borderColor: '#22c55e30',
    backgroundColor: '#22c55e15',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    padding: 4,
  },
  iconBox: {
    marginTop: 2,
    width: 28,
    alignItems: 'center',
  },
  infoBox: {
    flex: 1,
    minWidth: 0,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  message: {
    fontSize: 15,
    flex: 1,
  },
  messageUnread: {
    color: '#fff',
  },
  messageRead: {
    color: '#A0B6B8',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#107361',
    marginLeft: 8,
    marginTop: 4,
  },
  date: {
    color: '#A0B6B8',
    fontSize: 12,
    marginBottom: 8,
  },
  markReadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    paddingVertical: 2,
  },
  markReadText: {
    color: '#107361',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#A0B6B8',
    fontSize: 15,
  },
});
