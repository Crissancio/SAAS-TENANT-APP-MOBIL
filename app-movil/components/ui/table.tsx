import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

export function Table({ children, style }: { children: React.ReactNode; style?: any }) {
  return <ScrollView horizontal style={[styles.table, style]}>{children}</ScrollView>;
}

export function TableRow({ children, header, style }: { children: React.ReactNode; header?: boolean; style?: any }) {
  return <View style={[styles.row, header && styles.headerRow, style]}>{children}</View>;
}

export function TableCell({ children, header, style }: { children: React.ReactNode; header?: boolean; style?: any }) {
  return <View style={[styles.cell, header && styles.headerCell, style]}><Text style={[styles.cellText, header && styles.headerCellText]}>{children}</Text></View>;
}

const styles = StyleSheet.create({
  table: {
    borderRadius: Radius.md || 8,
    borderWidth: 1,
    borderColor: Colors.border || '#e5e7eb',
    backgroundColor: Colors.card,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#e5e7eb',
  },
  headerRow: {
    backgroundColor: Colors.muted + '22',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 80,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border || '#e5e7eb',
  },
  headerCell: {
    backgroundColor: Colors.muted + '33',
  },
  cellText: {
    color: Colors.text,
    fontSize: 15,
  },
  headerCellText: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
