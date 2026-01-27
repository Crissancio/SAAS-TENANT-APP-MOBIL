// utils/cn.ts
// Para React Native: simplemente retorna el array de estilos filtrando falsy
export function cn(...inputs: any[]): any[] {
  return inputs.filter(Boolean);
}
