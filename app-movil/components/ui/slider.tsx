import React from 'react';
import { View, StyleSheet, PanResponder, Animated } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Slider({ value = 0, onValueChange, min = 0, max = 100, style }: {
  value?: number;
  onValueChange?: (val: number) => void;
  min?: number;
  max?: number;
  style?: any;
}) {
  const width = 240;
  const pan = React.useRef(new Animated.Value((value - min) / (max - min) * width)).current;

  React.useEffect(() => {
    pan.setValue((value - min) / (max - min) * width);
  }, [value, min, max]);

  let lastGestureX = 0;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.extractOffset();
      lastGestureX = 0;
    },
    onPanResponderMove: (_, gesture) => {
      let newX = Math.max(0, Math.min(width, gesture.dx + pan.__getValue()));
      pan.setValue(newX);
      lastGestureX = gesture.dx;
      if (onValueChange) {
        const newValue = Math.round((newX / width) * (max - min) + min);
        onValueChange(newValue);
      }
    },
  });

  return (
    <View style={[styles.root, { width }, style]}>
      <View style={styles.track} />
      <Animated.View style={[styles.range, { width: pan }]} />
      <Animated.View
        style={[styles.thumb, { left: Animated.subtract(pan, 12) }]}
        {...panResponder.panHandlers}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 32,
    justifyContent: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.muted + '33',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  range: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.primary,
    elevation: 2,
  },
});
