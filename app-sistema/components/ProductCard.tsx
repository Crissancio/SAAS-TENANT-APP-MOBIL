import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ProductoConStock } from "../types";

// Colores del tema
const COLORS = {
    background: "#042326",
    card: "#0A3A40",
    border: "#15545A",
    primary: "#1D7373",
    button: "#107361",
    text: "#FFFFFF",
    muted: "#B6C2CF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
};

interface ProductCardProps {
    producto: ProductoConStock;
    onAddToCart?: () => void;
    cantidadEnCarrito?: number;
}

export function ProductCard({ producto, onAddToCart, cantidadEnCarrito = 0 }: ProductCardProps) {
    const stockDisponible = producto.stock?.cantidad ?? 0;
    const sinStock = stockDisponible === 0;

    // URL de la imagen
    const imageUrl = producto.imagen
        ? `${process.env.EXPO_PUBLIC_API_URL}${producto.imagen}`
        : null;

    return (
        <View style={styles.card}>
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="cube-outline" size={32} color={COLORS.muted} />
                    </View>
                )}

                {/* Badge de stock */}
                {sinStock && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>Agotado</Text>
                    </View>
                )}

                {/* Badge cantidad en carrito */}
                {cantidadEnCarrito > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cantidadEnCarrito}</Text>
                    </View>
                )}
            </View>

            {/* Info del producto */}
            <View style={styles.info}>
                <Text style={styles.nombre} numberOfLines={2}>
                    {producto.nombre}
                </Text>

                <Text style={styles.categoria}>
                    {producto.categoria?.nombre || "Sin categoría"}
                </Text>

                <View style={styles.priceRow}>
                    <Text style={styles.precio}>
                        Bs. {producto.precio_venta.toFixed(2)}
                    </Text>
                    <Text style={styles.stock}>
                        Stock: {stockDisponible}
                    </Text>
                </View>
            </View>

            {/* Botón agregar */}
            <TouchableOpacity
                style={[styles.addButton, sinStock && styles.addButtonDisabled]}
                onPress={onAddToCart}
                disabled={sinStock}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={cantidadEnCarrito > 0 ? "add" : "cart-outline"}
                    size={22}
                    color={sinStock ? COLORS.muted : COLORS.text}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: "48%",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: COLORS.background,
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    outOfStockBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: COLORS.error,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    outOfStockText: {
        color: COLORS.text,
        fontSize: 10,
        fontWeight: "600",
    },
    cartBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: COLORS.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        color: COLORS.text,
        fontSize: 12,
        fontWeight: "700",
    },
    info: {
        padding: 10,
    },
    nombre: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 2,
        lineHeight: 18,
    },
    categoria: {
        color: COLORS.muted,
        fontSize: 11,
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    precio: {
        color: COLORS.success,
        fontSize: 15,
        fontWeight: "700",
    },
    stock: {
        color: COLORS.muted,
        fontSize: 11,
    },
    addButton: {
        backgroundColor: COLORS.button,
        margin: 10,
        marginTop: 0,
        height: 38,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    addButtonDisabled: {
        backgroundColor: COLORS.border,
    },
});
