import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function Label({ children, style, ...props }: {
  children: React.ReactNode;
  style?: any;
  [key: string]: any;
}) {
  return (
    <Text
      style={[styles.label, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
});
