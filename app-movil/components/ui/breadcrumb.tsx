import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewProps, TextProps } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export function Breadcrumb({ children, style, ...props }: ViewProps) {
  // accessibilityRole="navigation" no es válido en React Native, se omite
  return (
    <View style={[styles.nav, style]} {...props}>
      {children}
    </View>
  );
}

export function BreadcrumbList({ children, style }: ViewProps) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function BreadcrumbItem({ children, style }: ViewProps) {
  return <View style={[styles.item, style]}>{children}</View>;
}

export function BreadcrumbLink({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={styles.link}>{children}</Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({ children, style }: TextProps) {
  // accessibilityRole="link" es válido, pero aria-disabled debe ser booleano y sólo en web
  return (
    <Text style={[styles.page, style]} accessibilityRole="link" accessible={true}>
      {children}
    </Text>
  );
}

export function BreadcrumbSeparator({ children, style }: { children?: React.ReactNode; style?: any }) {
  return (
    <View style={[styles.separator, style]}>
      {children ?? <ChevronRight size={16} color={Colors.text} />}
    </View>
  );
}

export function BreadcrumbEllipsis({ style }: { style?: any }) {
  return (
    <View style={[styles.ellipsis, style]}>
      <MoreHorizontal size={18} color={Colors.text} />
      <Text style={styles.srOnly}>Más</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    color: Colors.text,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  page: {
    color: Colors.text,
    fontWeight: '400',
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsis: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    left: -9999,
    top: -9999,
  },
});
