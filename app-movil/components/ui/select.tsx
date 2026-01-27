import React from 'react';
import { Modal, View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export function Select({
  visible,
  onClose,
  items,
  selected,
  onSelect,
  trigger,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  items: { label: string; value: string }[];
  selected?: string;
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
  style?: any;
}) {
  return (
    <>
      {trigger}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <View style={[styles.menu, style]}>
          <FlatList
            data={items}
            keyExtractor={item => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selected === item.value && styles.selectedItem,
                ]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.label,
                  selected === item.value && styles.selectedLabel,
                ]}>{item.label}</Text>
                {selected === item.value && (
                  <Check size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}

export function SelectTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.triggerContent}>
        {children}
        <ChevronDown size={18} color={Colors.muted} style={{ marginLeft: 4 }} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.13)',
  },
  menu: {
    position: 'absolute',
    top: '30%',
    left: 24,
    right: 24,
    backgroundColor: Colors.card || '#fff',
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    paddingVertical: 8,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
    zIndex: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.md || 8,
  },
  selectedItem: {
    backgroundColor: Colors.primary + '22',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  selectedLabel: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 44,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
