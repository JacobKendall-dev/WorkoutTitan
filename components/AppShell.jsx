import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenBackground from './ScreenBackground'
import { appTheme } from '../constants/appTheme'

const backgroundImage = require('../assets/images/Gradient2.png')

const AppShell = ({
  title,
  subtitle,
  children,
  scroll = true,
  contentContainerStyle,
  headerStyle,
}) => {
  const content = (
    <>
      {(title || subtitle) ? (
        <View style={[styles.header, headerStyle]}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      ) : null}
      {children}
    </>
  )

  return (
    <ScreenBackground
      imageSource={backgroundImage}
      overlay
      overlayOpacity={appTheme.colors.overlay}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, contentContainerStyle]}>{content}</View>
        )}
      </SafeAreaView>
    </ScreenBackground>
  )
}

export default AppShell

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 36,
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: appTheme.colors.title,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: '#524439',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: appTheme.colors.subtitle,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 560,
  },
})

