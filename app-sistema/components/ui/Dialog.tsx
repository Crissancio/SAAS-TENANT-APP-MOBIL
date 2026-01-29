import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Dialog({ visible, onClose, children, style }: { visible: boolean; onClose: () => void; children: React.ReactNode; style?: ViewStyle }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, style]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#A0B6B8" />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <View style={{ marginBottom: 12 }}>{children}</View>;
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>{children}</View>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.desc}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: "#0A3A40",
    borderRadius: 16,
    padding: 20,
    minWidth: 300,
    maxWidth: '100%',
    borderWidth: 1,
    borderColor: '#1A4A50',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  title: {
    color: '#E6EAEA',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  desc: {
    color: '#A0B6B8',
    fontSize: 14,
    marginBottom: 8,
  },
});
