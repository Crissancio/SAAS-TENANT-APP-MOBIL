import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export function RadioGroup({ value, onValueChange, children, style }: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  style?: any;
}) {
  // Los hijos deben ser RadioGroupItem
  return (
    <View style={[styles.group, style]}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              selected: child.props.value === value,
              onValueChange,
            })
          : child
      )}
    </View>
  );
}

export function RadioGroupItem({ value, selected, onValueChange, label, style }: {
  value: string;
  selected?: boolean;
  onValueChange?: (val: string) => void;
  label: string;
  style?: any;
}) {
  return (
    <TouchableOpacity
      style={[styles.item, selected && styles.selected, style]}
      onPress={() => onValueChange && onValueChange(value)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      activeOpacity={0.7}
    >
      <View style={[styles.circle, selected && styles.circleSelected]}>
        {selected && <Circle size={16} color={Colors.primary} fill={Colors.primary} />}
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.full || 999,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    marginVertical: 2,
  },
  selected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '11',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  circleSelected: {
    backgroundColor: Colors.primary + '22',
  },
  label: {
    fontSize: 16,
    color: Colors.text,
  },
  labelSelected: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
