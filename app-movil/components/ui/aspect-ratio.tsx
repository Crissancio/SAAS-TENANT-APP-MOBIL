import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

// Props: ratio (ej: 16/9, 1, 4/3, etc)
export function AspectRatio({
  ratio = 1,
  style,
  children,
  ...props
}: ViewProps & { ratio?: number; children: React.ReactNode }) {
  return (
    <View
      style={[
        styles.container,
        style,
        { aspectRatio: ratio },
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'stretch',
  },
});
