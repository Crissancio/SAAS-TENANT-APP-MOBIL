import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Input({
  style,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      style={[
        styles.input,
        style,
        props.editable === false && styles.disabled,
        props['aria-invalid'] && styles.invalid,
      ]}
      placeholderTextColor={Colors.muted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    width: '100%',
    minWidth: 0,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    marginVertical: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  invalid: {
    borderColor: Colors.destructive || '#ef4444',
  },
});
