import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export function ScrollArea({ children, style, horizontal = false }: {
  children: React.ReactNode;
  style?: any;
  horizontal?: boolean;
}) {
  return (
    <ScrollView
      style={[styles.root, style]}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={horizontal}
      showsVerticalScrollIndicator={!horizontal}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {children}
    </ScrollView>
  );
}

export function ScrollBar() {
  // Los scrollbars nativos de RN no son personalizables, así que se usan los del sistema
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
