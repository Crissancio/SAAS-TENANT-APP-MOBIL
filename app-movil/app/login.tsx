import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useApp } from "../contexts/AppContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Store } from "lucide-react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Por favor ingrese email y contraseña");
      return;
    }
    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        router.replace("/dashboard");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#05292E' }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 600, paddingVertical: 32, paddingHorizontal: 16 }}>
          <View style={{ width: '100%', maxWidth: 360 }}>
            {/* Logo y título */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <View style={{ width: 64, height: 64, backgroundColor: '#107361', borderRadius: 16, marginBottom: 16, justifyContent: 'center', alignItems: 'center' }}>
                <Store size={32} color="#F5F7F8" />
              </View>
              <Text style={{ color: '#F5F7F8', marginBottom: 8, fontSize: 22, fontWeight: 'bold' }}>Mi Microempresa</Text>
              <Text style={{ color: '#E6EAEA', fontSize: 15 }}>Sistema de ventas e inventario</Text>
            </View>
            {/* Formulario de login */}
            <View style={{ backgroundColor: '#0A3A40', borderRadius: 16, boxShadow: '0px 2px 8px rgba(0,0,0,0.08)', padding: 24, borderWidth: 1, borderColor: 'rgba(245,247,248,0.1)' }}>
              <View style={{ gap: 20 }}>
                <View style={{ gap: 8 }}>
                  <Label style={{ color: '#F5F7F8', marginBottom: 2 }}>Email</Label>
                  <Input
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="tu@email.com"
                    value={email}
                    onChangeText={setEmail}
                    style={{ backgroundColor: '#05292E', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 16 }}
                    placeholderTextColor="#6b7280"
                    editable={!loading}
                  />
                </View>
                <View style={{ gap: 8 }}>
                  <Label style={{ color: '#F5F7F8', marginBottom: 2 }}>Contraseña</Label>
                  <Input
                    secureTextEntry
                    placeholder="••••••••"
                    value={password}
                    onChangeText={setPassword}
                    style={{ backgroundColor: '#05292E', borderColor: '#25635A', color: '#F5F7F8', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 16 }}
                    placeholderTextColor="#6b7280"
                    editable={!loading}
                  />
                </View>
                {error ? (
                  <View style={{ backgroundColor: '#ef4444', opacity: 0.08, borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, padding: 10 }}>
                    <Text style={{ color: '#ef4444', fontSize: 14 }}>{error}</Text>
                  </View>
                ) : null}
                <Button
                  onPress={handleSubmit}
                  style={{ width: '100%', backgroundColor: '#107361', borderRadius: 8, height: 44, marginTop: 4 }}
                  textStyle={{ color: '#F5F7F8', fontWeight: 'bold', fontSize: 16 }}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </View>
              <View style={{ marginTop: 24, paddingTop: 16, borderTopWidth: 1, borderColor: '#25635A' }}>
                <Text style={{ color: '#E6EAEA', fontSize: 13, textAlign: 'center' }}>
                  Demo: usa cualquier email y contraseña
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}