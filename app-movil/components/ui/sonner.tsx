import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<any[]>([]);

  const show = useCallback((message: string, options: { type?: 'success' | 'error' | 'info'; duration?: number } = {}) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, ...options }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, options.duration || 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <View style={[styles.container, { pointerEvents: 'box-none' }]}> 
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

function Toast({ message, type = 'info' }: { message: string; type?: 'success' | 'error' | 'info' }) {
  const color =
    type === 'success' ? Colors.success || Colors.primary :
    type === 'error' ? Colors.destructive :
    Colors.primary;
  return (
    <Animated.View style={[styles.toast, { borderLeftColor: color }]}> 
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    // pointerEvents eliminado, ahora se pasa como prop en el componente
  },
  toast: {
    minWidth: 180,
    maxWidth: Dimensions.get('window').width - 48,
    backgroundColor: Colors.card,
    borderRadius: Radius.md || 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    borderLeftWidth: 5,
    boxShadow: '0px 2px 8px rgba(0,0,0,0.13)',
    elevation: 8,
  },
  toastText: {
    color: Colors.text,
    fontSize: 15,
  },
});
