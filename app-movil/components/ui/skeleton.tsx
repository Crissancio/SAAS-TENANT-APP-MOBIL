import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function Skeleton({ style }: { style?: any }) {
  return <View style={[styles.skeleton, style]} />;
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.muted + '33',
    borderRadius: 8,
    height: 20,
    width: '100%',
    marginVertical: 4,
    // Animación de pulso simple
    opacity: 0.7,
  },
});
