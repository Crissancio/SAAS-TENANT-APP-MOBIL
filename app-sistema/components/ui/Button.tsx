import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle, GestureResponderEvent } from "react-native";

const buttonColors = {
  default: {
    backgroundColor: '#107361',
    color: '#fff',
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#E6EAEA',
    borderColor: '#1A4A50',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#107361',
    borderColor: 'transparent',
  },
};

type ButtonProps = {
  variant?: 'default' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function Button({
  variant = 'default',
  style,
  textStyle,
  children,
  onPress,
  disabled,
}: ButtonProps) {
  const colors = buttonColors[variant] || buttonColors.default;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, { color: colors.color }, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 32,
    minWidth: 48,
    margin: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
