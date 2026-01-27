import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function HoverCard({
  visible,
  onClose,
  children,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  // En móvil, el hover se simula con un toque largo o tap
  if (!visible) return null;
  return (
    <View style={[styles.overlay]}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.card, style]}>{children}</View>
    </View>
  );
}

export function HoverCardTrigger({ children, onLongPress, style }: { children: React.ReactNode; onLongPress: () => void; style?: any }) {
  // En móvil, usar onLongPress o onPress
  return (
    <TouchableOpacity style={style} onLongPress={onLongPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function HoverCardContent({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  card: {
    backgroundColor: Colors.popover || Colors.card || '#fff',
    borderRadius: Radius.lg || 14,
    padding: 16,
    minWidth: 220,
    maxWidth: 320,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
  },
  content: {
    // Para contenido interno
  },
});
