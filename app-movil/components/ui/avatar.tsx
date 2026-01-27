import React from 'react';
import { View, Image, Text, StyleSheet, ImageProps, ViewProps } from 'react-native';
import { Colors } from '@/constants/theme';

// Avatar
export function Avatar({ style, children, ...props }: ViewProps & { children?: React.ReactNode }) {
  return (
    <View style={[styles.root, style]} {...props}>
      {children}
    </View>
  );
}

// AvatarImage
export function AvatarImage({ style, ...props }: ImageProps) {
  return <Image style={[styles.image, style]} {...props} />;
}

// AvatarFallback
export function AvatarFallback({ style, children }: { style?: any; children?: React.ReactNode }) {
  return (
    <View style={[styles.fallback, style]}>
      <Text style={styles.fallbackText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundSecondary || '#E6EAEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  fallback: {
    backgroundColor: Colors.muted || '#1D7373',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  fallbackText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
