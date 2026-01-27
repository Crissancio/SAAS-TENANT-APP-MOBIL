import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
// Asegúrate de instalar 'react-native-calendars' en tu proyecto para que este componente funcione correctamente
import { CalendarList, DateData } from 'react-native-calendars';

interface CalendarProps {
  onDayPress?: (day: DateData) => void;
  markedDates?: Record<string, any>;
  initialDate?: string;
  minDate?: string;
  maxDate?: string;
  // Puedes agregar más props según lo que necesites
}

export function Calendar({
  onDayPress,
  markedDates,
  initialDate,
  minDate,
  maxDate,
}: CalendarProps) {
  return (
    <View style={styles.container}>
      <CalendarList
        onDayPress={onDayPress}
        markedDates={markedDates}
        initialDate={initialDate}
        minDate={minDate}
        maxDate={maxDate}
        theme={{
          backgroundColor: Colors.backgroundLight,
          calendarBackground: Colors.backgroundLight,
          textSectionTitleColor: Colors.text,
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: Colors.foreground,
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.muted,
          dotColor: Colors.primary,
          selectedDotColor: Colors.foreground,
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          indicatorColor: Colors.primary,
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 15,
          textMonthFontSize: 17,
          textDayHeaderFontSize: 13,
        }}
        renderArrow={(direction: 'left' | 'right') =>
          direction === 'left' ? (
            <ChevronLeft size={18} color={Colors.text} />
          ) : (
            <ChevronRight size={18} color={Colors.text} />
          )
        }
        // Puedes agregar más props y personalización aquí
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
  },
});
