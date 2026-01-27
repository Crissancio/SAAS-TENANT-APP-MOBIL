import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

// Tipos de variante
export type AlertVariant = 'default' | 'destructive';

// Alert
export function Alert({
  variant = 'default',
  style,
  children,
  ...props
}: ViewProps & { variant?: AlertVariant }) {
  // Colores según variante
  const backgroundColor = variant === 'destructive' ? (Colors.error || '#ef4444') : (Colors.card || '#fff');
  const borderColor = variant === 'destructive' ? (Colors.error || '#ef4444') : (Colors.border || '#e5e7eb');
  const textColor = variant === 'destructive' ? (Colors.error || '#ef4444') : (Colors.text || '#042326');

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderColor },
        style,
      ]}
      accessibilityRole="alert"
      {...props}
    >
      {/* Pasar color por contexto o prop si se requiere */}
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child as any, { variant, textColor })
          : child
      )}
    </View>
  );
}

// AlertTitle
export function AlertTitle({ children, style, textColor, variant }: { children: React.ReactNode; style?: any; textColor?: string; variant?: AlertVariant }) {
  return (
    <Text
      style={[styles.title, { color: textColor || (variant === 'destructive' ? Colors.error : Colors.text) }, style]}
      numberOfLines={1}
    >
      {children}
    </Text>
  );
}

// AlertDescription
export function AlertDescription({ children, style, textColor, variant }: { children: React.ReactNode; style?: any; textColor?: string; variant?: AlertVariant }) {
  return (
    <Text
      style={[
        styles.description,
        { color: variant === 'destructive' ? Colors.error : Colors.muted || '#666' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    flex: 1,
    minHeight: 18,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
