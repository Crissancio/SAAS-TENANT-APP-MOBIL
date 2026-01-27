import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Tooltip({
  children,
  content,
  side = 'top',
  style,
  contentStyle,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  style?: any;
  contentStyle?: any;
}) {
  const [visible, setVisible] = useState(false);
  const { width } = Dimensions.get('window');

  return (
    <>
      <TouchableOpacity
        style={style}
        onPressIn={() => setVisible(true)}
        onPressOut={() => setVisible(false)}
        delayLongPress={300}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={[styles.overlay, { pointerEvents: 'box-none' }]}> 
          <View style={[styles.tooltip, contentStyle, { maxWidth: width - 48 }]}> 
            <Text style={styles.tooltipText}>{content}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tooltip: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md || 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
    margin: 12,
  },
  tooltipText: {
    color: Colors.primaryForeground || '#fff',
    fontSize: 13,
  },
});
