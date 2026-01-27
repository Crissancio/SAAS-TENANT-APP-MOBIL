import React from 'react';
import { View, Text, StyleSheet, ViewProps, TextProps } from 'react-native';
import { Colors } from '@/constants/theme';

export function Card({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

export function CardTitle({ children, style, ...props }: TextProps) {
  return (
    <Text style={[styles.title, style]} {...props}>{children}</Text>
  );
}

export function CardDescription({ children, style, ...props }: TextProps) {
  return (
    <Text style={[styles.description, style]} {...props}>{children}</Text>
  );
}

export function CardAction({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.action, style]} {...props}>
      {children}
    </View>
  );
}

export function CardContent({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.content, style]} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card || '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    paddingVertical: 0,
    paddingHorizontal: 0,
    flexDirection: 'column',
    gap: 24,
    overflow: 'hidden',
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    color: Colors.muted || '#666',
    fontSize: 14,
    marginBottom: 2,
  },
  action: {
    position: 'absolute',
    top: 24,
    right: 24,
    alignSelf: 'flex-end',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 0,
    gap: 12,
  },
});
