import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------------------
// Axios instance
// ---------------------------

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------
// Request interceptor (JWT)
// ---------------------------

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("access_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------
// Auth API
// ---------------------------

export const loginRequest = async (user: { email: string; password: string }) => {
  const params = new URLSearchParams();
  params.append("username", user.email);
  params.append("password", user.password);

  const res = await apiClient.post("/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  await AsyncStorage.setItem("access_token", res.data.access_token);

  return res.data.user;
};

export const registerRequest = (user: any) => apiClient.post("/usuarios/", user);
export const verifyTokenRequest = () => apiClient.get("/auth/verify");

// ---------------------------
// Users API
// ---------------------------

export const getMeRequest = () => apiClient.get("/usuarios/me");
export const getClientes = (id_microempresa: string) =>
  apiClient.get(`/clientes?microempresa=${id_microempresa}`);

export const recoverPassword = (email: string) =>
  apiClient.post("/auth/recover", { email });

export const resetPassword = (token: string, nueva_password: string) =>
  apiClient.post("/auth/reset-password", { token, nueva_password });

// ---------------------------
// Clientes API
// ---------------------------

export const verificarClientePorDocumento = (idMicroempresa: string, documento: string) =>
  apiClient.get(`/clientes/microempresa/${idMicroempresa}/verificar-documento/${documento}`);

export const obtenerClientePorId = (idCliente: string) =>
  apiClient.get(`/clientes/obtener/${idCliente}`);

export const getClientesPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/clientes/microempresa/${idMicroempresa}`);

// ---------------------------
// Productos API
// ---------------------------

export const getProductosInactivosPorMicroempresa = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/inactivos`);

export const activarProducto = (id_producto: string) =>
  apiClient.post(`/productos/${id_producto}/activar`);

export const desactivarProducto = (id_producto: string) =>
  apiClient.post(`/productos/${id_producto}/desactivar`);

export const getProductosActivosPorMicroempresa = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/activos`);

export const getProductosActivosConStock = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/activos-con-stock`);

export const crearProducto = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });

  return apiClient.post("/productos/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const actualizarProducto = (id_producto: string, data: any) =>
  apiClient.put(`/productos/${id_producto}`, data);

// Actualizar producto con imagen usando FormData
export const actualizarProductoConImagen = (id_producto: string, data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Para el campo imagen, solo agregarlo si es un objeto con uri (archivo seleccionado)
      if (key === "imagen") {
        if (typeof value === "object" && value.uri) {
          formData.append(key, value as any);
        }
        // Si no es un objeto con uri, no agregar el campo imagen
      } else {
        // Convertir valores a string explícitamente para FormData
        const stringValue = typeof value === "boolean" ? (value ? "true" : "false") : String(value);
        formData.append(key, stringValue);
      }
    }
  });

  console.log("[API DEBUG] Enviando FormData para producto:", id_producto);

  return apiClient.put(`/productos/${id_producto}/con-imagen`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const eliminarProductoFisico = (id_producto: string) =>
  apiClient.delete(`/productos/${id_producto}`);

export const getProductoById = (id_producto: string) =>
  apiClient.get(`/productos/${id_producto}`);

export const getProductosActivos = () => apiClient.get("/productos/activos");
export const getProductosInactivos = () => apiClient.get("/productos/inactivos");

export const getProductosConStock = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/con-stock`);

export const getProductosSinStockPorMicroempresa = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/sin-stock`);

// ---------------------------
// Reportes
// ---------------------------

export const getDashboardData = (idMicro: string, periodo: string) =>
  apiClient.get(`/reportes/dashboard?id_microempresa=${idMicro}&periodo=${periodo}`);

// ---------------------------
// Ventas API
// ---------------------------

import type { VentaCreate, ClienteCreate } from "../types";

export const crearVentaPresencial = (idMicroempresa: string, venta: VentaCreate) =>
  apiClient.post(`/ventas/microempresas/${idMicroempresa}/ventas`, venta);

export const getVentasPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/ventas/microempresa/${idMicroempresa}`);

export const getVentasFiltradas = (
  idMicroempresa: string,
  fechaInicio?: string,
  fechaFin?: string,
  estado?: string,
  tipo?: string
) => {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  if (estado) params.append("estado", estado);
  if (tipo) params.append("tipo", tipo);
  return apiClient.get(`/ventas/microempresas/${idMicroempresa}/ventas?${params.toString()}`);
};

export const getDetallesVenta = (idVenta: string) =>
  apiClient.get(`/ventas/${idVenta}/detalles`);

// ---------------------------
// Categorías API
// ---------------------------

export const getCategoriasPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/productos/microempresas/${idMicroempresa}/categorias`);

// ---------------------------
// Inventario / Stock API
// ---------------------------

export const getStockPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/inventario/microempresa/${idMicroempresa}`);

export const getStockConAlertas = (idMicroempresa: string) =>
  apiClient.get(`/inventario/microempresas/${idMicroempresa}/stock`);

export const getStockPorProducto = (idProducto: string) =>
  apiClient.get(`/inventario/producto/${idProducto}`);

// ---------------------------
// Clientes API - Ampliado
// ---------------------------

export const getClientesActivosPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/clientes/microempresa/${idMicroempresa}/activos`);

export const crearCliente = (cliente: ClienteCreate) =>
  apiClient.post("/clientes/", cliente);

export const actualizarCliente = (idCliente: string, cliente: Partial<ClienteCreate>) =>
  apiClient.put(`/clientes/${idCliente}`, cliente);

export const bajaLogicaCliente = (idCliente: string) =>
  apiClient.put(`/clientes/${idCliente}/baja-logica`);

export const habilitarCliente = (idCliente: string) =>
  apiClient.put(`/clientes/${idCliente}/habilitar`);

// ---------------------------
// Notificaciones API
// ---------------------------

export const getNotificacionesPorUsuario = (idUsuario: string) =>
  apiClient.get(`/notificaciones/usuario/${idUsuario}`);

export const getNotificacionesNoLeidas = (idUsuario: string) =>
  apiClient.get(`/notificaciones/usuario/${idUsuario}/no-leidas`);

export const marcarNotificacionLeida = (idNotificacion: string) =>
  apiClient.post(`/notificaciones/${idNotificacion}/leida`);

export const getNotificacionesPorMicroempresa = (idMicroempresa: string) =>
  apiClient.get(`/notificaciones/microempresa/${idMicroempresa}`);

export const eliminarNotificacion = (idNotificacion: string) =>
  apiClient.delete(`/notificaciones/${idNotificacion}`);