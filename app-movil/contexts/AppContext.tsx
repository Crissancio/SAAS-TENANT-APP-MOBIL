import React, { createContext, useContext, useState, ReactNode } from "react";

/* === TIPOS === */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  image: string;
}

export interface Client {
  id: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  items: CartItem[];
  total: number;
  date: Date;
}

export interface Notification {
  id: string;
  type: "STOCK_BAJO" | "VENTA_REALIZADA" | "COMPRA_CONFIRMADA" | "PAGO_RECIBIDO";
  message: string;
  date: Date;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "vendedor";
  company: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  products: Product[];
  clients: Client[];
  cart: CartItem[];
  sales: Sale[];
  notifications: Notification[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  processSale: (client: Client) => void;
  addClient: (client: Omit<Client, "id">) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/* === PROVIDER === */

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Laptop HP",
      description: 'Laptop HP 15.6" Intel Core i5',
      price: 4500,
      stock: 5,
      minStock: 3,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    },
    {
      id: "2",
      name: "Mouse Logitech",
      description: 'Mouse inalámbrico Logitech',
      price: 85,
      stock: 2,
      minStock: 3,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    },
    {
      id: "3",
      name: "Teclado Mecánico",
      description: 'Teclado mecánico retroiluminado',
      price: 320,
      stock: 8,
      minStock: 2,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400",
    },
    {
      id: "4",
      name: "Monitor LG 24\"",
      description: 'Monitor LG 24 pulgadas Full HD',
      price: 890,
      stock: 12,
      minStock: 4,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
    },
    {
      id: "5",
      name: "Auriculares Sony",
      description: 'Auriculares inalámbricos Sony',
      price: 650,
      stock: 4,
      minStock: 2,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    },
    {
      id: "6",
      name: "Impresora Epson",
      description: 'Impresora multifunción Epson',
      price: 1200,
      stock: 1,
      minStock: 2,
      category: "Oficina",
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400",
    },
    {
      id: "7",
      name: "Silla ergonómica",
      description: 'Silla ergonómica de oficina',
      price: 980,
      stock: 6,
      minStock: 2,
      category: "Oficina",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400",
    },
    {
      id: "8",
      name: "Webcam HD",
      description: 'Webcam HD 1080p',
      price: 210,
      stock: 1,
      minStock: 2,
      category: "Electrónica",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
    },
    {
      id: "9",
      name: "Disco SSD 480GB",
      description: 'Disco sólido Kingston 480GB',
      price: 350,
      stock: 10,
      minStock: 3,
      category: "Almacenamiento",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400",
    },
    {
      id: "10",
      name: "Router TP-Link",
      description: 'Router inalámbrico TP-Link',
      price: 180,
      stock: 3,
      minStock: 2,
      category: "Redes",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400",
    },
  ]);

  const [clients, setClients] = useState<Client[]>([]);

  const [sales, setSales] = useState<Sale[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));

    if (email && password) {
      setUser({
        id: "1",
        name: "Admin",
        email,
        role: "admin",
        company: "Mi Microempresa",
      });

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const item = prev.find((i) => i.product.id === product.id);
      if (item) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(id);

    setCart((prev) =>
      prev.map((i) => (i.product.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const processSale = (client: Client) => {
    const total = cart.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );

    setSales((prev) => [
      {
        id: Date.now().toString(),
        clientId: client.id,
        clientName: client.name,
        items: cart,
        total,
        date: new Date(),
      },
      ...prev,
    ]);

    clearCart();
  };

  const addClient = (data: Omit<Client, "id">) =>
    setClients((p) => [...p, { ...data, id: Date.now().toString() }]);

  const updateClient = (id: string, data: Partial<Client>) =>
    setClients((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c)));

  const deleteClient = (id: string) =>
    setClients((p) => p.filter((c) => c.id !== id));

  const markNotificationAsRead = (id: string) =>
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        products,
        clients,
        cart,
        sales,
        notifications,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        processSale,
        addClient,
        updateClient,
        deleteClient,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}