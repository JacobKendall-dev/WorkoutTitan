import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { CUSTOMIZABLES } from "./Customizables";

export default function AvatarCard({
  variant = "default",
  layers, // optional manual override
  size = 180,
  borderRadius = 20,
  style,
}) {
  const selected = CUSTOMIZABLES[variant] ?? CUSTOMIZABLES.default;

  // fixed render order: back -> front
  const resolvedLayers =
    layers ??
    [
      { key: "sky", source: selected.sky },
      { key: "tent", source: selected.tent },
      { key: "season", source: selected.season },
      { key: "knight", source: selected.knight },
    ];

  return (
    <View
      style={[
        styles.card,
        { width: size, height: size, borderRadius },
        style,
      ]}
    >
      {resolvedLayers.map((layer, i) => (
        <Image
          key={layer.key ?? `layer-${i}`}
          source={layer.source}
          resizeMode={layer.resizeMode || "contain"}
          style={[styles.layer, { zIndex: i }, layer.style]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    overflow: "hidden",
    position: "relative",
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});
