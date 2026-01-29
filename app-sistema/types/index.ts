// ==========================================
// TIPOS TYPESCRIPT PARA APP MÓVIL
// Basados en los schemas del backend FastAPI
// ==========================================

// === USUARIO ===
export interface User {
    id_usuario: number;
    nombre: string;
    email: string;
    estado: boolean;
    rol: string;
    id_microempresa?: number;
    microempresa?: Microempresa | null;
}

// === MICROEMPRESA ===
export interface Microempresa {
    id_microempresa: number;
    nombre: string;
    nit: string;
    correo_contacto?: string;
    direccion?: string;
    telefono?: string;
    tipo_atencion?: string;
    latitud?: number;
    longitud?: number;
    dias_atencion?: string;
    horario_atencion?: string;
    moneda: string;
    logo?: string;
    id_rubro?: number;
    estado: boolean;
    fecha_registro?: string;
    rubro?: Rubro;
}

export interface Rubro {
    id_rubro: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
}

// === CATEGORÍA ===
export interface Categoria {
    id_categoria: number;
    id_microempresa: number;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    fecha_creacion: string;
}

// === PRODUCTO ===
export interface Producto {
    id_producto: number;
    id_microempresa: number;
    id_categoria: number;
    nombre: string;
    descripcion?: string;
    precio_venta: number;
    costo_compra?: number;
    codigo?: string;
    imagen?: string;
    estado: boolean;
    fecha_creacion: string;
}

// Producto con stock incluido (para catálogo)
export interface ProductoConStock extends Producto {
    stock?: Stock;
    categoria?: Categoria;
}

// === STOCK / INVENTARIO ===
export interface Stock {
    id_stock: number;
    id_producto: number;
    cantidad: number;
    stock_minimo: number;
    ultima_actualizacion: string;
}

// Stock con información del producto (para pantalla de inventario)
export interface StockConProducto extends Stock {
    producto?: Producto;
    alerta?: boolean; // cantidad <= stock_minimo
}

// === CLIENTE ===
export interface Cliente {
    id_cliente: number;
    id_microempresa: number;
    nombre: string;
    documento?: string;
    telefono?: string;
    email?: string;
    estado: boolean;
    fecha_creacion: string;
}

export interface ClienteCreate {
    id_microempresa: number;
    nombre: string;
    documento?: string;
    telefono?: string;
    email?: string;
}

// === VENTA ===
export interface DetalleVenta {
    id_detalle?: number;
    id_venta?: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface PagoVenta {
    id_pago?: number;
    id_venta?: number;
    metodo: string;
    comprobante_url?: string;
    estado: string;
    fecha?: string;
}

export interface Venta {
    id_venta: number;
    id_microempresa: number;
    id_cliente?: number;
    fecha: string;
    total: number;
    estado: string; // PENDIENTE, PAGADA, CANCELADA
    tipo: string;   // PRESENCIAL, ONLINE
    detalles: DetalleVenta[];
    pagos: PagoVenta[];
}

export interface VentaCreate {
    id_microempresa: number;
    id_cliente?: number;
    total: number;
    estado: string;
    tipo: string;
    detalles: DetalleVenta[];
    pagos?: PagoVenta[];
}

// === NOTIFICACIÓN ===
export type TipoNotificacion =
    | 'STOCK_BAJO'
    | 'STOCK_AGOTADO'
    | 'VENTA_REALIZADA'
    | 'VENTA_REGISTRADA'
    | 'COMPRA_APROBADA'
    | 'PAGO_RECIBIDO'
    | 'PAGO_VENTA_CONFIRMADO'
    | 'AJUSTE_INVENTARIO'
    | 'GENERAL';

export interface Notificacion {
    id_notificacion: number;
    id_microempresa: number;
    id_usuario: number;
    tipo_evento: TipoNotificacion;
    canal: string; // IN_APP, EMAIL, WHATSAPP
    mensaje: string;
    leido: boolean;
    enviado: boolean;
    fecha_creacion: string;
}

// === CARRITO (solo para el frontend) ===
export interface ItemCarrito {
    producto: ProductoConStock;
    cantidad: number;
}

export interface Carrito {
    items: ItemCarrito[];
    total: number;
}

// === RESPUESTAS API ===
export interface ApiResponse<T> {
    data: T;
    status: number;
}

export interface VerificacionCliente {
    existe: boolean;
    id_cliente: number | null;
}
