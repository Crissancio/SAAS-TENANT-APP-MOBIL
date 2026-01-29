import React from "react";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";

export function AlertDialog({ visible, onClose, onConfirm, title, description, confirmText = "Eliminar", cancelText = "Cancelar" }: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.contentCustom}>
          <Text style={styles.titleCustom}>{title}</Text>
          <Text style={styles.descCustom}>{description} El cliente será eliminado permanentemente.</Text>
          <TouchableOpacity style={styles.btnDangerCustom} onPress={onConfirm}>
            <Text style={styles.btnDangerTextCustom}>{confirmText}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutlineCustom} onPress={onClose}>
            <Text style={styles.btnOutlineTextCustom}>{cancelText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentCustom: {
    backgroundColor: '#0A3A40',
    borderRadius: 16,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,
    minWidth: 320,
    maxWidth: '95%',
    borderWidth: 1,
    borderColor: '#15545A',
    alignItems: 'center',
  },
  titleCustom: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  descCustom: {
    color: '#B6C2CF',
    fontSize: 15,
    marginBottom: 22,
    textAlign: 'center',
  },
  btnDangerCustom: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    borderWidth: 0,
  },
  btnDangerTextCustom: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
  btnOutlineCustom: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: '#15545A',
  },
  btnOutlineTextCustom: {
    color: '#B6C2CF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.1,
  },
});
