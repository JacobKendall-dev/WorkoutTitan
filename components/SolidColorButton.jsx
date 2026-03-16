import { Pressable, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'

const PlainButton = ({ title, onPress, imageSource, style, textStyle, ...props }) => {


  return (
    <View style={styles.container}>
        <Pressable 
            onPress={onPress}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
                style,
            ]}
            {...props}
            >
            <Text 
                    style={[styles.text, textStyle]} 
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}>
                        {title}
                    </Text>
        </Pressable>
    </View>
  )
}

export default PlainButton


const styles = StyleSheet.create({
container: {
    width: 100,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#723a45",
    outlineColor: "#a86b75",
    outlineWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  text: {
    color: "#F6DDD6",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.8)", 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 6,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
})