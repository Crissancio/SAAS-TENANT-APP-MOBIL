import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function Badge({
  children,
  variant = 'default',
  style,
  ...props
}: ViewProps & { variant?: BadgeVariant; children: React.ReactNode }) {
  return (
    <View style={[styles.base, badgeVariantStyle[variant], style]} {...props}>
      <Text style={[styles.text, badgeTextStyle[variant]]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minHeight: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

const badgeVariantStyle = {
  default: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  secondary: {
    backgroundColor: Colors.secondary,
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: Colors.error,
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.text,
  },
};

const badgeTextStyle = {
  default: {
    color: Colors.foreground,
  },
  secondary: {
    color: Colors.foreground,
  },
  destructive: {
    color: '#fff',
  },
  outline: {
    color: Colors.text,
  },
};
