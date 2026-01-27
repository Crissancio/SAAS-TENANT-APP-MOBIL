// api.ts centralizado y migrado a TypeScript
import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Configuración general del cliente
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

// Interceptor para enviar token automáticamente (AsyncStorage)
apiClient.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ---------------------------
// Auth API
// ---------------------------

export const loginRequest = async (user: { email: string; password: string }) => {
  const params = new URLSearchParams();
  params.append("username", user.email);
  params.append("password", user.password);
  const res = await apiClient.post("/login", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const actualizarProducto = (id_producto: string, data: any) =>
  apiClient.put(`/productos/${id_producto}`, data);
export const eliminarProductoFisico = (id_producto: string) =>
  apiClient.delete(`/productos/${id_producto}`);
export const getProductoById = (id_producto: string) =>
  apiClient.get(`/productos/${id_producto}`);
export const getProductosActivos = () =>
  apiClient.get("/productos/activos");
export const getProductosInactivos = () =>
  apiClient.get("/productos/inactivos");
export const getProductosConStock = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/con-stock`);
export const getProductosSinStockPorMicroempresa = (id_microempresa: string) =>
  apiClient.get(`/productos/microempresa/${id_microempresa}/sin-stock`);

// ---------------------------
// Microempresas API
// ---------------------------
export const getRubros = () => apiClient.get("/microempresas/rubros");
export const getSuscripcionById = (id_suscripcion: string) => apiClient.get(`/suscripciones/${id_suscripcion}`);
export const getMicroempresas = () => apiClient.get("/microempresas/");
export const getMicroempresaById = (id: string) => apiClient.get(`/microempresas/${id}`);
export const activarMicroempresa = (id: string) => apiClient.put(`/microempresas/${id}/activar`);
export const desactivarMicroempresa = (id: string) => apiClient.put(`/microempresas/${id}/desactivar`);
export const getPlanMicroempresa = (id: string) => apiClient.get(`/suscripciones/microempresa/${id}/plan`);
export const getMicroempresasPorNombre = () => apiClient.get("/microempresas/orden/nombre");
export const getMicroempresasPorNit = () => apiClient.get("/microempresas/orden/nit");
export const getMicroempresasPorPlan = (id_plan: string) => apiClient.get(`/microempresas/por-plan/${id_plan}`);
export const getMicroempresasActivas = () => apiClient.get("/microempresas/activas");
export const getMicroempresasInactivas = () => apiClient.get("/microempresas/inactivas");
export const updateMicroempresa = (id_microempresa: string, data: any) =>
  apiClient.put(`/microempresas/${id_microempresa}`, data);

// ---------------------------
// Ventas API
// ---------------------------
export const crearVentaOnline = async (datosVenta: any, datosCliente: any) => {
  const payload = {
    venta: {
      ...datosVenta,
      detalles: datosVenta.detalles.map((d: any) => ({
        ...d,
        precio_unitario: parseFloat(d.precio_unitario),
        subtotal: parseFloat(d.subtotal),
      })),
    },
    cliente: datosCliente,
  };
  return apiClient.post("/ventas/ventas/checkout", payload);
};
export const registrarPagoVenta = async (idVenta: string, metodo: string, comprobanteUrl: string) => {
  const payload = {
    metodo,
    comprobante_url: comprobanteUrl,
    estado: "PENDIENTE",
    fecha: new Date().toISOString(),
  };
  return apiClient.post(`/ventas/ventas/${idVenta}/pago`, payload);
};
export const getVentasPorEmpresa = async (idMicroempresa: string, filtros: any = {}) => {
  let url = `/ventas/microempresas/${idMicroempresa}/ventas?`;
  if (filtros.fecha_inicio) url += `&fecha_inicio=${filtros.fecha_inicio}`;
  if (filtros.fecha_fin) url += `&fecha_fin=${filtros.fecha_fin}`;
  if (filtros.estado) url += `&estado=${filtros.estado}`;
  if (filtros.tipo) url += `&tipo=${filtros.tipo}`;
  return apiClient.get(url);
};
export const validarPagoVenta = async (idVenta: string) =>
  apiClient.put(`/ventas/ventas/${idVenta}/pago/validar`);
export const rechazarPagoVenta = async (idVenta: string) =>
  apiClient.put(`/ventas/ventas/${idVenta}/pago/rechazar`);
export const getDetallesVenta = async (idVenta: string) =>
  apiClient.get(`/ventas/${idVenta}/detalles`);

// ---------------------------
// Categorías API
// ---------------------------
export const getCategoriasActivas = (id_microempresa: string) => {
  if (!id_microempresa) return Promise.reject("ID de microempresa es requerido");
  return apiClient.get(`/productos/microempresas/${id_microempresa}/categorias`);
};
export const getCategoriasInactivas = () =>
  apiClient.get("/productos/categoria/inactivas");
export const getTodasCategorias = () =>
  apiClient.get("/productos/categoria");
export const getCategoriasGlobales = () =>
  apiClient.get("/productos/categoria/globales");
export const crearCategoriaGlobal = (data: any) =>
  apiClient.post("/productos/categoria/", data);
export const editarCategoriaGlobal = (id_categoria: string, data: any) =>
  apiClient.put(`/productos/categoria/${id_categoria}`, data);
export const activarCategoriaGlobal = (id_categoria: string) =>
  apiClient.post(`/productos/categoria/${id_categoria}/activar`);
export const desactivarCategoriaGlobal = (id_categoria: string) =>
  apiClient.post(`/productos/categoria/${id_categoria}/desactivar`);
export const eliminarCategoriaGlobal = (id_categoria: string) =>
  apiClient.delete(`/productos/categoria/${id_categoria}`);
export const getCategoriasByMicroempresa = (id_microempresa: string) =>
  apiClient.get(`/productos/categoria/microempresa/${id_microempresa}`);

// ---------------------------
// Compras API
// ---------------------------
export const descargarCompraPDF = (id_compra: string) =>
  apiClient.get(`/compras/${id_compra}/pdf`, { responseType: "blob" });
export const getCompras = (id_microempresa: string) =>
  apiClient.get(`/compras?id_microempresa=${id_microempresa}`);
export const getCompraDetalles = (id_compra: string) =>
  apiClient.get(`/compras/${id_compra}/detalles`);
export const createCompra = (data: any) => apiClient.post("/compras", data);

// ---------------------------
// Dashboard API
// ---------------------------
export const getTotalMicroempresas = () => apiClient.get("/microempresas/total");
export const getTotalMicroempresasActivas = () => apiClient.get("/microempresas/total/activas");
export const getTotalMicroempresasInactivas = () => apiClient.get("/microempresas/total/inactivas");
export const getTotalPlanesActivos = () => apiClient.get("/planes/total/activos");

// ---------------------------
// Inventario API
// ---------------------------
export const crearStock = (data: any) => apiClient.post("/inventario/", data);
export const getStockById = (id_stock: string) => apiClient.get(`/inventario/${id_stock}`);
export const getStockByProducto = (id_producto: string) => apiClient.get(`/inventario/producto/${id_producto}`);

// ---------------------------
// Notificaciones API
// ---------------------------
export const getNotificacionesPorUsuario = (id_usuario: string) =>
  apiClient.get(`/notificaciones/usuario/${id_usuario}`);
export const marcarNotificacionLeida = (id_notificacion: string) =>
  apiClient.post(`/notificaciones/${id_notificacion}/leida`);

// ---------------------------
// Planes API
// ---------------------------
export const getPlanes = () => apiClient.get("/planes/");
export const getPlanById = (id: string) => apiClient.get(`/planes/${id}`);
export const createPlan = (data: any) => apiClient.post("/planes/", data);
export const updatePlan = (id: string, data: any) => apiClient.put(`/planes/${id}`, data);
export const deletePlan = (id: string) => apiClient.delete(`/planes/${id}`);
export const activarPlan = (id: string) => apiClient.put(`/planes/${id}/activar`);
export const desactivarPlan = (id: string) => apiClient.put(`/planes/${id}/desactivar`);
export const getPlanesActivos = () => apiClient.get("/planes/activos");
export const getPlanesNoActivos = () => apiClient.get("/planes/no-activos");

// ---------------------------
// Proveedores API
// ---------------------------
export const getProveedores = (id_microempresa: string) =>
  apiClient.get(`/proveedores?id_microempresa=${id_microempresa}`);
export const createProveedor = (data: any) => apiClient.post("/proveedores", data);
export const updateProveedor = (id: string, data: any, id_microempresa: string) =>
  apiClient.put(`/proveedores/${id}?id_microempresa=${id_microempresa}`, data);
export const deleteProveedor = (id: string, id_microempresa: string) =>
  apiClient.patch(`/proveedores/${id}/estado?id_microempresa=${id_microempresa}`, { estado: false });
export const getMetodosPago = (id_proveedor: string, id_microempresa: string) =>
  apiClient.get(`/proveedores/${id_proveedor}/metodos-pago?id_microempresa=${id_microempresa}`);
export const getMetodosPagoNoActivos = (id_proveedor: string, id_microempresa: string) =>
  apiClient.get(`/proveedores/${id_proveedor}/metodos-pago/no-activos?id_microempresa=${id_microempresa}`);
export const createMetodoPago = (id_proveedor: string, data: any, id_microempresa: string) =>
  apiClient.post(`/proveedores/${id_proveedor}/metodos-pago?id_microempresa=${id_microempresa}`, data);
export const toggleMetodoPago = (id_metodo: string, estado: boolean, id_microempresa: string) =>
  apiClient.patch(`/proveedores/metodos-pago/${id_metodo}/estado?id_microempresa=${id_microempresa}`, { activo: estado });
export const getProductosProveedor = (id_proveedor: string, id_microempresa: string) =>
  apiClient.get(`/proveedores/${id_proveedor}/productos?id_microempresa=${id_microempresa}`);
export const getProductosNoActivos = (id_proveedor: string, id_microempresa: string) =>
  apiClient.get(`/proveedores/${id_proveedor}/productos/no-activos?id_microempresa=${id_microempresa}`);
export const asociarProducto = (id_proveedor: string, data: any, id_microempresa: string) =>
  apiClient.post(`/proveedores/${id_proveedor}/productos?id_microempresa=${id_microempresa}`, data);
export const toggleProductoProveedor = (id_proveedor: string, id_producto: string, estado: boolean, id_microempresa: string) =>
  apiClient.patch(`/proveedores/${id_proveedor}/productos/${id_producto}/estado?id_microempresa=${id_microempresa}`, { activo: estado });
export const getProductosGlobales = (id_microempresa: string) =>
  apiClient.get(`/productos?id_microempresa=${id_microempresa}`);

// ---------------------------
// Reportes API
// ---------------------------
export const getDashboardData = (idMicro: string, periodo: string) =>
  apiClient.get(`/reportes/dashboard?id_microempresa=${idMicro}&periodo=${periodo}`);
