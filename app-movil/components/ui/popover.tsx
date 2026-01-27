import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Popover({ visible, onClose, children, style }: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.content, style]}>{children}</View>
    </Modal>
  );
}

export function PopoverTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function PopoverContent({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.innerContent, style]}>{children}</View>;
}

export function PopoverAnchor({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.13)',
  },
  content: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    backgroundColor: Colors.popover || Colors.card || '#fff',
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
    zIndex: 100,
  },
  innerContent: {
    // Para contenido interno
  },
});
