import React, { useState } from "react";
import { View, Text, Image, FlatList, Dimensions } from "react-native";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog } from "../components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, ShoppingCart, Search, Package, Plus, Minus, Trash2 } from "lucide-react-native";

const CARD_GAP = 16;
const CARD_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_CONTAINER_PADDING = 16 * 2; // paddingHorizontal: 16
const CARD_WIDTH = (SCREEN_WIDTH - CARD_CONTAINER_PADDING - CARD_GAP) / CARD_COLUMNS;

export default function Sales() {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    processSale,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showClientDialog, setShowClientDialog] = useState(false);
  const [clientDocument, setClientDocument] = useState("");
  const [showNewClientDialog, setShowNewClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [clientSearchState, setClientSearchState] = useState<'idle' | 'found' | 'notfound'>("idle");
  const [newClientData, setNewClientData] = useState({
    name: "",
    document: "",
    phone: "",
    email: "",
  });

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error("Producto sin stock", {
        style: { backgroundColor: '#07363B', color: '#fff', borderRadius: 12, fontWeight: 'bold' },
        icon: <CheckCircle size={20} color="#ef4444" />,
        duration: 2500,
      });
      return;
    }
    const cartItem = cart.find((item) => item.product.id === product.id);
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error("No hay suficiente stock", {
        style: { backgroundColor: '#07363B', color: '#fff', borderRadius: 12, fontWeight: 'bold' },
        icon: <CheckCircle size={20} color="#ef4444" />,
        duration: 2500,
      });
      return;
    }
    addToCart(product);
    toast.success(`${product.name} agregado al carrito`, {
      style: { backgroundColor: '#07363B', color: '#fff', borderRadius: 12, fontWeight: 'bold' },
      icon: <CheckCircle size={20} color="#fff" />, // icono blanco
      duration: 2500,
    });
  };

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío", {
        style: { backgroundColor: '#07363B', color: '#fff', borderRadius: 12, fontWeight: 'bold' },
        icon: <CheckCircle size={20} color="#ef4444" />,
        duration: 2500,
      });
      return;
    }
    setShowCart(false);
    setTimeout(() => setShowClientDialog(true), 300); // Pequeño delay para UX
  };

  const handleCompleteSale = (client: any) => {
    processSale(client);
    toast.success("Venta procesada exitosamente", {
      style: { backgroundColor: '#07363B', color: '#fff', borderRadius: 12, fontWeight: 'bold' },
      icon: <CheckCircle size={20} color="#22c55e" />,
      duration: 2500,
    });
    setShowClientDialog(false);
    setSelectedClient(null);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#05292E' }}>
      {/* Header superior */}
      <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8, maxWidth: 400, alignSelf: 'center', width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F5F7F8' }}>Ventas</Text>
          <View style={{ position: 'relative' }}>
            <Button onPress={() => setShowCart(true)} style={{ backgroundColor: '#107361', borderRadius: 12, width: 44, height: 44, padding: 0, justifyContent: 'center', alignItems: 'center' }}>
              <ShoppingCart size={22} color="#F5F7F8" />
            </Button>
            {cartItemsCount > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -4, zIndex: 2 }}>
                <Badge style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', borderWidth: 0 }}>
                  <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>{cartItemsCount}</Text>
                </Badge>
              </View>
            )}
          </View>
        </View>
        {/* Buscador */}
        <View style={{ position: 'relative', marginBottom: 8 }}>
          <Search size={18} color="#6b7280" style={{ position: 'absolute', left: 14, top: 13, zIndex: 2 }} />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ paddingLeft: 40, backgroundColor: 'transparent', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 12, height: 44, fontSize: 15, borderWidth: 1 }}
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>
      {/* Catálogo de productos con FlatList */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, maxWidth: 400, alignSelf: 'center' }}
        columnWrapperStyle={{ gap: CARD_GAP, marginBottom: CARD_GAP }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Package size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#6b7280' }}>No se encontraron productos</Text>
          </View>
        }
        renderItem={({ item: product }) => {
          const cartItem = cart.find((i) => i.product.id === product.id);
          const inCart = !!cartItem;
          const lowStock = product.stock <= product.minStock;
          return (
            <Card key={product.id} style={{ width: CARD_WIDTH, backgroundColor: '#0A3A40', borderColor: 'rgba(245,247,248,0.1)', borderRadius: 16, overflow: 'hidden', padding: 0 }}>
              <View style={{ aspectRatio: 1, backgroundColor: '#F5F7F8', position: 'relative' }}>
                <Image source={{ uri: product.image }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                {lowStock && (
                  <Badge style={{ position: 'absolute', top: 10, right: 10, minWidth: 60, height: 24, borderRadius: 12, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center', borderWidth: 0 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Bajo stock</Text>
                  </Badge>
                )}
              </View>
              <CardContent style={{ padding: 12 }}>
                <Text style={{ fontSize: 14, color: '#F5F7F8', marginBottom: 2 }} numberOfLines={1}>{product.name}</Text>
                <Text style={{ fontSize: 12, color: '#E6EAEA', marginBottom: 8 }}>Stock: {product.stock}</Text>
                <Text style={{ color: '#107361', fontWeight: 'bold', fontSize: 15, marginBottom: 8 }}>Bs. {product.price.toLocaleString()}</Text>
                <Button
                  onPress={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  style={{ width: '100%', backgroundColor: '#107361', borderRadius: 8, height: 38, marginTop: 2 }}
                  textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 15 }}
                  size="sm"
                >
                  <Plus size={16} color="#fff" style={{ marginRight: 4 }} />
                  {inCart ? `En carrito (${cartItem.quantity})` : "Agregar"}
                </Button>
              </CardContent>
            </Card>
          );
        }}
      />
      {/* Dialog del carrito */}
      <Dialog visible={showCart} onClose={() => setShowCart(false)}>
        <View style={{ backgroundColor: '#0A3A40', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245,247,248,0.1)', maxWidth: 400, alignSelf: 'center', width: '100%', padding: 0, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: 28, paddingTop: 24, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <Text style={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 22, textAlign: 'center', flex: 1 }}>Carrito de compras</Text>
              <Button onPress={() => setShowCart(false)} variant="ghost" style={{ position: 'absolute', right: 0, top: 0, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F5F7F8', fontSize: 26, marginTop: -2 }}>×</Text>
              </Button>
            </View>
            <Text style={{ color: '#E6EAEA', fontSize: 15, textAlign: 'center', marginBottom: 12 }}>{cart.length} producto(s) en el carrito</Text>
          </View>
          <View style={{ maxHeight: 260, paddingHorizontal: 20, paddingBottom: 8 }}>
            {cart.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <ShoppingCart size={48} color="#6b7280" style={{ marginBottom: 12 }} />
                <Text style={{ color: '#6b7280' }}>El carrito está vacío</Text>
              </View>
            ) : (
              <View style={{ gap: 18 }}>
                {cart.map((item) => (
                  <View key={item.product.id} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', borderRadius: 12, paddingVertical: 0, borderBottomWidth: 1, borderColor: '#25635A', marginBottom: 0, paddingBottom: 12 }}>
                    <Image source={{ uri: item.product.image }} style={{ width: 56, height: 56, borderRadius: 8, backgroundColor: '#F5F7F8', marginRight: 12 }} />
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 15, color: '#F5F7F8', fontWeight: 'bold', marginBottom: 2 }} numberOfLines={2}>{item.product.name}</Text>
                      <Text style={{ fontSize: 13, color: '#E6EAEA', marginBottom: 2 }}>Bs. {item.product.price.toLocaleString()}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0, backgroundColor: '#05292E', borderRadius: 8, marginTop: 2 }}>
                        <Button size="sm" variant="ghost" onPress={() => updateCartQuantity(item.product.id, item.quantity - 1)} style={{ width: 32, height: 32, padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={16} color="#F5F7F8" />
                        </Button>
                        <Text style={{ fontSize: 16, color: '#F5F7F8', width: 28, textAlign: 'center' }}>{item.quantity}</Text>
                        <Button size="sm" variant="ghost" onPress={() => updateCartQuantity(item.product.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} style={{ width: 32, height: 32, padding: 0, margin: 0, alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={16} color="#F5F7F8" />
                        </Button>
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', height: 56, marginLeft: 8 }}>
                      <Text style={{ fontSize: 15, color: '#107361', fontWeight: 'bold', marginBottom: 8 }}>Bs. {item.product.price.toLocaleString()}</Text>
                      <Button size="sm" variant="ghost" onPress={() => removeFromCart(item.product.id)} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                        <Trash2 size={18} color="#ef4444" />
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
          {/* Total y acciones */}
          <View style={{ borderTopWidth: 1, borderColor: '#25635A', marginTop: 8, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ color: '#E6EAEA', fontSize: 19, fontWeight: 'bold' }}>Total:</Text>
              <Text style={{ fontSize: 24, color: '#107361', fontWeight: 'bold' }}>Bs. {cartTotal.toLocaleString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button variant="outline" onPress={clearCart} style={{ flex: 1, borderRadius: 8, borderColor: '#ef4444', borderWidth: 1, backgroundColor: 'transparent', height: 44 }} textStyle={{ color: '#ef4444', fontWeight: 'bold', fontSize: 15 }}>
                <Trash2 size={16} color="#ef4444" style={{ marginRight: 8 }} />
                Vaciar
              </Button>
              <Button onPress={handleProceedToCheckout} style={{ flex: 1, backgroundColor: '#107361', borderRadius: 8, height: 44 }} textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 15 }}>
                Procesar venta
              </Button>
            </View>
          </View>
        </View>
      </Dialog>
      {/* Dialog de búsqueda de cliente (pixel-perfect según imagen) */}
      <Dialog visible={showClientDialog} onClose={() => setShowClientDialog(false)}>
        <View style={{ backgroundColor: '#0A3A40', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(245,247,248,0.1)', maxWidth: 400, alignSelf: 'center', width: '100%', padding: 0, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: 28, paddingTop: 20, paddingBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <Text style={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 }}>Datos del cliente</Text>
              <Button onPress={() => setShowClientDialog(false)} variant="ghost" style={{ position: 'absolute', right: 0, top: 0, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F5F7F8', fontSize: 22 }}>×</Text>
              </Button>
            </View>
            <Text style={{ color: '#E6EAEA', fontSize: 15, textAlign: 'center', marginBottom: 18, marginTop: 2 }}>Ingrese el NIT o CI del cliente</Text>
            <Text style={{ color: '#F5F7F8', fontSize: 15, marginBottom: 8, fontWeight: 'bold' }}>NIT / CI</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'transparent', borderRadius: 8, borderWidth: 2, borderColor: '#25635A', paddingHorizontal: 8, height: 44 }}>
              <Input
                value={clientDocument}
                onChangeText={setClientDocument}
                placeholder="1234567"
                keyboardType="numeric"
                style={{ flex: 1, backgroundColor: 'transparent', borderWidth: 0, color: '#F5F7F8', fontSize: 16, paddingLeft: 0 }}
                placeholderTextColor="#6b7280"
              />
              <Button
                onPress={() => {
                  // Simulación de búsqueda de cliente
                  // Reemplaza esto por tu lógica real de búsqueda
                  if (clientDocument === "1234567") {
                    setSelectedClient({
                      name: "Juan Pérez García",
                      document: "1234567",
                      phone: "71234567",
                      email: "juanperez@email.com"
                    });
                    setClientSearchState("found");
                  } else {
                    setSelectedClient(null);
                    setClientSearchState("notfound");
                  }
                }}
                style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: '#107361', marginLeft: 6, alignItems: 'center', justifyContent: 'center', padding: 0 }}
                variant="ghost"
              >
                <Search size={20} color="#F5F7F8" />
              </Button>
            </View>
          </View>
          {/* Resultado de búsqueda de cliente */}
          {clientSearchState === "found" && selectedClient && (
            <View style={{ backgroundColor: '#07363B', borderRadius: 12, marginTop: 18, padding: 16 }}>
              <Text style={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>{selectedClient.name}</Text>
              <Text style={{ color: '#E6EAEA', fontSize: 14, marginBottom: 2 }}>Doc: {selectedClient.document}</Text>
              <Text style={{ color: '#E6EAEA', fontSize: 14, marginBottom: 10 }}>Tel: {selectedClient.phone}</Text>
              <Button
                onPress={() => {
                  handleCompleteSale(selectedClient);
                  setClientSearchState("idle");
                  setClientDocument("");
                }}
                style={{ backgroundColor: '#107361', borderRadius: 8, height: 44, marginTop: 4 }}
                textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 16 }}
              >
                Confirmar venta
              </Button>
            </View>
          )}
          {clientSearchState === "notfound" && (
            <View style={{ backgroundColor: '#07363B', borderRadius: 12, marginTop: 18, padding: 16 }}>
              <Text style={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>Nuevo cliente</Text>
              <Text style={{ color: '#E6EAEA', fontSize: 14, marginBottom: 12 }}>El cliente no existe. Complete los datos para crearlo.</Text>
              <Input
                value={newClientData.name}
                onChangeText={v => setNewClientData({ ...newClientData, name: v })}
                placeholder="Nombre completo *"
                style={{ backgroundColor: 'transparent', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, height: 40, fontSize: 15, borderWidth: 1, marginBottom: 8 }}
                placeholderTextColor="#6b7280"
              />
              <Input
                value={clientDocument}
                onChangeText={v => { setClientDocument(v); setNewClientData({ ...newClientData, document: v }); }}
                placeholder="NIT / CI *"
                style={{ backgroundColor: 'transparent', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, height: 40, fontSize: 15, borderWidth: 1, marginBottom: 8 }}
                placeholderTextColor="#6b7280"
                keyboardType="numeric"
              />
              <Input
                value={newClientData.phone}
                onChangeText={v => setNewClientData({ ...newClientData, phone: v })}
                placeholder="Teléfono *"
                style={{ backgroundColor: 'transparent', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, height: 40, fontSize: 15, borderWidth: 1, marginBottom: 8 }}
                placeholderTextColor="#6b7280"
                keyboardType="phone-pad"
              />
              <Input
                value={newClientData.email}
                onChangeText={v => setNewClientData({ ...newClientData, email: v })}
                placeholder="Email"
                style={{ backgroundColor: 'transparent', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, height: 40, fontSize: 15, borderWidth: 1, marginBottom: 14 }}
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
              />
              <Button
                onPress={() => {
                  // Aquí deberías guardar el cliente en tu backend o contexto
                  setSelectedClient({ ...newClientData });
                  setClientSearchState("found");
                }}
                style={{ backgroundColor: '#107361', borderRadius: 8, height: 44, marginBottom: 8 }}
                textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 16 }}
              >
                Crear y continuar
              </Button>
              <Button
                onPress={() => {
                  setClientSearchState("idle");
                  setNewClientData({ name: "", document: "", phone: "", email: "" });
                  setClientDocument("");
                }}
                style={{ backgroundColor: '#07363B', borderRadius: 8, height: 44 }}
                textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 16 }}
              >
                Cancelar
              </Button>
            </View>
          )}
        </View>
      </Dialog>
      {/* Dialog de nuevo cliente */}
      <Dialog visible={showNewClientDialog} onClose={() => setShowNewClientDialog(false)}>
        <View style={{ backgroundColor: '#0A3A40', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(245,247,248,0.1)', maxWidth: 400, alignSelf: 'center', width: '100%', padding: 0, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>
              <Text style={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 20, textAlign: 'center', flex: 1 }}>Nuevo cliente</Text>
              <Button onPress={() => setShowNewClientDialog(false)} variant="ghost" style={{ position: 'absolute', right: 0, top: 0, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F5F7F8', fontSize: 22 }}>×</Text>
              </Button>
            </View>
            {/* Aquí puedes mostrar datos del nuevo cliente si es necesario, pero se eliminó la referencia a email para evitar el error. */}
          </View>
        </View>
      </Dialog>
    </View>
  );
}
