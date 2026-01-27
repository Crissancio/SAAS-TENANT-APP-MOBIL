import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Toggle({
  pressed,
  onPress,
  children,
  style,
  variant = 'default',
  size = 'default',
}: {
  pressed: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, pressed && styles.textPressed]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md || 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 44,
    minHeight: 36,
  },
  default: {},
  outline: {
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: 'transparent',
  },
  pressed: {
    backgroundColor: Colors.primary + '22',
    borderColor: Colors.primary,
  },
  text: {
    color: Colors.text,
    fontSize: 15,
  },
  textPressed: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  lg: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
});
