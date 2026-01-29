import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/auth-context";

// Paleta de colores personalizada
const COLORS = {
  background: "#042326",
  card: "#0A3A40",
  input: "#0A3A40",
  border: "#15545A",
  primary: "#1D7373",
  button: "#107361",
  text: "#FFFFFF",
  muted: "#B6C2CF",
  error: "#C94A4A",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      router.replace("/(tabs)/ventas");
    }
  }, [user]);

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Por favor ingrese email y contraseña");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      router.replace("/(tabs)/ventas");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBg}>
            <Ionicons name="storefront-outline" size={38} color="#fff" />
          </View>
          <Text style={styles.title}>Mi Microempresa</Text>
          <Text style={styles.subtitle}>Sistema de ventas e inventario</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? "Iniciando sesión..." : "Iniciar sesión"}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <Text style={styles.demoText}>Demo: usa cualquier email y contraseña</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  card: {
    width: "92%",
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.10,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  logoBg: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 2,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginTop: 8,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    marginBottom: 2,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.input,
    color: COLORS.text,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  errorBox: {
    backgroundColor: COLORS.error + "22",
    borderColor: COLORS.error + "44",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
    width: "100%",
  },
  demoText: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    marginTop: 0,
  },
});
