import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

interface Item {
  title: string;
  content: React.ReactNode;
}

interface Props {
  items: Item[];
}

export default function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <TouchableOpacity
            style={styles.trigger}
            onPress={() => toggle(i)}
          >
            <Text style={styles.title}>{item.title}</Text>

            <ChevronDown
              size={18}
              style={{
                transform: [{ rotate: openIndex === i ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>

          {openIndex === i && (
            <View style={styles.content}>
              {item.content}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: "#1D7373",
  },

  trigger: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  title: {
    fontSize: 14,
    fontWeight: "500",
  },

  content: {
    paddingBottom: 16,
  },
});