import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}

export function Button({
  children,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  disabled,
  loading,
  onPress,
}: ButtonProps) {
  const variantStyle = buttonVariantStyles[variant] || buttonVariantStyles.default;
  const sizeStyle = buttonSizeStyles[size] || buttonSizeStyles.default;
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyle,
        sizeStyle,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'link' ? Colors.text : Colors.foreground} />
      ) : (
        <Text style={[styles.text, variantTextStyles[variant], textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md || 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    marginVertical: 4,
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

const buttonVariantStyles: Record<ButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  destructive: {
    backgroundColor: Colors.error,
    borderColor: 'transparent',
  },
  outline: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.text,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    borderColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
};

const buttonSizeStyles: Record<ButtonSize, ViewStyle> = {
  default: {},
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
  },
  icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const variantTextStyles: Record<ButtonVariant, TextStyle> = {
  default: {
    color: Colors.foreground,
  },
  destructive: {
    color: '#fff',
  },
  outline: {
    color: Colors.text,
  },
  secondary: {
    color: Colors.foreground,
  },
  ghost: {
    color: Colors.text,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
};
