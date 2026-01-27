import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Progress({ value = 0, style }: { value?: number; style?: any }) {
  return (
    <View style={[styles.root, style]} accessibilityRole="progressbar" accessibilityValue={{ now: value, min: 0, max: 100 }}>
      <Animated.View style={[styles.indicator, { width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 8,
    width: '100%',
    backgroundColor: Colors.primary + '33',
    borderRadius: Radius.full || 999,
    overflow: 'hidden',
  },
  indicator: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full || 999,
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
