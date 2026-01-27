import React, { useRef, useEffect } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Animated, Dimensions, FlatList, Text } from 'react-native';
import { MoreVertical, Check } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export function ContextMenu({
  visible,
  onClose,
  items,
  onSelect,
  anchor,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  items: { label: string; value: string; icon?: React.ReactNode; destructive?: boolean }[];
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
                  item.destructive && styles.destructiveItem,
                ]}
                onPress={() => {
                  onSelect(item.value);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                {item.icon && <View style={styles.icon}>{item.icon}</View>}
                <Text style={[
                  styles.label,
                  item.destructive && styles.destructiveLabel,
                ]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      </Modal>
    </>
  );
}

export function ContextMenuTrigger({ children, onPress, style }: { children: React.ReactNode; onPress: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={onPress} activeOpacity={0.7}>
      {children}
      <MoreVertical size={18} color={Colors.muted} style={{ marginLeft: 4 }} />
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
    top: 120, // Ajustar según el uso real
    left: 24,
    right: 24,
    backgroundColor: Colors.card || '#fff',
    borderRadius: Radius.lg || 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
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
  destructiveItem: {
    backgroundColor: Colors.destructive + '11',
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  destructiveLabel: {
    color: Colors.destructive,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
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
