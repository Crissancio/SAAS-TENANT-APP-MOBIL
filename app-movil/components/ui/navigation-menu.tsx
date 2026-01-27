import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

// NavigationMenu: barra de navegación tipo tabs/menu superior
export function NavigationMenu({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.menuBar, style]}>{children}</View>;
}

export function NavigationMenuList({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.menuList, style]}>{children}</View>;
}

export function NavigationMenuItem({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.menuItem, style]}>{children}</View>;
}

export function NavigationMenuTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.triggerContent}>
        {children}
        <ChevronDown size={16} color={Colors.muted} style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  );
}

export function NavigationMenuContent({ visible, children, style }: { visible: boolean; children: React.ReactNode; style?: any }) {
  if (!visible) return null;
  return <View style={[styles.content, style]}>{children}</View>;
}

export function NavigationMenuLink({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.link, style]} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function NavigationMenuIndicator({ style }: { style?: any }) {
  return <View style={[styles.indicator, style]} />;
}

export function NavigationMenuViewport({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.viewport, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  menuBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    padding: 4,
    marginVertical: 4,
    boxShadow: '0px 1px 2px rgba(0,0,0,0.06)',
  },
  menuList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  menuItem: {
    marginHorizontal: 2,
  },
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.md || 8,
    backgroundColor: Colors.input,
    marginHorizontal: 2,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  link: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm || 6,
    backgroundColor: 'transparent',
  },
  indicator: {
    height: 3,
    width: 32,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 2,
  },
  viewport: {
    marginTop: 8,
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
  },
});
