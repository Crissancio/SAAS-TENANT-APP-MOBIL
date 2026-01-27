import React, { useRef } from 'react';
import { View, PanResponder, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

// Panel redimensionable simple (horizontal)
export function ResizablePanelGroup({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function ResizablePanel({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

export function ResizableHandle({ onResize, style }: { onResize?: (dx: number) => void; style?: any }) {
  // Soporte básico de drag horizontal
  const pan = useRef({ x: 0 }).current;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 8,
    onPanResponderMove: (_, gesture) => {
      if (onResize) onResize(gesture.dx);
      pan.x = gesture.dx;
    },
    onPanResponderRelease: () => {
      pan.x = 0;
    },
  });
  return (
    <View
      style={[styles.handle, style]}
      {...panResponder.panHandlers}
      accessibilityRole="adjustable"
      accessibilityLabel="Redimensionar panel"
    />
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  handle: {
    width: 12,
    backgroundColor: Colors.border || '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'ew-resize',
  },
});
