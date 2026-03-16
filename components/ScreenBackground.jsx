import { StyleSheet, ImageBackground, View } from 'react-native'
import React from 'react'

const ScreenBackground = ({imageSource, children, overlay= true, overlayOpacity=1, style, contentStyle, resizeMode="cover", ...props}) => {
  return (
    <View style={[styles.root, style]}>
     <ImageBackground
        source={imageSource}
        resizeMode="cover"
        style={styles.bg}
        {...props}
    />
    {overlay && (
        <View
        pointerEvents="none"
        style={[
                styles.overlay,
                { backgroundColor: `rgba(0,0,0,${overlayOpacity})` },
            ]}
            />
    )}

    <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  )
}

export default ScreenBackground

const styles = StyleSheet.create({
    root: {
        flex: 1,
  },
     bg: {
       ...StyleSheet.absoluteFillObject,
        zIndex: 0,
  },
    overlay: {
      ...StyleSheet.absoluteFillObject,
       zIndex: 1,
  },
    content: {
      flex: 1,
      zIndex: 2,
  },
})