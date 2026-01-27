import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image } from "react-native";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Search, Package, AlertTriangle, X } from "lucide-react-native";
import type { Product } from "../contexts/AppContext";

export default function Inventory() {
  const router = useRouter();
  const { products } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShowDetail = (product: Product) => {
    setSelectedProduct(product);
    setShowDetailDialog(true);
  };

  const handleCloseDetail = () => {
    setShowDetailDialog(false);
    setSelectedProduct(null);
  };

  const lowStockProducts = products.filter(
    (p) => p.stock <= p.minStock
  ).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ paddingTop: 24, paddingBottom: 12, borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
        <View style={{ paddingHorizontal: 16, maxWidth: 400, alignSelf: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111' }}>Inventario</Text>
            {lowStockProducts > 0 && (
              <Badge variant="destructive">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} color="#ef4444" />
                  <Text style={{ color: '#fff', fontSize: 12 }}>{lowStockProducts} bajo stock</Text>
                </View>
              </Badge>
            )}
          </View>
          {/* Buscador */}
          <View style={{ position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: 12, top: 14 }} color="#6b7280" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ paddingLeft: 40, backgroundColor: '#f3f4f6', color: '#111', borderColor: '#e5e7eb' }}
            />
          </View>
        </View>
      </View>

      {/* Lista de productos */}
      <ScrollView contentContainerStyle={{ padding: 16, maxWidth: 400, alignSelf: 'center' }}>
        <View style={{ gap: 12 }}>
          {filteredProducts.map((product) => {
            const lowStock = product.stock <= product.minStock;
            const stockPercentage = (product.stock / product.minStock) * 100;
            return (
              <Button
                key={product.id}
                variant="ghost"
                style={{ padding: 0, margin: 0, borderRadius: 16 }}
                onPress={() => handleShowDetail(product)}
              >
                <Card
                  style={{ backgroundColor: '#fff', borderColor: '#e5e7eb', width: '100%' }}
                >
                  <CardContent style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ width: 80, height: 80, backgroundColor: '#f3f4f6', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                        <Image
                          source={{ uri: product.image }}
                          style={{ width: '100%', height: '100%' }} resizeMode="cover"
                        />
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 16, color: '#0A3A40', fontWeight: 'bold', flex: 1 }} numberOfLines={1}>{product.name}</Text>
                          {lowStock && (
                            <Badge variant="destructive" style={{ marginLeft: 8 }}>Bajo</Badge>
                          )}
                        </View>
                        <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{product.category}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View>
                            <Text style={{ fontSize: 14, color: '#107361' }}>Bs. {product.price.toLocaleString()}</Text>
                            <Text style={{ fontSize: 12, color: '#6b7280' }}>Stock: {product.stock} unidades</Text>
                          </View>
                          {/* Indicador visual de stock */}
                          <View style={{ width: 64 }}>
                            <View
                              style={{
                                height: '100%',
                                width: `${Math.min(stockPercentage, 100)}%`,
                                backgroundColor: lowStock ? '#ef4444' : '#22c55e',
                                borderRadius: 8,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </Button>
            );
          })}
        </View>
        {filteredProducts.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Package size={48} color="#6b7280" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#6b7280', marginBottom: 8 }}>No se encontraron productos</Text>
          </View>
        )}
      </ScrollView>

      {/* Dialog de detalle de producto */}
      <Dialog visible={showDetailDialog} onClose={handleCloseDetail}>
        {selectedProduct && (
          <>
            <DialogHeader>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <DialogTitle style={{ color: '#0A3A40', flex: 1, paddingRight: 32 }}>{selectedProduct.name}</DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={handleCloseDetail}
                  style={{ position: 'absolute', right: 0, top: 0 }}
                >
                  <X size={16} />
                </Button>
              </View>
              <DialogDescription style={{ color: '#6b7280' }}>Detalles del producto</DialogDescription>
            </DialogHeader>
            <View style={{ gap: 16 }}>
              {/* Imagen */}
              <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#f3f4f6', borderRadius: 12, overflow: 'hidden' }}>
                <Image
                  source={{ uri: selectedProduct.image }}
                  style={{ width: '100%', height: '100%' }} resizeMode="cover"
                />
              </View>
              {/* Información */}
              <View style={{ gap: 12 }}>
                <View>
                  <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Descripción</Text>
                  <Text style={{ fontSize: 16, color: '#0A3A40' }}>{selectedProduct.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Categoría</Text>
                    <Badge variant="outline">{selectedProduct.category}</Badge>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Precio</Text>
                    <Text style={{ fontSize: 20, color: '#107361', fontWeight: 'bold' }}>Bs. {selectedProduct.price.toLocaleString()}</Text>
                  </View>
                </View>
                <View style={{ borderTopWidth: 1, borderColor: '#e5e7eb', paddingTop: 12, flexDirection: 'row', gap: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Stock actual</Text>
                    <Text style={{ fontSize: 24, color: '#0A3A40', fontWeight: 'bold' }}>{selectedProduct.stock}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>unidades</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Stock mínimo</Text>
                    <Text style={{ fontSize: 24, color: '#0A3A40', fontWeight: 'bold' }}>{selectedProduct.minStock}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7280' }}>unidades</Text>
                  </View>
                </View>
                {/* Indicador de estado */}
                {selectedProduct.stock <= selectedProduct.minStock ? (
                  <View style={{ backgroundColor: '#ef4444', opacity: 0.1, borderWidth: 1, borderColor: '#ef4444', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    <View>
                      <Text style={{ fontSize: 14, color: '#ef4444', fontWeight: 'bold' }}>Stock bajo</Text>
                      <Text style={{ fontSize: 12, color: '#ef4444', opacity: 0.8 }}>Se recomienda reabastecer</Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ backgroundColor: '#22c55e', opacity: 0.1, borderWidth: 1, borderColor: '#22c55e', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Package size={20} color="#22c55e" />
                    <View>
                      <Text style={{ fontSize: 14, color: '#22c55e', fontWeight: 'bold' }}>Stock normal</Text>
                      <Text style={{ fontSize: 12, color: '#22c55e', opacity: 0.8 }}>Inventario suficiente</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
      </Dialog>
      {/* Navegar a ventas */}
      <Button
        variant="outline"
        size="sm"
        onPress={() => router.push("/sales")}
        style={{ position: 'absolute', right: 0, top: 0 }}
      >
        <Text style={{ color: '#0A3A40' }}>Ventas</Text>
      </Button>
    </View>
  );
}
