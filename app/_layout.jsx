import React from "react"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { UserProvider } from "../contexts/UserContext"
import { StyleSheet, Text, TextInput } from "react-native"
import { useFonts } from "expo-font"

const APP_FONT_FAMILY = "Kaitlynhw"

const stripUnsupportedFontVariants = (style) => {
  const flattenedStyle = StyleSheet.flatten(style) ?? {}
  const { fontWeight, fontStyle, ...safeStyle } = flattenedStyle
  return {
    ...safeStyle,
    fontFamily: APP_FONT_FAMILY,
  }
}

const applyGlobalFontDefaults = () => {
  const textDefaults = Text.defaultProps ?? {}

  Text.defaultProps = {
    ...textDefaults,
    style: stripUnsupportedFontVariants(textDefaults.style),
  }

  const inputDefaults = TextInput.defaultProps ?? {}

  TextInput.defaultProps = {
    ...inputDefaults,
    style: stripUnsupportedFontVariants(inputDefaults.style),
  }
}

const applyGlobalFontRenderers = () => {
  if (!global.__workoutTitanFontPatched) {
    const defaultTextRender = Text.render
    const defaultTextInputRender = TextInput.render

    Text.render = function render(...args) {
      const origin = defaultTextRender.call(this, ...args)
      return React.cloneElement(origin, {
        style: stripUnsupportedFontVariants(origin.props.style),
      })
    }

    TextInput.render = function render(...args) {
      const origin = defaultTextInputRender.call(this, ...args)
      return React.cloneElement(origin, {
        style: stripUnsupportedFontVariants(origin.props.style),
      })
    }

    global.__workoutTitanFontPatched = true
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [APP_FONT_FAMILY]: require("../assets/fonts/Kaitlynhw-Regular.ttf"),
  })

  if (!fontsLoaded) {
    return null
  }

  applyGlobalFontDefaults()
  applyGlobalFontRenderers()

  return (
    <UserProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerTitleStyle: { fontFamily: APP_FONT_FAMILY },
          headerBackTitleStyle: { fontFamily: APP_FONT_FAMILY },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </UserProvider>
  )
}

const syles = StyleSheet.create({})
