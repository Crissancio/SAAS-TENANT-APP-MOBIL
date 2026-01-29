import React from "react";
import { Text, StyleSheet, TextProps } from "react-native";

export function Label({ style, ...props }: TextProps) {
  return (
    <Text style={[styles.label, style]} {...props} />
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#E6EAEA',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
});
