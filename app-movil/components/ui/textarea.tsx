import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Textarea({ style, ...props }: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      multiline
      numberOfLines={4}
      textAlignVertical="top"
      placeholderTextColor={Colors.muted}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 80,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    color: Colors.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 2,
  },
});
