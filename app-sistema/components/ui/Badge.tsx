import React from "react";
import { View, Text, StyleSheet, ViewProps, TextProps } from "react-native";

const badgeColors = {
  default: { backgroundColor: '#107361', color: '#fff', borderColor: 'transparent' },
  destructive: { backgroundColor: '#E53935', color: '#fff', borderColor: 'transparent' },
  outline: { backgroundColor: 'transparent', color: '#E6EAEA', borderColor: '#E53935' },
};

type BadgeProps = {
  variant?: 'default' | 'destructive' | 'outline';
  style?: any;
  textStyle?: any;
  children: React.ReactNode;
} & ViewProps;

export function Badge({ variant = 'default', style, textStyle, children, ...props }: BadgeProps) {
  const colors = badgeColors[variant] || badgeColors.default;
  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor }, style]} {...props}>
      <Text style={[styles.text, { color: colors.color }, textStyle]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    borderWidth: 1,
    minHeight: 18,
    minWidth: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
