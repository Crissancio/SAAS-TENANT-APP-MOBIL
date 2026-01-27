import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Tabs({ value, onValueChange, children, style }: {
  value: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  style?: any;
}) {
  return (
    <View style={[styles.tabs, style]}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              currentValue: value,
              onValueChange,
            })
          : child
      )}
    </View>
  );
}

export function TabsList({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function TabsTrigger({ value: tabValue, currentValue, onValueChange, children, style }: {
  value: string;
  currentValue: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
  style?: any;
}) {
  const active = currentValue === tabValue;
  return (
    <TouchableOpacity
      style={[styles.trigger, active && styles.activeTrigger, style]}
      onPress={() => onValueChange(tabValue)}
      activeOpacity={0.8}
    >
      <Text style={[styles.triggerText, active && styles.activeTriggerText]}>{children}</Text>
    </TouchableOpacity>
  );
}

export function TabsContent({ value: tabValue, currentValue, children, style }: {
  value: string;
  currentValue: string;
  children: React.ReactNode;
  style?: any;
}) {
  if (currentValue !== tabValue) return null;
  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'column',
    gap: 8,
  },
  list: {
    flexDirection: 'row',
    backgroundColor: Colors.muted + '22',
    borderRadius: Radius.lg || 16,
    padding: 4,
    marginBottom: 8,
  },
  trigger: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: Radius.lg || 16,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 2,
  },
  activeTrigger: {
    backgroundColor: Colors.card,
    borderColor: Colors.primary,
  },
  triggerText: {
    color: Colors.text,
    fontSize: 15,
  },
  activeTriggerText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
