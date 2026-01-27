import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function Separator({ orientation = 'horizontal', style }: { orientation?: 'horizontal' | 'vertical'; style?: any }) {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
      accessibilityRole="separator"
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border || '#e5e7eb',
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border || '#e5e7eb',
    marginHorizontal: 8,
  },
});
