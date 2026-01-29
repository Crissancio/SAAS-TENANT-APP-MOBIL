import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onHide?: () => void;
}

export function Toast({ visible, message, type = "info", onHide }: ToastProps) {
  useEffect(() => {
    if (visible && onHide) {
      const timer = setTimeout(onHide, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);
  if (!visible) return null;
  return (
    <View style={[styles.toast, styles[type]]}>
      <Feather name={type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'} size={20} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.toastText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    bottom: 24,
    left: 12,
    right: 12,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A3A40',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#107361',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 5,
  },
  toastText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "left",
    flex: 1,
    fontWeight: '500',
  },
  success: {
    backgroundColor: "#0A3A40",
    borderColor: "#107361",
  },
  error: {
    backgroundColor: "#0A3A40",
    borderColor: "#107361",
  },
  info: {
    backgroundColor: "#0A3A40",
    borderColor: "#3CCFCF",
  },
});
