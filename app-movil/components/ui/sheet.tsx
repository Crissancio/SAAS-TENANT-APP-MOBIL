import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export function Sheet({ visible, onClose, children, style }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.sheet, style]}>
        <TouchableOpacity style={styles.close} onPress={onClose} accessibilityLabel="Cerrar">
          <X size={22} color={Colors.muted} />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
}

export function SheetHeader({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function SheetFooter({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function SheetTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function SheetDescription({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: Colors.card || '#fff',
    borderTopLeftRadius: Radius.lg || 16,
    borderBottomLeftRadius: Radius.lg || 16,
    padding: 24,
    boxShadow: '-2px 0px 8px rgba(0,0,0,0.15)',
    zIndex: 100,
  },
  close: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: Colors.muted,
    marginBottom: 8,
  },
});
