import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, Text } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  style,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  style?: any;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((v) => !v);
  };

  return (
    <View style={style}>
      <TouchableOpacity style={styles.trigger} onPress={toggle} activeOpacity={0.8}>
        <ChevronDown
          size={18}
          color={Colors.text}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.text,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
