import React, { useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "../../components/ui/Input";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/Dialog";

// Simulación de datos (reemplaza por tu contexto real)
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  image: any;
  description: string;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Laptop HP",
    category: "Electrónica",
    price: 4500,
    stock: 5,
    minStock: 3,
    image: require("../../assets/images/laptop-hp.jpg"),
    description: "Laptop HP 15.6\" Intel Core i5",
  },
  {
    id: 2,
    name: "Mouse Logitech",
    category: "Accesorios",
    price: 85,
    stock: 2,
    minStock: 5,
    image: require("../../assets/images/mouse-logitech.jpg"),
    description: "Mouse inalámbrico Logitech M170",
  },
  {
    id: 3,
    name: "Teclado Mecánico",
    category: "Accesorios",
    price: 320,
    stock: 8,
    minStock: 2,
    image: require("../../assets/images/teclado-mecanico.jpg"),
    description: "Teclado Mecánico retroiluminado",
  },
  {
    id: 4,
    name: "Monitor LG 24\"",
    category: "Electrónica",
    price: 890,
    stock: 12,
    minStock: 3,
    image: require("../../assets/images/monitor-lg.jpg"),
    description: "Monitor LG 24\" Full HD",
  },
  {
    id: 5,
    name: "Webcam HD",
    category: "Accesorios",
    price: 250,
    stock: 1,
    minStock: 2,
    image: require("../../assets/images/webcam.jpg"),
    description: "Webcam HD 1080p",
  },
];


export default function InventoryScreen() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  const filtered = PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );
  const lowStockCount = PRODUCTS.filter((p) => p.stock <= p.minStock).length;

  const handleShowDetail = (product: Product) => {
    setSelected(product);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelected(null);
  };

  return (
    <View style={styles.bg}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>Inventario</Text>
        {lowStockCount > 0 && (
          <Badge variant="destructive" style={styles.lowStockBadge}>
            <Feather name="alert-triangle" size={13} color="#fff" style={{ marginRight: 2 }} />
            {lowStockCount} bajo stock
          </Badge>
        )}
      </View>
      {/* Buscador */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#A0B6B8" style={styles.searchIcon} />
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChangeText={setSearch}
          style={styles.input}
        />
      </View>
      {/* Línea divisoria debajo del buscador */}
      <View style={styles.divider} />
      {/* Lista de productos */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const lowStock = item.stock <= item.minStock;
          const stockPercent = Math.min((item.stock / item.minStock) * 100, 100);
          return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => handleShowDetail(item)}>
              <Card style={styles.card}>
                <CardContent style={styles.cardContent}>
                  <View style={styles.productRow}>
                    <View style={styles.imageBox}>
                      <Image source={item.image} style={styles.image} resizeMode="cover" />
                    </View>
                    <View style={styles.infoBox}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                        {lowStock && (
                          <Badge variant="destructive" style={styles.badgeBajo}>Bajo</Badge>
                        )}
                      </View>
                      <Text style={styles.productCategory}>{item.category}</Text>
                      <View style={styles.rowBetween}>
                        <View>
                          <Text style={styles.productPrice}>Bs. {item.price.toLocaleString()}</Text>
                          <Text style={styles.productStock}>Stock: {item.stock} unidades</Text>
                        </View>
                        <View style={styles.stockBarBox}>
                          <View style={styles.stockBarBg}>
                            <View style={[styles.stockBarFill, lowStock ? styles.stockBarFillLow : styles.stockBarFillOk, { width: `${stockPercent}%` }]} />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <MaterialCommunityIcons name="package-variant" size={48} color="#A0B6B8" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyText}>No se encontraron productos</Text>
          </View>
        }
      />
      {/* Dialog de detalle */}
      <Dialog visible={showDetail} onClose={handleCloseDetail} style={styles.dialogContent}>
        {selected && (
          <>
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
              <DialogDescription>Detalles del producto</DialogDescription>
            </DialogHeader>
            <View style={styles.detailImageBox}>
              <Image source={selected.image} style={styles.detailImage} resizeMode="contain" />
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Descripción</Text>
              <Text style={styles.detailValue}>{selected.description}</Text>
            </View>
            <View style={styles.detailRowGrid}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Categoría</Text>
                <Badge variant="outline" style={styles.detailBadge}>{selected.category}</Badge>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Precio</Text>
                <Text style={styles.detailPrice}>Bs. {selected.price.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRowGrid}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Stock actual</Text>
                <Text style={styles.detailStock}>{selected.stock}</Text>
                <Text style={styles.detailStockUnit}>unidades</Text>
              </View>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Stock mínimo</Text>
                <Text style={styles.detailStock}>{selected.minStock}</Text>
                <Text style={styles.detailStockUnit}>unidades</Text>
              </View>
            </View>
            {/* Estado de stock */}
            {selected.stock <= selected.minStock ? (
              <View style={styles.statusBoxLow}>
                <Feather name="alert-triangle" size={20} color="#E53935" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.statusTextLow}>Stock bajo</Text>
                  <Text style={styles.statusSubTextLow}>Se recomienda reabastecer</Text>
                </View>
              </View>
            ) : (
              <View style={styles.statusBoxOk}>
                <Feather name="package" size={20} color="#22c55e" style={{ marginRight: 8 }} />
                <View>
                  <Text style={styles.statusTextOk}>Stock normal</Text>
                  <Text style={styles.statusSubTextOk}>Inventario suficiente</Text>
                </View>
              </View>
            )}
          </>
        )}
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
    backgroundColor: '#ffffff00',
    borderBottomWidth: 1,
    borderColor: '#15545A',
    zIndex: 2,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
    fontSize: 13,
    height: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#0a3a4000',
    zIndex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    top: 20,
    zIndex: 2,
  },
  input: {
    flex: 1,
    paddingLeft: 32,
    backgroundColor: '#14383C',
    borderColor: '#1A4A50',
    color: '#E6EAEA',
    fontSize: 15,
    minHeight: 44,
    height: 44,
    borderRadius: 8,
  },
    divider: {
      height: 1,
      backgroundColor: '#15545A',
      marginHorizontal: 0,
      marginBottom: 2,
    },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 24,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#15545A',
    backgroundColor: '#0A3A40',
  },
  cardContent: {
    padding: 0,
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    padding: 4,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#14383C',
    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  infoBox: {
    flex: 1,
    minWidth: 0,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  badgeBajo: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    height: 20,
  },
  productCategory: {
    color: '#A0B6B8',
    fontSize: 13,
    marginBottom: 2,
  },
  productPrice: {
    color: '#22c55e',
    fontSize: 15,
  },
  productStock: {
    color: '#B6C2CF',
    fontSize: 12,
  },
  stockBarBox: {
    width: 48,
    marginLeft: 8,
    alignItems: 'flex-end',
  },
  stockBarBg: {
    width: '100%',
    height: 7,
    backgroundColor: '#14383C',
    borderRadius: 6,
    overflow: 'hidden',
  },
  stockBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  stockBarFillOk: {
    backgroundColor: '#22c55e',
  },
  stockBarFillLow: {
    backgroundColor: '#E53935',
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
  dialogContent: {
    backgroundColor: '#0A3A40',
    borderRadius: 18,
    width: '100%',
    padding: 20,
  },
  detailImageBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#14383C',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 18,
    marginTop: 8,
  },
  detailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  detailSection: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  detailLabel: {
    color: '#A0B6B8',
    fontSize: 13,
    marginBottom: 2,
  },
  detailValue: {
    color: '#fff',
    fontSize: 15,
  },
  detailRowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  detailCol: {
    flex: 1,
  },
  detailBadge: {
    borderColor: '#1A4A50',
    color: '#E6EAEA',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  detailPrice: {
    color: '#22c55e',
    fontSize: 18,
    marginTop: 2,
  },
  detailDivider: {
    borderBottomWidth: 1,
    borderColor: '#15545A',
    marginVertical: 8,
    marginHorizontal: 2,
  },
  detailStock: {
    color: '#fff',
    fontSize: 20,
    marginTop: 2,
  },
  detailStockUnit: {
    color: '#A0B6B8',
    fontSize: 12,
    marginBottom: 2,
  },
  statusBoxLow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5393520',
    borderColor: '#E5393530',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 2,
  },
  statusTextLow: {
    color: '#E53935',
    fontSize: 15,
    marginBottom: 2,
  },
  statusSubTextLow: {
    color: '#E53935',
    fontSize: 12,
  },
  statusBoxOk: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e20',
    borderColor: '#22c55e30',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 2,
  },
  statusTextOk: {
    color: '#22c55e',
    fontSize: 15,
    marginBottom: 2,
  },
  statusSubTextOk: {
    color: '#22c55e',
    fontSize: 12,
  },
});
