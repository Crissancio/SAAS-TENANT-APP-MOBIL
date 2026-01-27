import React from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, ViewProps } from 'react-native';
import { Search } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

export function Command({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.command, style]} {...props}>{children}</View>
  );
}

export function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  visible,
  onClose,
  children,
  style,
}: {
  title?: string;
  description?: string;
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: any;
}) {
  if (!visible) return null;
  return (
    <View style={[styles.dialogOverlay, style]}>
      <View style={styles.dialogContent}>
        <Text style={styles.dialogTitle}>{title}</Text>
        <Text style={styles.dialogDescription}>{description}</Text>
        {children}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CommandInput({ value, onChangeText, placeholder, style }: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}) {
  return (
    <View style={styles.inputWrapper}>
      <Search size={18} color={Colors.text} style={{ marginRight: 8 }} />
      <TextInput
        style={[styles.input, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.muted}
      />
    </View>
  );
}

export function CommandList({ data, renderItem, style }: {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  style?: any;
}) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(_, i) => i.toString()}
      style={[styles.list, style]}
      keyboardShouldPersistTaps="handled"
    />
  );
}

export function CommandEmpty({ text = 'Sin resultados', style }: { text?: string; style?: any }) {
  return <Text style={[styles.empty, style]}>{text}</Text>;
}

export function CommandItem({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  return (
    <TouchableOpacity style={[styles.item, style]} onPress={onPress}>
      <Text style={styles.itemText}>{children}</Text>
    </TouchableOpacity>
  );
}

export function CommandGroup({ title, children, style }: { title?: string; children: React.ReactNode; style?: any }) {
  return (
    <View style={style}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      {children}
    </View>
  );
}

export function CommandSeparator({ style }: { style?: any }) {
  return <View style={[styles.separator, style]} />;
}

const styles = StyleSheet.create({
  command: {
    backgroundColor: Colors.backgroundLight,
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dialogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  dialogContent: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: '90%',
    elevation: 4,
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
  },
  dialogDescription: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 12,
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: 'flex-end',
  },
  closeBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    marginBottom: 8,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  list: {
    maxHeight: 300,
  },
  empty: {
    textAlign: 'center',
    color: Colors.muted,
    fontSize: 14,
    paddingVertical: 16,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  itemText: {
    color: Colors.text,
    fontSize: 15,
  },
  groupTitle: {
    color: Colors.muted,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
});
