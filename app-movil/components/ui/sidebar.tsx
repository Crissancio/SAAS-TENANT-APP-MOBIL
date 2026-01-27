import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

// Sidebar simple para mobile/tablet (no incluye lógica de colapsar ni cookies)
export function Sidebar({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.sidebar, style]}>{children}</View>;
}

export function SidebarHeader({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function SidebarFooter({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.footer, style]}>{children}</View>;
}

export function SidebarContent({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.content, style]}>{children}</View>;
}

export function SidebarGroup({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function SidebarSeparator({ style }: { style?: any }) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: Colors.card,
    borderRightWidth: 1,
    borderRightColor: Colors.border || '#e5e7eb',
    flexDirection: 'column',
    paddingVertical: 12,
    paddingHorizontal: 8,
    height: '100%',
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
  },
  content: {
    flex: 1,
    marginVertical: 8,
  },
  group: {
    marginVertical: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border || '#e5e7eb',
    marginVertical: 8,
  },
});
