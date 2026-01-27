import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export function Pagination({ children, style }: { children: React.ReactNode; style?: any }) {
  // accessibilityRole="navigation" no es válido en React Native, se omite
  return (
    <View style={[styles.pagination, style]}>
      {children}
    </View>
  );
}

export function PaginationContent({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

export function PaginationItem({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

export function PaginationLink({ isActive, onPress, children, style }: {
  isActive?: boolean;
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.link, isActive && styles.activeLink, style]}
      onPress={onPress}
      accessibilityState={{ selected: !!isActive }}
      activeOpacity={0.8}
    >
      <Text style={[styles.linkText, isActive && styles.activeLinkText]}>{children}</Text>
    </TouchableOpacity>
  );
}

export function PaginationPrevious({ onPress, style }: { onPress: () => void; style?: any }) {
  return (
    <PaginationLink onPress={onPress} style={style}>
      <ChevronLeft size={18} color={Colors.text} />
      <Text style={styles.arrowText}>Anterior</Text>
    </PaginationLink>
  );
}

export function PaginationNext({ onPress, style }: { onPress: () => void; style?: any }) {
  return (
    <PaginationLink onPress={onPress} style={style}>
      <Text style={styles.arrowText}>Siguiente</Text>
      <ChevronRight size={18} color={Colors.text} />
    </PaginationLink>
  );
}

export function PaginationEllipsis({ style }: { style?: any }) {
  return (
    <View style={[styles.ellipsis, style]}>
      <MoreHorizontal size={18} color={Colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
  },
  activeLink: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '11',
  },
  linkText: {
    fontSize: 15,
    color: Colors.text,
    marginHorizontal: 4,
  },
  activeLinkText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  arrowText: {
    fontSize: 15,
    marginHorizontal: 2,
    color: Colors.text,
  },
  ellipsis: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
});
