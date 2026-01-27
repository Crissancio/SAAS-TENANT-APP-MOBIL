import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export function Checkbox({
  checked,
  onChange,
  disabled,
  style,
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.root,
        checked && styles.checked,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      onPress={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      {checked && (
        <View style={styles.iconWrapper}>
          <Check size={16} color={Colors.foreground} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    backgroundColor: Colors.backgroundLight || '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  checked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
