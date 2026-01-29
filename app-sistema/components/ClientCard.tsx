import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Cliente } from "../types";

// Colores del tema
const COLORS = {
    background: "#042326",
    card: "#0A3A40",
    border: "#15545A",
    primary: "#1D7373",
    text: "#FFFFFF",
    muted: "#B6C2CF",
    success: "#10B981",
    error: "#EF4444",
};

interface ClientCardProps {
    cliente: Cliente;
    onPress?: () => void;
    onEdit?: () => void;
}

export function ClientCard({ cliente, onPress, onEdit }: ClientCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={COLORS.text} />
            </View>

            <View style={styles.info}>
                <Text style={styles.nombre}>{cliente.nombre}</Text>

                {cliente.documento && (
                    <View style={styles.row}>
                        <Ionicons name="card-outline" size={14} color={COLORS.muted} />
                        <Text style={styles.detalle}>{cliente.documento}</Text>
                    </View>
                )}

                {cliente.telefono && (
                    <View style={styles.row}>
                        <Ionicons name="call-outline" size={14} color={COLORS.muted} />
                        <Text style={styles.detalle}>{cliente.telefono}</Text>
                    </View>
                )}

                {cliente.email && (
                    <View style={styles.row}>
                        <Ionicons name="mail-outline" size={14} color={COLORS.muted} />
                        <Text style={styles.detalle}>{cliente.email}</Text>
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                <View style={[
                    styles.badge,
                    { backgroundColor: cliente.estado ? COLORS.success + "22" : COLORS.error + "22" }
                ]}>
                    <Text style={[
                        styles.badgeText,
                        { color: cliente.estado ? COLORS.success : COLORS.error }
                    ]}>
                        {cliente.estado ? "Activo" : "Inactivo"}
                    </Text>
                </View>

                {onEdit && (
                    <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
                        <Ionicons name="pencil" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
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
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    nombre: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    detalle: {
        color: COLORS.muted,
        fontSize: 13,
        marginLeft: 6,
    },
    actions: {
        alignItems: "flex-end",
        justifyContent: "space-between",
        height: "100%",
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: "600",
    },
    editBtn: {
        marginTop: 8,
        padding: 4,
    },
});
