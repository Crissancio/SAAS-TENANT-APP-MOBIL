import React from 'react';
import { View, Switch as RNSwitch, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function Switch({ value, onValueChange, style }: {
  value: boolean;
  onValueChange: (val: boolean) => void;
  style?: any;
}) {
  return (
    <View style={style}>
      <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.input, true: Colors.primary + '99' }}
        thumbColor={value ? Colors.primary : Colors.card}
      />
    </View>
  );
}
