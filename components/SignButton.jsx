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
                source={require("C:/Users/kayly/OneDrive/Documents/UT School 25-26/Spring 26/Capstone/WorkoutTitan/assets/images/wooden-sign.png")}
                style={styles.image}
                imageStyle={styles.imageBorder}
                >
                <View style={styles.overlay} />
                <Text style={[styles.text, textStyle]}>
                    {title}
                </Text>
            </ImageBackground>
    </Pressable>
  )
}

export default SignButton

const styles = StyleSheet.create({
container: {
    width: 220,
    height: 60,
    borderRadius: 12,
    overflow: "hidden",
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
    fontWeight: "bold",
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
})