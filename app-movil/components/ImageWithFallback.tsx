import React, { useState } from "react";
import { Image, View, StyleSheet, ImageProps } from "react-native";

const ERROR_IMG = {
  uri: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==",
};

interface Props extends ImageProps {
  uri: string;
}

export default function ImageWithFallback({ uri, style, ...rest }: Props) {
  const [error, setError] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={error ? ERROR_IMG : { uri }}
        style={style}
        onError={() => setError(true)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
});