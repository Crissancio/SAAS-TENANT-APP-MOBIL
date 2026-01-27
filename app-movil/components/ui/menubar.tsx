import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ChevronRight, Check, Circle } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

// Menubar: barra horizontal de menús (mobile: tipo tabs o acciones rápidas)
export function Menubar({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.menubar, style]}>{children}</View>;
}

export function MenubarMenu({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={style}>{children}</View>;
}

export function MenubarGroup({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function MenubarTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function MenubarContent({ visible, items, onSelect, style }: {
  visible: boolean;
  items: { label: string; value: string; icon?: React.ReactNode; destructive?: boolean; submenu?: any[] }[];
  onSelect: (value: string) => void;
  style?: any;
}) {
  if (!visible) return null;
  return (
    <View style={[styles.menu, style]}>
      <FlatList
        data={items}
        keyExtractor={item => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.item,
              item.destructive && styles.destructiveItem,
            ]}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.7}
          >
            {item.icon && <View style={styles.icon}>{item.icon}</View>}
            <Text style={[
              styles.label,
              item.destructive && styles.destructiveLabel,
            ]}>{item.label}</Text>
            {item.submenu && <ChevronRight size={16} color={Colors.muted} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export function MenubarItem({ children, onPress, style, destructive }: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.item, destructive && styles.destructiveItem, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, destructive && styles.destructiveLabel]}>{children}</Text>
    </TouchableOpacity>
  );
}

export function MenubarCheckboxItem({ checked, children, onPress, style }: {
  checked: boolean;
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress} activeOpacity={0.7}>
      <Check size={16} color={checked ? Colors.primary : Colors.muted} style={{ marginRight: 8 }} />
      <Text style={styles.label}>{children}</Text>
    </TouchableOpacity>
  );
}

export function MenubarRadioItem({ selected, children, onPress, style }: {
  selected: boolean;
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress} activeOpacity={0.7}>
      <Circle size={14} color={selected ? Colors.primary : Colors.muted} style={{ marginRight: 8 }} />
      <Text style={styles.label}>{children}</Text>
    </TouchableOpacity>
  );
}

export function MenubarLabel({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.label, styles.menuLabel, style]}>{children}</Text>;
}

export function MenubarSeparator({ style }: { style?: any }) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  menubar: {
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
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trigger: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.sm || 6,
    backgroundColor: Colors.input,
    marginHorizontal: 2,
  },
  menu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: Radius.sm || 6,
  },
  destructiveItem: {
    backgroundColor: Colors.destructive + '11',
  },
  label: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  destructiveLabel: {
    color: Colors.destructive,
    fontWeight: 'bold',
  },
  menuLabel: {
    fontWeight: '600',
    marginBottom: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border || '#e5e7eb',
    marginVertical: 4,
    marginHorizontal: 8,
  },
  icon: {
    marginRight: 10,
  },
});
