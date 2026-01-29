import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Modal,
    ScrollView,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../contexts/auth-context";
import { useRouter } from "expo-router";
import { Toast } from "../../components/ui/Toast";
import { Button } from "../../components/ui/Button";
import type { Producto, Categoria, Stock } from "../../types";
import {
    getProductosActivosPorMicroempresa,
    getProductosInactivosPorMicroempresa,
    getCategoriasPorMicroempresa,
    getStockPorMicroempresa,
    crearProducto,
    actualizarProductoConImagen,
    activarProducto,
    desactivarProducto,
} from "../../services/api";

// Colores del tema
const COLORS = {
    background: "#042326",
    card: "#0A3A40",
    cardLight: "#0D4A52",
    border: "#15545A",
    primary: "#1D7373",
    button: "#107361",
    text: "#FFFFFF",
    muted: "#B6C2CF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
};

// Tipo combinado de producto con stock
interface ProductoConStock extends Producto {
    stockActual: number;
    stockMinimo: number;
}

// Datos para crear/editar producto
interface ProductoForm {
    nombre: string;
    descripcion: string;
    precio_venta: string;
    costo_compra: string;
    id_categoria: number | null;
    codigo: string;
    imagen: any; // uri de la imagen seleccionada
}

const emptyForm: ProductoForm = {
    nombre: "",
    descripcion: "",
    precio_venta: "",
    costo_compra: "",
    id_categoria: null,
    codigo: "",
    imagen: null,
};

const ProductsScreen: React.FC = () => {
    const { user } = useAuth();
    const router = useRouter();

    // Estados principales
    const [productos, setProductos] = useState<ProductoConStock[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<"activos" | "inactivos">("activos");
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);

    // Estados del modal
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState<Producto | null>(null);
    const [form, setForm] = useState<ProductoForm>(emptyForm);
    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState<{ visible: boolean; message: string; type?: "success" | "error" | "info" }>({
        visible: false,
        message: ""
    });

    // Redirigir si no hay usuario
    useEffect(() => {
        if (!user) router.replace("/login");
    }, [user, router]);

    // Cargar datos desde el backend
    const loadData = useCallback(async () => {
        if (!user?.microempresa?.id_microempresa) return;

        try {
            setLoading(true);
            const idMicro = user.microempresa.id_microempresa.toString();

            // Cargar productos según filtro de estado
            const productosPromise = filtroEstado === "activos"
                ? getProductosActivosPorMicroempresa(idMicro)
                : getProductosInactivosPorMicroempresa(idMicro);

            const [productosRes, stockRes, categoriasRes] = await Promise.all([
                productosPromise,
                getStockPorMicroempresa(idMicro),
                getCategoriasPorMicroempresa(idMicro).catch(() => ({ data: [] })),
            ]);

            // Crear mapa de stock por producto
            const stockMap = new Map<number, Stock>();
            (stockRes.data || []).forEach((s: Stock) => {
                stockMap.set(s.id_producto, s);
            });

            // Combinar productos con su stock
            const productosConStock: ProductoConStock[] = (productosRes.data || []).map((p: Producto) => {
                const stock = stockMap.get(p.id_producto);
                return {
                    ...p,
                    stockActual: stock?.cantidad ?? 0,
                    stockMinimo: stock?.stock_minimo ?? 0,
                };
            });

            setProductos(productosConStock);
            setCategorias(categoriasRes.data || []);
        } catch (error) {
            console.error("Error cargando datos:", error);
            setToast({ visible: true, message: "Error al cargar productos", type: "error" });
        } finally {
            setLoading(false);
        }
    }, [user?.microempresa?.id_microempresa, filtroEstado]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Filtrar productos
    const filteredProductos = useMemo(() => {
        return productos.filter((p) => {
            const matchSearch = p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.codigo && p.codigo.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchCategoria = !categoriaSeleccionada || p.id_categoria === categoriaSeleccionada;
            return matchSearch && matchCategoria;
        });
    }, [productos, searchQuery, categoriaSeleccionada]);

    // URL de imagen del producto
    const getImageUrl = (imagen?: string) => {
        if (!imagen) return null;
        const baseUrl = process.env.EXPO_PUBLIC_API_URL || '';
        return `${baseUrl}${imagen}`;
    };

    // Seleccionar imagen
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso necesario", "Necesitamos acceso a tu galería para seleccionar una imagen.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setForm(prev => ({ ...prev, imagen: result.assets[0] }));
        }
    };

    // Tomar foto
    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Permiso necesario", "Necesitamos acceso a tu cámara para tomar una foto.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setForm(prev => ({ ...prev, imagen: result.assets[0] }));
        }
    };

    // Abrir modal para crear
    const abrirCrear = () => {
        setEditando(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    // Abrir modal para editar
    const abrirEditar = (producto: ProductoConStock) => {
        setEditando(producto);
        setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion || "",
            precio_venta: producto.precio_venta.toString(),
            costo_compra: producto.costo_compra?.toString() || "",
            id_categoria: producto.id_categoria,
            codigo: producto.codigo || "",
            imagen: null, // Se mostrará la imagen actual del servidor
        });
        setShowModal(true);
    };

    // Guardar producto (crear o editar)
    const guardarProducto = async () => {
        console.log("[PRODUCTS DEBUG] guardarProducto llamada");
        console.log("[PRODUCTS DEBUG] form:", form);
        console.log("[PRODUCTS DEBUG] editando:", editando);

        if (!form.nombre.trim()) {
            console.log("[PRODUCTS DEBUG] Error: nombre vacío");
            setToast({ visible: true, message: "El nombre es requerido", type: "error" });
            return;
        }
        if (!form.precio_venta || parseFloat(form.precio_venta) <= 0) {
            console.log("[PRODUCTS DEBUG] Error: precio inválido");
            setToast({ visible: true, message: "El precio debe ser mayor a 0", type: "error" });
            return;
        }
        if (!form.id_categoria) {
            console.log("[PRODUCTS DEBUG] Error: categoría no seleccionada");
            setToast({ visible: true, message: "Selecciona una categoría", type: "error" });
            return;
        }

        console.log("[PRODUCTS DEBUG] Validaciones pasadas, iniciando guardado");
        setSaving(true);

        try {
            // Preparar datos como FormData
            const data: any = {
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim() || "",
                precio_venta: parseFloat(form.precio_venta),
                costo_compra: form.costo_compra ? parseFloat(form.costo_compra) : 0,
                id_categoria: form.id_categoria,
                codigo: form.codigo.trim() || "",
                estado: editando ? editando.estado : true,
            };

            console.log("[PRODUCTS DEBUG] data preparada:", data);

            // Si hay imagen seleccionada, agregarla
            if (form.imagen) {
                const uri = form.imagen.uri;
                const filename = uri.split('/').pop() || 'image.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                data.imagen = {
                    uri,
                    name: filename,
                    type,
                };
            }

            if (editando) {
                // Actualizar producto (con posible nueva imagen)
                await actualizarProductoConImagen(editando.id_producto.toString(), data);
                setToast({ visible: true, message: "Producto actualizado", type: "success" });
            } else {
                // Crear producto
                await crearProducto(data);
                setToast({ visible: true, message: "Producto creado exitosamente", type: "success" });
            }

            setShowModal(false);
            setForm(emptyForm);
            setEditando(null);
            await loadData();

        } catch (error: any) {
            console.error("Error guardando producto:", error);
            // Extraer mensaje de error de manera segura
            let errorMessage = "Error al guardar producto";
            if (error.response?.data?.detail) {
                const detail = error.response.data.detail;
                if (typeof detail === "string") {
                    errorMessage = detail;
                } else if (Array.isArray(detail)) {
                    // Error de validación de Pydantic
                    errorMessage = detail.map((d: any) => d.msg || d.message).join(", ");
                } else if (typeof detail === "object") {
                    errorMessage = detail.msg || detail.message || JSON.stringify(detail);
                }
            }
            setToast({
                visible: true,
                message: errorMessage,
                type: "error"
            });
        } finally {
            setSaving(false);
        }
    };

    // Activar/Desactivar producto
    const toggleEstado = async (producto: ProductoConStock) => {
        const accion = producto.estado ? "desactivar" : "activar";

        Alert.alert(
            `${accion.charAt(0).toUpperCase() + accion.slice(1)} producto`,
            `¿Estás seguro de ${accion} "${producto.nombre}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: accion.charAt(0).toUpperCase() + accion.slice(1),
                    style: producto.estado ? "destructive" : "default",
                    onPress: async () => {
                        try {
                            if (producto.estado) {
                                await desactivarProducto(producto.id_producto.toString());
                            } else {
                                await activarProducto(producto.id_producto.toString());
                            }
                            setToast({ visible: true, message: `Producto ${accion}do`, type: "success" });
                            await loadData();
                        } catch (error) {
                            setToast({ visible: true, message: `Error al ${accion} producto`, type: "error" });
                        }
                    }
                },
            ]
        );
    };

    // Render producto
    const renderProducto = ({ item }: { item: ProductoConStock }) => {
        const imageUrl = getImageUrl(item.imagen);
        const stockBajo = item.stockActual <= item.stockMinimo && item.stockActual > 0;
        const sinStock = item.stockActual === 0;

        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => abrirEditar(item)}
                activeOpacity={0.7}
            >
                {/* Imagen */}
                <View style={styles.productImageContainer}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.productImage}
                            resizeMode="cover"
                            onError={() => { }} // Silenciar errores 404
                        />
                    ) : (
                        <View style={styles.productImagePlaceholder}>
                            <Ionicons name="cube-outline" size={28} color={COLORS.muted} />
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                        {item.nombre}
                    </Text>
                    {item.codigo && (
                        <Text style={styles.productCode}>Cód: {item.codigo}</Text>
                    )}
                    <Text style={styles.productPrice}>Bs. {item.precio_venta.toFixed(2)}</Text>

                    {/* Stock badge */}
                    <View style={[
                        styles.stockBadge,
                        { backgroundColor: sinStock ? COLORS.error + "22" : stockBajo ? COLORS.warning + "22" : COLORS.success + "22" }
                    ]}>
                        <Text style={[
                            styles.stockBadgeText,
                            { color: sinStock ? COLORS.error : stockBajo ? COLORS.warning : COLORS.success }
                        ]}>
                            Stock: {item.stockActual}
                        </Text>
                    </View>
                </View>

                {/* Acciones */}
                <View style={styles.productActions}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { backgroundColor: item.estado ? COLORS.error + "22" : COLORS.success + "22" }]}
                        onPress={() => toggleEstado(item)}
                    >
                        <Ionicons
                            name={item.estado ? "close-circle-outline" : "checkmark-circle-outline"}
                            size={20}
                            color={item.estado ? COLORS.error : COLORS.success}
                        />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading && productos.length === 0) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast({ ...toast, visible: false })}
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Productos</Text>
                <TouchableOpacity style={styles.addButton} onPress={abrirCrear}>
                    <Ionicons name="add" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Buscador */}
            <View style={styles.searchContainer}>
                <Feather name="search" size={18} color={COLORS.muted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre o código..."
                    placeholderTextColor={COLORS.muted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Feather name="x" size={18} color={COLORS.muted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filtro de estado */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterBtn, filtroEstado === "activos" && styles.filterBtnActive]}
                    onPress={() => setFiltroEstado("activos")}
                >
                    <Text style={[styles.filterText, filtroEstado === "activos" && styles.filterTextActive]}>
                        Activos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterBtn, filtroEstado === "inactivos" && styles.filterBtnActive]}
                    onPress={() => setFiltroEstado("inactivos")}
                >
                    <Text style={[styles.filterText, filtroEstado === "inactivos" && styles.filterTextActive]}>
                        Inactivos
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Categorías */}
            {categorias.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriasScroll}
                    contentContainerStyle={styles.categoriasContent}
                >
                    <TouchableOpacity
                        style={[styles.categoriaChip, !categoriaSeleccionada && styles.categoriaChipActive]}
                        onPress={() => setCategoriaSeleccionada(null)}
                    >
                        <Text style={[styles.categoriaText, !categoriaSeleccionada && styles.categoriaTextActive]}>
                            Todas
                        </Text>
                    </TouchableOpacity>
                    {categorias.map((cat) => (
                        <TouchableOpacity
                            key={cat.id_categoria}
                            style={[styles.categoriaChip, categoriaSeleccionada === cat.id_categoria && styles.categoriaChipActive]}
                            onPress={() => setCategoriaSeleccionada(cat.id_categoria)}
                        >
                            <Text style={[styles.categoriaText, categoriaSeleccionada === cat.id_categoria && styles.categoriaTextActive]}>
                                {cat.nombre}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Contador */}
            <Text style={styles.countText}>
                {filteredProductos.length} producto{filteredProductos.length !== 1 ? "s" : ""}
            </Text>

            {/* Lista de productos */}
            <FlatList
                data={filteredProductos}
                renderItem={renderProducto}
                keyExtractor={(item) => item.id_producto.toString()}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="package-variant" size={48} color={COLORS.muted} />
                        <Text style={styles.emptyText}>No hay productos {filtroEstado}</Text>
                    </View>
                }
            />

            {/* Modal Crear/Editar */}
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    {/* Header del modal */}
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalCloseBtn}>
                            <Ionicons name="close" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {editando ? "Editar Producto" : "Nuevo Producto"}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {/* Selector de imagen */}
                        <Text style={styles.inputLabel}>Imagen</Text>
                        <View style={styles.imagePickerContainer}>
                            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                                {form.imagen ? (
                                    <Image source={{ uri: form.imagen.uri }} style={styles.selectedImage} />
                                ) : editando?.imagen ? (
                                    <Image source={{ uri: getImageUrl(editando.imagen) || '' }} style={styles.selectedImage} />
                                ) : (
                                    <View style={styles.imagePlaceholder}>
                                        <Ionicons name="image-outline" size={40} color={COLORS.muted} />
                                        <Text style={styles.imagePlaceholderText}>Seleccionar imagen</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <View style={styles.imageActions}>
                                <TouchableOpacity style={styles.imageActionBtn} onPress={pickImage}>
                                    <Ionicons name="images-outline" size={20} color={COLORS.text} />
                                    <Text style={styles.imageActionText}>Galería</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.imageActionBtn} onPress={takePhoto}>
                                    <Ionicons name="camera-outline" size={20} color={COLORS.text} />
                                    <Text style={styles.imageActionText}>Cámara</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Nombre */}
                        <Text style={styles.inputLabel}>Nombre *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del producto"
                            placeholderTextColor={COLORS.muted}
                            value={form.nombre}
                            onChangeText={(val) => setForm(prev => ({ ...prev, nombre: val }))}
                        />

                        {/* Descripción */}
                        <Text style={styles.inputLabel}>Descripción</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Descripción del producto"
                            placeholderTextColor={COLORS.muted}
                            value={form.descripcion}
                            onChangeText={(val) => setForm(prev => ({ ...prev, descripcion: val }))}
                            multiline
                            numberOfLines={3}
                        />

                        {/* Precio Venta */}
                        <Text style={styles.inputLabel}>Precio de Venta (Bs.) *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={COLORS.muted}
                            value={form.precio_venta}
                            onChangeText={(val) => setForm(prev => ({ ...prev, precio_venta: val }))}
                            keyboardType="decimal-pad"
                        />

                        {/* Costo Compra */}
                        <Text style={styles.inputLabel}>Costo de Compra (Bs.)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0.00"
                            placeholderTextColor={COLORS.muted}
                            value={form.costo_compra}
                            onChangeText={(val) => setForm(prev => ({ ...prev, costo_compra: val }))}
                            keyboardType="decimal-pad"
                        />

                        {/* Código */}
                        <Text style={styles.inputLabel}>Código (SKU)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Código del producto"
                            placeholderTextColor={COLORS.muted}
                            value={form.codigo}
                            onChangeText={(val) => setForm(prev => ({ ...prev, codigo: val }))}
                        />

                        {/* Categoría */}
                        <Text style={styles.inputLabel}>Categoría *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriaSelector}>
                            {categorias.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id_categoria}
                                    style={[
                                        styles.categoriaSelectorItem,
                                        form.id_categoria === cat.id_categoria && styles.categoriaSelectorItemActive
                                    ]}
                                    onPress={() => setForm(prev => ({ ...prev, id_categoria: cat.id_categoria }))}
                                >
                                    <Text style={[
                                        styles.categoriaSelectorText,
                                        form.id_categoria === cat.id_categoria && styles.categoriaSelectorTextActive
                                    ]}>
                                        {cat.nombre}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Botón guardar */}
                    <View style={styles.modalFooter}>
                        <TouchableOpacity
                            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                            onPress={guardarProducto}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator size="small" color={COLORS.text} />
                            ) : (
                                <>
                                    <Ionicons name="checkmark" size={20} color={COLORS.text} />
                                    <Text style={styles.saveBtnText}>
                                        {editando ? "Guardar cambios" : "Crear producto"}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

export default ProductsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 48
    },
    centered: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        color: COLORS.muted,
        marginTop: 12,
        fontSize: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16
    },
    headerTitle: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: "700"
    },
    addButton: {
        backgroundColor: COLORS.button,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginHorizontal: 16,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: COLORS.text,
        fontSize: 15,
    },
    filterRow: {
        flexDirection: "row",
        paddingHorizontal: 16,
        marginBottom: 8,
        gap: 8,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterBtnActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.muted,
        fontSize: 13,
    },
    filterTextActive: {
        color: COLORS.text,
        fontWeight: "500",
    },
    categoriasScroll: {
        maxHeight: 40,
        marginBottom: 8,
    },
    categoriasContent: {
        paddingHorizontal: 16,
    },
    categoriaChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    categoriaChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoriaText: {
        color: COLORS.muted,
        fontSize: 13,
    },
    categoriaTextActive: {
        color: COLORS.text,
        fontWeight: "500",
    },
    countText: {
        color: COLORS.muted,
        fontSize: 13,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyContainer: {
        alignItems: "center",
        marginTop: 48,
    },
    emptyText: {
        color: COLORS.muted,
        textAlign: "center",
        marginTop: 12,
        fontSize: 15
    },
    productCard: {
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    productImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: COLORS.cardLight,
    },
    productImage: {
        width: "100%",
        height: "100%",
    },
    productImagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        flex: 1,
        marginLeft: 12,
    },
    productName: {
        color: COLORS.text,
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 2,
    },
    productCode: {
        color: COLORS.muted,
        fontSize: 11,
        marginBottom: 2,
    },
    productPrice: {
        color: COLORS.success,
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    stockBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    stockBadgeText: {
        fontSize: 11,
        fontWeight: "500",
    },
    productActions: {
        marginLeft: 8,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalCloseBtn: {
        padding: 8,
    },
    modalTitle: {
        color: COLORS.text,
        fontSize: 18,
        fontWeight: "600",
    },
    modalContent: {
        flex: 1,
        padding: 16,
    },
    inputLabel: {
        color: COLORS.text,
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: COLORS.text,
        fontSize: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: "top",
    },
    imagePickerContainer: {
        marginBottom: 8,
    },
    imagePicker: {
        width: "100%",
        height: 150,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 8,
    },
    selectedImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imagePlaceholderText: {
        color: COLORS.muted,
        fontSize: 13,
        marginTop: 8,
    },
    imageActions: {
        flexDirection: "row",
        gap: 12,
    },
    imageActionBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: COLORS.cardLight,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    imageActionText: {
        color: COLORS.text,
        fontSize: 13,
    },
    categoriaSelector: {
        flexDirection: "row",
        marginTop: 4,
    },
    categoriaSelectorItem: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: 8,
    },
    categoriaSelectorItemActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoriaSelectorText: {
        color: COLORS.muted,
        fontSize: 14,
    },
    categoriaSelectorTextActive: {
        color: COLORS.text,
        fontWeight: "500",
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    saveBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.button,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        color: COLORS.text,
        fontSize: 16,
        fontWeight: "600",
    },
});
