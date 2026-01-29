import React, { useState } from "react";
import { TextInput, StyleSheet, TextInputProps, Platform } from "react-native";

export function Input(props: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      underlineColorAndroid="transparent"
      placeholderTextColor="#A0B6B8"
      selectionColor="#1CA085"
      onFocus={e => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={e => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={[
        styles.input,
        focused && styles.focused,
        props.style,
      ]}
    />
  );
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#14383C',
    color: '#E6EAEA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#20575E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    width: '100%',
    minHeight: 40,
  },
  focused: {
    borderColor: "#1CA085",
    shadowColor: "#1CA085",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  }
});
