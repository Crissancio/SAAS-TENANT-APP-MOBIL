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