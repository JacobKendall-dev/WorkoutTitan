import { Pressable, StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'

const SignButton = ({ title, onPress, imageSource, style, textStyle, ...props }) => {


  return (
    <Pressable 
        onPress={onPress}
        style={({ pressed }) => [
            styles.container,
            pressed && styles.pressed,
            style,
        ]}
        {...props}
        >
            <ImageBackground
                source={imageSource ?? require("../assets/images/plankwobg.png")}
                style={styles.image}
                imageStyle={styles.imageBorder}
                resizeMode="cover"
                >
                <Text 
                style={[styles.text, textStyle]} 
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.6}>
                    {title}
                </Text>
            </ImageBackground>
    </Pressable>
  )
}

export default SignButton


const styles = StyleSheet.create({
container: {
    width: 260,
    height: 60,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBorder: {
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textShadowColor: "rgba(0,0,0,0.8)", 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 12,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
})

