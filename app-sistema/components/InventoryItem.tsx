import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { StockConProducto } from "../types";

// Colores del tema
const COLORS = {
    background: "#042326",
    card: "#0A3A40",
    border: "#15545A",
    primary: "#1D7373",
    text: "#FFFFFF",
    muted: "#B6C2CF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
};

interface InventoryItemProps {
    item: StockConProducto;
    onPress?: () => void;
}

export function InventoryItem({ item, onPress }: InventoryItemProps) {
    const { cantidad, stock_minimo, producto } = item;

    // Determinar estado del stock
    const sinStock = cantidad === 0;
    const stockBajo = cantidad > 0 && cantidad <= stock_minimo;
    const stockOk = cantidad > stock_minimo;

    // Color y texto según estado
    const statusColor = sinStock ? COLORS.error : stockBajo ? COLORS.warning : COLORS.success;
    const statusText = sinStock ? "Sin stock" : stockBajo ? "Stock bajo" : "En stock";
    const statusIcon = sinStock ? "alert-circle" : stockBajo ? "alert" : "checkmark-circle";

    // Porcentaje para barra de progreso (máximo 100%)
    const porcentaje = stock_minimo > 0
        ? Math.min((cantidad / (stock_minimo * 2)) * 100, 100)
        : cantidad > 0 ? 100 : 0;

    // URL de imagen
    const imageUrl = producto?.imagen
        ? `${process.env.EXPO_PUBLIC_API_URL}${producto.imagen}`
        : null;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Imagen del producto */}
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="package-variant"
                        size={28}
                        color={COLORS.muted}
                    />
                )}
            </View>

            <View style={styles.info}>
                {/* Nombre y categoría */}
                <Text style={styles.nombre} numberOfLines={1}>
                    {producto?.nombre || `Producto #${item.id_producto}`}
                </Text>

                {/* Precio del producto */}
                {producto?.precio_venta && (
                    <Text style={styles.precio}>
                        Bs. {producto.precio_venta.toFixed(2)}
                    </Text>
                )}

                {/* Stock info */}
                <View style={styles.stockRow}>
                    <View style={styles.stockInfo}>
                        <Text style={styles.stockLabel}>Actual</Text>
                        <Text style={[styles.stockValue, { color: statusColor }]}>
                            {cantidad}
                        </Text>
                    </View>
                    <View style={styles.stockDivider} />
                    <View style={styles.stockInfo}>
                        <Text style={styles.stockLabel}>Mínimo</Text>
                        <Text style={styles.stockMinValue}>{stock_minimo}</Text>
                    </View>
                </View>

                {/* Barra de progreso */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${porcentaje}%`, backgroundColor: statusColor }
                            ]}
                        />
                    </View>
                </View>
            </View>

            {/* Badge de estado */}
            <View style={styles.statusContainer}>
                <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
                    <Ionicons name={statusIcon as any} size={14} color={statusColor} />
                    <Text style={[styles.badgeText, { color: statusColor }]}>
                        {statusText}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    info: {
        flex: 1,
    },
    nombre: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 2,
    },
    precio: {
        color: COLORS.success,
        fontSize: 13,
        fontWeight: "500",
        marginBottom: 6,
    },
    stockRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    stockInfo: {
        alignItems: "center",
    },
    stockLabel: {
        color: COLORS.muted,
        fontSize: 10,
        marginBottom: 1,
    },
    stockValue: {
        fontSize: 16,
        fontWeight: "700",
    },
    stockMinValue: {
        color: COLORS.muted,
        fontSize: 14,
        fontWeight: "600",
    },
    stockDivider: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.border,
        marginHorizontal: 12,
    },
    progressContainer: {
        marginTop: 2,
    },
    progressBg: {
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        borderRadius: 2,
    },
    statusContainer: {
        marginLeft: 8,
    },
    badge: {
        flexDirection: "column",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 2,
    },
    badgeText: {
        fontSize: 9,
        fontWeight: "600",
        textAlign: "center",
    },
});
