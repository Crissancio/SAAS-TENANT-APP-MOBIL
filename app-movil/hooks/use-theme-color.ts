/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  // Si el color viene por props, úsalo
  if (colorFromProps) {
    return colorFromProps;
  }

  // Compatibilidad: Colors es un objeto plano, no por tema
  if (typeof Colors[theme] === 'undefined' && typeof Colors[colorName] !== 'undefined') {
    return Colors[colorName];
  }

  // Si Colors[theme] existe y tiene el color
  if (Colors[theme] && Colors[theme][colorName]) {
    return Colors[theme][colorName];
  }

  // Si no se encuentra el color, lanza un error claro
  throw new Error(`Color '${colorName}' no está definido en Colors.`);
}
