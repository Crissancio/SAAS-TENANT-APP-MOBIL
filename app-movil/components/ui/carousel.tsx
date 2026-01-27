import React, { useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

export function Carousel({
  data,
  renderItem,
  itemWidth = width * 0.8,
  gap = 16,
  style,
}: {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactElement;
  itemWidth?: number;
  gap?: number;
  style?: any;
}) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const scrollToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, style]}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: (width - itemWidth) / 2 }}
        ItemSeparatorComponent={() => <View style={{ width: gap }} />}
        onMomentumScrollEnd={ev => {
          const idx = Math.round(
            ev.nativeEvent.contentOffset.x / (itemWidth + gap)
          );
          setCurrentIndex(idx);
        }}
        getItemLayout={(_, index) => ({
          length: itemWidth + gap,
          offset: (itemWidth + gap) * index,
          index,
        })}
      />
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => scrollToIndex(Math.max(currentIndex - 1, 0))}
          disabled={currentIndex === 0}
          style={[styles.arrowBtn, currentIndex === 0 && styles.arrowDisabled]}
        >
          <ArrowLeft size={20} color={Colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => scrollToIndex(Math.min(currentIndex + 1, data.length - 1))}
          disabled={currentIndex === data.length - 1}
          style={[styles.arrowBtn, currentIndex === data.length - 1 && styles.arrowDisabled]}
        >
          <ArrowRight size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function CarouselItem({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.item, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  item: {
    width: width * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.card || '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  arrowBtn: {
    backgroundColor: Colors.backgroundSecondary || '#E6EAEA',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 8,
  },
  arrowDisabled: {
    opacity: 0.4,
  },
});
