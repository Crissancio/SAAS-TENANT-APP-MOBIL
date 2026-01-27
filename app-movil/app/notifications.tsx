import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Bell, CheckCircle, DollarSign, AlertTriangle, ShoppingCart } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function Notifications() {
  const { notifications, markNotificationAsRead } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "STOCK_BAJO":
        return <AlertTriangle size={20} color="#ef4444" />;
      case "VENTA_REALIZADA":
        return <ShoppingCart size={20} color="#107361" />;
      case "COMPRA_CONFIRMADA":
      case "PAGO_RECIBIDO":
        return <DollarSign size={20} color="#22c55e" />;
      default:
        return <Bell size={20} color="#6b7280" />;
    }
  };

  const getNotificationStyle = (type: string, read: boolean) => {
    if (read) {
      return { backgroundColor: '#fff', borderColor: '#e5e7eb' };
    }
    switch (type) {
      case "STOCK_BAJO":
        return { backgroundColor: '#ef4444', opacity: 0.1, borderColor: '#ef4444' };
      case "VENTA_REALIZADA":
        return { backgroundColor: '#107361', opacity: 0.1, borderColor: '#107361' };
      case "COMPRA_CONFIRMADA":
      case "PAGO_RECIBIDO":
        return { backgroundColor: '#22c55e', opacity: 0.1, borderColor: '#22c55e' };
      default:
        return { backgroundColor: '#fff', borderColor: '#e5e7eb' };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ paddingTop: 24, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
        <View style={{ paddingHorizontal: 16, maxWidth: 400, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111' }}>Notificaciones</Text>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} nuevas</Badge>
            )}
          </View>
        </View>
      </View>

      {/* Lista de notificaciones */}
      <ScrollView contentContainerStyle={{ padding: 16, maxWidth: 400, alignSelf: 'center' }}>
        {notifications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Bell size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#6b7280', marginBottom: 8 }}>No hay notificaciones</Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                style={getNotificationStyle(notification.type, notification.read)}
              >
                <CardContent style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flexShrink: 0, marginTop: 4 }}>{getNotificationIcon(notification.type)}</View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
                        <Text style={{ fontSize: 14, color: notification.read ? '#6b7280' : '#0A3A40', flex: 1 }}>
                          {notification.message}
                        </Text>
                        {!notification.read && (
                          <View style={{ width: 8, height: 8, backgroundColor: '#107361', borderRadius: 4, marginLeft: 8, marginTop: 4 }} />
                        )}
                      </View>
                      <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                        {formatDistanceToNow(new Date(notification.date), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </Text>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onPress={() => markNotificationAsRead(notification.id)}
                          style={{ height: 28, paddingHorizontal: 8 }}
                          textStyle={{ color: '#107361' }}
                        >
                          <CheckCircle size={14} color="#107361" style={{ marginRight: 4 }} />
                          Marcar como leída
                        </Button>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
