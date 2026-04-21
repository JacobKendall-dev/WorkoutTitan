import React from 'react'
import { StyleSheet, View } from 'react-native'
import { appTheme } from '../constants/appTheme'

const SectionCard = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>
}

export default SectionCard

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: appTheme.colors.border,
    padding: 18,
  },
})
