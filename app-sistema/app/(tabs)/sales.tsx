import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/Dialog";
// import { Label } from "../../components/ui/Label";
import { Toast } from "../../components/ui/Toast";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/auth-context";

// Simulación de contexto y datos
const PRODUCTS = [
  { id: 1, name: "Laptop HP", price: 4500, stock: 5, minStock: 3, image: require("../../assets/images/laptop-hp.jpg") },
  { id: 2, name: "Mouse Logitech", price: 85, stock: 2, minStock: 3, image: require("../../assets/images/mouse-logitech.jpg") },
  { id: 3, name: "Teclado Mecánico", price: 320, stock: 8, minStock: 2, image: require("../../assets/images/teclado-mecanico.jpg") },
  { id: 4, name: "Monitor LG 24'", price: 890, stock: 12, minStock: 4, image: require("../../assets/images/monitor-lg.jpg") },
];
const CLIENTS = [
  { id: "1", name: "Juan Pérez García", document: "1234567", phone: "71234567", email: "juan@mail.com", active: true },
];



  // Cliente

  export default function SalesScreen() {
    const router = useRouter();
    const { user } = useAuth();
    React.useEffect(() => {
      if (!user) router.replace("/login");
    }, [user, router]);
    // Dialog states
    const [showCart, setShowCart] = useState(false);
    const [showClientDialog, setShowClientDialog] = useState(false);
    const [showNewClientDialog, setShowNewClientDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);
    // Estados
    const [products] = useState(PRODUCTS);
    const [cart, setCart] = useState<any[]>([]);
    const [clients, setClients] = useState(CLIENTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [clientDocument, setClientDocument] = useState("");
    const [newClientData, setNewClientData] = useState({ name: "", document: "", phone: "", email: "" });
    const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({ visible: false, message: "" });

    // Filtros y totales
    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Funciones de carrito
    const addToCart = (product: any) => {
      if (product.stock <= 0) {
        setToast({ visible: true, message: "Producto sin stock", type: "error" });
        return;
      }
      const cartItem = cart.find((item) => item.product.id === product.id);
      if (cartItem && cartItem.quantity >= product.stock) {
        setToast({ visible: true, message: "No hay suficiente stock", type: "error" });
        return;
      }
      if (cartItem) {
        setCart(cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCart([...cart, { product, quantity: 1 }]);
      }
      setToast({ visible: true, message: `${product.name} agregado al carrito`, type: "success" });
    };
    const removeFromCart = (productId: number) => {
      setCart(cart.filter((item) => item.product.id !== productId));
    };
    const updateCartQuantity = (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart(cart.map((item) => item.product.id === productId ? { ...item, quantity } : item));
    };
    const clearCart = () => setCart([]);

    // Cliente
    const handleSearchClient = () => {
      const client = clients.find((c) => c.document === clientDocument);
      if (client) {
        setSelectedClient(client);
      } else {
        setSelectedClient(null);
        setNewClientData({ ...newClientData, document: clientDocument });
        setShowClientDialog(false);
        setShowNewClientDialog(true);
      }
    };
    const handleCreateClient = () => {
      if (!newClientData.name || !newClientData.document || !newClientData.phone) {
        setToast({ visible: true, message: "Complete los campos obligatorios", type: "error" });
        return;
      }
      const client = { id: Date.now().toString(), ...newClientData, active: true };
      setClients([...clients, client]);
      setSelectedClient(client);
      setShowNewClientDialog(false);
      handleCompleteSale(client);
    };
    const handleCompleteSale = (client: any) => {
      clearCart();
      setToast({ visible: true, message: "Venta procesada exitosamente", type: "success" });
      setShowClientDialog(false);
      setSelectedClient(null);
      setClientDocument("");
    };

    // Render
    return (
      <View style={styles.bg}>
        <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
        {/* Header */}
        <View style={styles.headerBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Feather name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ventas</Text>
          </View>
          <TouchableOpacity style={styles.cartBtn} onPress={() => setShowCart(true)}>
            <Feather name="shopping-cart" size={22} color="#fff" />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* Buscador */}
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color="#A0B6B8" style={styles.searchIcon} />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.input, {borderWidth: 0}]}
          />
        </View>
        {/* Catálogo de productos */}
        <ScrollView contentContainerStyle={styles.productsGrid} showsVerticalScrollIndicator={false}>
          <View style={styles.gridRow}>
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.product.id === product.id);
              const inCart = !!cartItem;
              const lowStock = product.stock <= product.minStock;
              return (
                <Card key={product.id} style={styles.productCard}>
                  <View style={styles.productImageBox}>
                    <Image source={product.image} style={styles.productImage} resizeMode="cover" />
                    {lowStock && (
                      <Badge variant="destructive" style={styles.lowStockBadge}>Bajo stock</Badge>
                    )}
                  </View>
                  <CardContent style={styles.productContent}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productStock}>Stock: {product.stock}</Text>
                    <Text style={styles.productPrice}>Bs. {product.price.toLocaleString()}</Text>
                    <Button
                      onPress={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      style={styles.addBtn}
                    >
                      <Feather name="plus" size={16} color="#fff" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#fff', fontSize: 15 }}>
                        {inCart ? `En carrito (${cartItem.quantity})` : "Agregar"}
                      </Text>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </View>
          {filteredProducts.length === 0 && (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons name="package-variant" size={48} color="#A0B6B8" />
              <Text style={styles.emptyText}>No se encontraron productos</Text>
            </View>
          )}
        </ScrollView>
        {/* Dialog: Carrito de compras */}
        <Dialog style={{width: '100%'}} visible={showCart} onClose={() => setShowCart(false)}>
          <DialogHeader>
            <DialogTitle>Carrito de compras</DialogTitle>
            <DialogDescription>{cart.length} producto(s) en el carrito</DialogDescription>
          </DialogHeader>
          <View style={{ maxHeight: 400, marginTop: 8 }}>
            {cart.length === 0 ? (
              <View style={styles.emptyBox}>
                <Feather name="shopping-cart" size={48} color="#A0B6B8" />
                <Text style={styles.emptyText}>El carrito está vacío</Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 320 }}>
                {cart.map((item) => (
                  <View key={item.product.id} style={{ flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: '#0A3A40', borderRadius: 10, marginBottom: 10, padding: 8 }}>
                    <Image source={item.product.image} style={{ width: 54, height: 54, borderRadius: 8, marginRight: 6 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>{item.product.name}</Text>
                      <Text style={styles.productPrice}>Bs. {item.product.price.toLocaleString()}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <TouchableOpacity style={{ padding: 4, borderRadius: 6, backgroundColor: "#0F2326" }} onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                          <Feather name="minus" size={16} color="#fff" />
                        </TouchableOpacity>
                        <Text style={{ color: '#E6EAEA', fontSize: 15, width: 28, textAlign: 'center' }}>{item.quantity}</Text>
                        <TouchableOpacity style={{ padding: 4, borderRadius: 6, backgroundColor: "#0F2326" }} onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>
                          <Feather name="plus" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.productPrice}>Bs. {(item.product.price * item.quantity).toLocaleString()}</Text>
                      <TouchableOpacity onPress={() => removeFromCart(item.product.id)} style={{ marginTop: 8 }}>
                        <Feather name="trash-2" size={18} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
          {cart.length > 0 && (
            <View style={{ borderTopWidth: 1, borderColor: '#15545A', paddingTop: 12, marginTop: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={styles.productName}>Total:</Text>
                <Text style={[styles.productPrice, { fontSize: 20 }]}>Bs. {cartTotal.toLocaleString()}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button variant="outline" onPress={clearCart} style={{ flex: 1, marginRight: 6, backgroundColor: '#0F2326' }}>
                  <Feather name="trash-2" size={16} color='#E6EAEA' style={{ marginRight: 4 }} />
                  <Text style={{ color: '#E6EAEA', fontSize: 15 }}>Vaciar</Text>
                </Button>
                <Button onPress={() => {
                  setShowCart(false);
                  setShowClientDialog(true);
                }} style={{ flex: 1, backgroundColor: '#107361' }}>
                  Procesar venta
                </Button>
              </View>
            </View>
          )}
        </Dialog>

        {/* Dialog: Buscar cliente */}
        <Dialog style={{width: '100%'}} visible={showClientDialog} onClose={() => setShowClientDialog(false)}>
          <DialogHeader>
            <DialogTitle>Datos del cliente</DialogTitle>
            <DialogDescription>Ingrese el NIT o CI del cliente</DialogDescription>
          </DialogHeader>
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>NIT / CI</Text>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <Input
                placeholder="1234567"
                value={clientDocument}
                onChangeText={setClientDocument}
                style={[styles.input, { borderColor: '#15545A', color: '#E6EAEA' }]}
              />
              <Button onPress={handleSearchClient} style={{ backgroundColor: '#107361', paddingHorizontal: 14 }}>
                <Feather name="search" size={18} color="#fff" />
              </Button>
            </View>
            {selectedClient && (
              <Card style={{ backgroundColor: '#0A3A40', borderColor: '#15545A', marginTop: 10 }}>
                <CardContent style={{ padding: 14 }}>
                  <Text style={styles.productName}>{selectedClient.name}</Text>
                  <Text style={styles.productStock}>Doc: {selectedClient.document}</Text>
                  <Text style={styles.productStock}>Tel: {selectedClient.phone}</Text>
                  <Button onPress={() => handleCompleteSale(selectedClient)} style={{ marginTop: 14, backgroundColor: '#107361' }}>
                    Confirmar venta
                  </Button>
                </CardContent>
              </Card>
            )}
          </View>
        </Dialog>

        {/* Dialog: Nuevo cliente */}
        <Dialog visible={showNewClientDialog} onClose={() => setShowNewClientDialog(false)}>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
            <DialogDescription>El cliente no existe. Complete los datos para crearlo.</DialogDescription>
          </DialogHeader>
          <View style={{ gap: 12 }}>
            <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>Nombre completo *</Text>
            <Input
              placeholder="Nombre completo"
              value={newClientData.name}
              onChangeText={(text) => setNewClientData({ ...newClientData, name: text })}
              style={[styles.input, { backgroundColor: '#0A3A40', borderColor: '#15545A', color: '#E6EAEA' }]}
            />
            <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>NIT / CI *</Text>
            <Input
              placeholder="NIT / CI"
              value={newClientData.document}
              onChangeText={(text) => setNewClientData({ ...newClientData, document: text })}
              style={[styles.input, { backgroundColor: '#0A3A40', borderColor: '#15545A', color: '#E6EAEA' }]}
            />
            <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>Teléfono *</Text>
            <Input
              placeholder="Teléfono"
              value={newClientData.phone}
              onChangeText={(text) => setNewClientData({ ...newClientData, phone: text })}
              style={[styles.input, { backgroundColor: '#0A3A40', borderColor: '#15545A', color: '#E6EAEA' }]}
            />
            <Text style={{ color: '#E6EAEA', fontSize: 15, fontWeight: '500', marginBottom: 4 }}>Email</Text>
            <Input
              placeholder="Email"
              value={newClientData.email}
              onChangeText={(text) => setNewClientData({ ...newClientData, email: text })}
              style={[styles.input, { backgroundColor: '#0A3A40', borderColor: '#15545A', color: '#E6EAEA' }]}
            />
          </View>
          <DialogFooter>
            <Button variant="outline" onPress={() => setShowNewClientDialog(false)} style={{ marginRight: 8 }}>
              Cancelar
            </Button>
            <Button onPress={handleCreateClient} style={{ backgroundColor: '#107361' }}>
              Crear y continuar
            </Button>
          </DialogFooter>
        </Dialog>
      </View>
    );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#042326' },
  headerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 8,
    backgroundColor: '#0a3a4000',
    borderBottomWidth: 1,
    borderColor: '#15545A',
    zIndex: 2,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  cartBtn: {
    position: 'relative',
    backgroundColor: '#107361',
    borderRadius: 10,
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 10,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A3A40',
    borderRadius: 10,
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#15545A',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#E6EAEA',
    fontSize: 16,
    paddingVertical: 6,
  },
  productsGrid: {
    paddingHorizontal: 10,
    paddingBottom: 32,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#0A3A40',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#15545A',
    marginBottom: 14,
    overflow: 'hidden',
  },
  productImageBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#0A3A40',
    position: 'relative',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  lowStockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  productContent: {
    padding: 12,
  },
  productName: {
    color: '#E6EAEA',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  productStock: {
    color: '#B6C2CF',
    fontSize: 13,
    marginBottom: 2,
  },
  productPrice: {
    color: '#107361',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#107361',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 2,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#A0B6B8',
    fontSize: 15,
    marginTop: 8,
  },
});
