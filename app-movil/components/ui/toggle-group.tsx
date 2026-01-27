import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { Toggle } from './toggle';

export function ToggleGroup({
  value,
  onValueChange,
  children,
  style,
  variant = 'default',
  size = 'default',
  multiple = false,
}: {
  value: string | string[];
  onValueChange: (val: string | string[]) => void;
  children: React.ReactNode;
  style?: any;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  multiple?: boolean;
}) {
  return (
    <View style={[styles.group, style]}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const childValue = child.props.value;
        const pressed = multiple
          ? Array.isArray(value) && value.includes(childValue)
          : value === childValue;
        return React.cloneElement(child, {
          isPressed: pressed,
          onPress: () => {
            if (multiple) {
              if (Array.isArray(value)) {
                if (pressed) {
                  onValueChange(value.filter((v) => v !== childValue));
                } else {
                  onValueChange([...value, childValue]);
                }
              } else {
                onValueChange([childValue]);
              }
            } else {
              onValueChange(childValue);
            }
          },
          variant,
          size,
        });
      })}
    </View>
  );
}

export function ToggleGroupItem({ value, children, ...props }: { value: string; children: React.ReactNode; [key: string]: any }) {
  // No pasar "value" como prop a Toggle si Toggle no lo espera
  const { isPressed, onPress, variant, size } = props;
  return <Toggle pressed={isPressed} onPress={onPress} variant={variant} size={size}>{children}</Toggle>;
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    padding: 4,
    gap: 4,
  },
});
