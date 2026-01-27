import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Minus } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export function InputOTP({
  value,
  onChange,
  length = 6,
  style,
  containerStyle,
  ...props
}: {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  style?: any;
  containerStyle?: any;
  [key: string]: any;
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      {Array.from({ length }).map((_, i) => (
        <InputOTPSlot
          key={i}
          index={i}
          value={value[i] || ''}
          onChange={onChange}
          length={length}
          {...props}
        />
      ))}
    </View>
  );
}

export function InputOTPGroup({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.group, style]}>{children}</View>;
}

export function InputOTPSlot({
  index,
  value,
  onChange,
  length,
  style,
  ...props
}: {
  index: number;
  value: string;
  onChange: (val: string) => void;
  length: number;
  style?: any;
  [key: string]: any;
}) {
  // En móvil, cada slot es un input
  return (
    <View style={[styles.slot, style]}>
      <Text style={styles.char}>{value}</Text>
    </View>
  );
}

export function InputOTPSeparator({ style }: { style?: any }) {
  return (
    <View style={[styles.separator, style]}>
      <Minus size={18} color={Colors.muted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  slot: {
    width: 40,
    height: 44,
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.input || '#e5e7eb',
    backgroundColor: Colors.inputBackground || '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontSize: 20,
    color: Colors.text,
  },
  separator: {
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
