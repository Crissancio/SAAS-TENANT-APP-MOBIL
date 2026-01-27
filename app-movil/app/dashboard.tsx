import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  Store,
} from "lucide-react-native";

export default function Dashboard() {
  const { user, sales, products, clients, notifications } = useApp();
  const router = useRouter();

  // Calcular métricas del día
  const todaySales = sales.filter(
    (sale) =>
      new Date(sale.date).toDateString() === new Date().toDateString()
  );
  const todayTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);

  // Productos con stock bajo
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock
  );

  // Notificaciones no leídas
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#05292E' }}>
      <ScrollView contentContainerStyle={{ padding: 0, paddingBottom: 24, minHeight: '100%' }}>
        <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
          <View style={{ width: '100%', maxWidth: 400, padding: 16 }}>
            {/* Header */}
            <View style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <View style={{ width: 48, height: 48, backgroundColor: '#107361', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={24} color="#F5F7F8" />
                </View>
                <View>
                  <Text style={{ color: '#F5F7F8', fontSize: 18, fontWeight: 'bold' }}>Bienvenido</Text>
                  <Text style={{ color: '#E6EAEA', fontSize: 14 }}>{user?.name || 'Admin Usuario'}</Text>
                </View>
              </View>
            </View>

            {/* Resumen del día */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: 'bold', marginBottom: 10 }}>Resumen del día</Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Card style={{ flex: 1, backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', borderWidth: 1, borderRadius: 16, minHeight: 80, justifyContent: 'center' }}>
                  <CardHeader style={{ paddingBottom: 4, paddingTop: 10 }}>
                    <CardTitle style={{ fontSize: 13, color: '#E6EAEA', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={16} color="#6b7280" />
                      Ventas hoy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text style={{ fontSize: 22, color: '#F5F7F8', fontWeight: 'bold' }}>{todaySales.length}</Text>
                  </CardContent>
                </Card>
                <Card style={{ flex: 1, backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', borderWidth: 1, borderRadius: 16, minHeight: 80, justifyContent: 'center' }}>
                  <CardHeader style={{ paddingBottom: 4, paddingTop: 10 }}>
                    <CardTitle style={{ fontSize: 13, color: '#E6EAEA', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={16} color="#6b7280" />
                      Total hoy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text style={{ fontSize: 22, color: '#107361', fontWeight: 'bold' }}>Bs. {todayTotal.toLocaleString()}</Text>
                  </CardContent>
                </Card>
              </View>
            </View>

            {/* Alertas de stock bajo */}
            {lowStockProducts.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={18} color="#ef4444" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#E6EAEA', fontWeight: 'bold', fontSize: 15 }}>Stock bajo</Text>
                  </View>
                  <Badge variant="destructive" style={{ minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' }}>{lowStockProducts.length}</Badge>
                </View>
                <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', borderWidth: 1, borderRadius: 16 }}>
                  <CardContent style={{ padding: 12 }}>
                    <View style={{ gap: 10 }}>
                      {lowStockProducts.slice(0, 3).map((product) => (
                        <View
                          key={product.id}
                          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{product.name}</Text>
                            <Text style={{ color: '#E6EAEA', fontSize: 12 }}>Stock: {product.stock} unidades</Text>
                          </View>
                          <Badge variant="outline" style={{ borderColor: '#ef4444', minWidth: 44, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>Bajo</Badge>
                        </View>
                      ))}
                    </View>
                  </CardContent>
                </Card>
              </View>
            )}

            {/* Accesos rápidos */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#E6EAEA', fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Accesos rápidos</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                <Button
                  onPress={() => router.push('/sales')}
                  style={{ height: 80, flex: 1, flexDirection: 'column', gap: 6, backgroundColor: '#107361', borderRadius: 12 }}
                  textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 15 }}
                >
                  <ShoppingCart size={28} color="#F5F7F8" />
                  Nueva venta
                </Button>

                <Button
                  onPress={() => router.push('/clients')}
                  variant="outline"
                  style={{ height: 80, flex: 1, flexDirection: 'column', gap: 6, borderColor: 'rgba(245,247,248,0.1)', borderRadius: 12 }}
                  textStyle={{ color: '#E6EAEA', fontWeight: 'bold', fontSize: 15 }}
                >
                  <Users size={28} color="#E6EAEA" />
                  Clientes
                </Button>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                <Button
                  onPress={() => router.push('/inventory')}
                  variant="outline"
                  style={{ height: 80, flex: 1, flexDirection: 'column', gap: 6, borderColor: 'rgba(245,247,248,0.1)', borderRadius: 12 }}
                  textStyle={{ color: '#E6EAEA', fontWeight: 'bold', fontSize: 15 }}
                >
                  <Package size={28} color="#E6EAEA" />
                  Inventario
                </Button>

                <Button
                  onPress={() => router.push('/notifications')}
                  variant="outline"
                  style={{ height: 80, flex: 1, flexDirection: 'column', gap: 6, borderColor: 'rgba(245,247,248,0.1)', borderRadius: 12, position: 'relative' }}
                  textStyle={{ color: '#E6EAEA', fontWeight: 'bold', fontSize: 15 }}
                >
                  <Package size={28} color="#E6EAEA" />
                  Notificaciones
                  {unreadNotifications > 0 && (
                    <View style={{ position: 'absolute', top: 8, right: 8 }}>
                      <Badge variant="destructive" style={{ minWidth: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' }}>{unreadNotifications}</Badge>
                    </View>
                  )}
                </Button>
              </View>
            </View>

            {/* Estadísticas generales */}
            <Card style={{ backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', borderWidth: 1, borderRadius: 16 }}>
              <CardHeader style={{ paddingBottom: 0, paddingTop: 10 }}>
                <CardTitle style={{ color: '#F5F7F8', fontSize: 15, fontWeight: 'bold' }}>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <View style={{ gap: 10, marginTop: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#E6EAEA', fontSize: 14 }}>Total productos</Text>
                    <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{products.length}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#E6EAEA', fontSize: 14 }}>Clientes activos</Text>
                    <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{clients.filter((c) => c.active).length}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#E6EAEA', fontSize: 14 }}>Total ventas</Text>
                    <Text style={{ color: '#F5F7F8', fontSize: 14 }}>{sales.length}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
