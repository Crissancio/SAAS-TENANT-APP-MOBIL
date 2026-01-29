import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import type { Notificacion, TipoNotificacion } from "../types";

// Colores del tema
const COLORS = {
    background: "#042326",
    card: "#0A3A40",
    cardUnread: "#0D4A52",
    border: "#15545A",
    primary: "#1D7373",
    text: "#FFFFFF",
    muted: "#B6C2CF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
};

// Configuración de iconos y colores por tipo
const NOTIFICATION_CONFIG: Record<string, {
    icon: string;
    iconFamily: "Ionicons" | "MaterialCommunityIcons" | "Feather";
    color: string;
    label: string;
}> = {
    STOCK_BAJO: {
        icon: "alert-triangle",
        iconFamily: "Feather",
        color: COLORS.warning,
        label: "Stock bajo"
    },
    STOCK_AGOTADO: {
        icon: "alert-circle",
        iconFamily: "Feather",
        color: COLORS.error,
        label: "Sin stock"
    },
    VENTA_REALIZADA: {
        icon: "cart",
        iconFamily: "Ionicons",
        color: COLORS.success,
        label: "Venta"
    },
    VENTA_REGISTRADA: {
        icon: "receipt",
        iconFamily: "Ionicons",
        color: COLORS.success,
        label: "Venta"
    },
    COMPRA_APROBADA: {
        icon: "check-circle",
        iconFamily: "Feather",
        color: COLORS.info,
        label: "Compra"
    },
    PAGO_RECIBIDO: {
        icon: "cash",
        iconFamily: "Ionicons",
        color: COLORS.success,
        label: "Pago"
    },
    PAGO_VENTA_CONFIRMADO: {
        icon: "checkmark-circle",
        iconFamily: "Ionicons",
        color: COLORS.success,
        label: "Pago confirmado"
    },
    AJUSTE_INVENTARIO: {
        icon: "refresh-cw",
        iconFamily: "Feather",
        color: COLORS.info,
        label: "Ajuste"
    },
    GENERAL: {
        icon: "bell",
        iconFamily: "Feather",
        color: COLORS.muted,
        label: "General"
    },
};

interface NotificationItemProps {
    notificacion: Notificacion;
    onPress?: () => void;
    onMarkRead?: () => void;
}

export function NotificationItem({ notificacion, onPress, onMarkRead }: NotificationItemProps) {
    const config = NOTIFICATION_CONFIG[notificacion.tipo_evento] || NOTIFICATION_CONFIG.GENERAL;

    // Formatear fecha
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Ahora";
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays === 1) return "Ayer";
        if (diffDays < 7) return `Hace ${diffDays} días`;
        return date.toLocaleDateString();
    };

    // Renderizar icono según familia
    const renderIcon = () => {
        const iconProps = { size: 22, color: config.color };

        switch (config.iconFamily) {
            case "Ionicons":
                return <Ionicons name={config.icon as any} {...iconProps} />;
            case "MaterialCommunityIcons":
                return <MaterialCommunityIcons name={config.icon as any} {...iconProps} />;
            case "Feather":
                return <Feather name={config.icon as any} {...iconProps} />;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                !notificacion.leido && styles.cardUnread
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Indicador de no leído */}
            {!notificacion.leido && <View style={styles.unreadDot} />}

            {/* Icono */}
            <View style={[styles.iconContainer, { backgroundColor: config.color + "22" }]}>
                {renderIcon()}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={[styles.label, { color: config.color }]}>
                        {config.label}
                    </Text>
                    <Text style={styles.time}>
                        {formatDate(notificacion.fecha_creacion)}
                    </Text>
                </View>

                <Text
                    style={[styles.mensaje, !notificacion.leido && styles.mensajeUnread]}
                    numberOfLines={2}
                >
                    {notificacion.mensaje}
                </Text>
            </View>

            {/* Botón marcar como leída */}
            {!notificacion.leido && onMarkRead && (
                <TouchableOpacity
                    style={styles.markReadBtn}
                    onPress={(e) => {
                        e.stopPropagation();
                        onMarkRead();
                    }}
                >
                    <Ionicons name="checkmark" size={18} color={COLORS.primary} />
                </TouchableOpacity>
            )}
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
        position: "relative",
    },
    cardUnread: {
        backgroundColor: COLORS.cardUnread,
        borderColor: COLORS.primary + "44",
    },
    unreadDot: {
        position: "absolute",
        top: 14,
        left: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    time: {
        fontSize: 11,
        color: COLORS.muted,
    },
    mensaje: {
        color: COLORS.muted,
        fontSize: 14,
        lineHeight: 18,
    },
    mensajeUnread: {
        color: COLORS.text,
        fontWeight: "500",
    },
    markReadBtn: {
        padding: 8,
        marginLeft: 8,
    },
});
