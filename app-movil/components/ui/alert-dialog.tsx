import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

// AlertDialog
export function AlertDialog({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
}

// AlertDialogTrigger
export function AlertDialogTrigger({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>
  );
}

// AlertDialogHeader
export function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <View style={styles.header}>{children}</View>;
}

// AlertDialogFooter
export function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <View style={styles.footer}>{children}</View>;
}

// AlertDialogTitle
export function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

// AlertDialogDescription
export function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}

// AlertDialogAction
export function AlertDialogAction({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress}>
      <Text style={styles.actionButtonText}>{children}</Text>
    </Pressable>
  );
}

// AlertDialogCancel
export function AlertDialogCancel({ children, onPress }: { children: React.ReactNode; onPress: () => void }) {
  return (
    <Pressable style={styles.cancelButton} onPress={onPress}>
      <Text style={styles.cancelButtonText}>{children}</Text>
    </Pressable>
  );
}

// AlertDialogCloseIcon (opcional)
export function AlertDialogCloseIcon({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.closeIcon} onPress={onPress}>
      <X color={Colors.text} size={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: Colors.backgroundLight || '#fff',
    borderRadius: Radius.lg || 16,
    padding: 24,
    minWidth: 280,
    maxWidth: '90%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 12,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: Colors.muted || '#666',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.primary || '#107361',
    borderRadius: Radius.md || 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: Colors.foreground || '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: Colors.backgroundSecondary || '#E6EAEA',
    borderRadius: Radius.md || 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 8,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});
