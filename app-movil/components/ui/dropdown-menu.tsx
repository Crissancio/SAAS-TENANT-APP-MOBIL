import React, { useRef, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Animated, Dimensions, FlatList, Text } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export function DropdownMenu({
  visible,
  onClose,
  items,
  selected,
  onSelect,
  anchor,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  items: { label: string; value: string }[];
  selected?: string;
  onSelect: (value: string) => void;
  anchor: React.ReactNode;
  style?: any;
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      opacity.setValue(0);
    }
  }, [visible]);

  return (
    <>
      {anchor}
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onClose}
      >
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
        <Animated.View style={[styles.menu, style, { opacity }]}>  
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
        </Animated.View>
      </Modal>
    </>
  );
}

export function DropdownMenuTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress} activeOpacity={0.7}>
      {children}
      <ChevronDown size={18} color={Colors.muted} style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menu: {
    position: 'absolute',
    top: 100, // Ajustar según el uso real
    left: 20,
    right: 20,
    backgroundColor: Colors.card || '#fff',
    borderRadius: Radius.lg || 14,
    paddingVertical: 8,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
    maxHeight: 320,
    minWidth: width * 0.5,
    zIndex: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: Radius.md || 10,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md || 10,
    backgroundColor: Colors.input || '#f5f5f5',
  },
});
