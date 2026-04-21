import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppShell from './AppShell'
import SectionCard from './SectionCard'
import { appTheme } from '../constants/appTheme'

const PlaceholderScreen = ({ title, subtitle, highlights = [], note }) => {
  return (
    <AppShell title={title} subtitle={subtitle}>
      <SectionCard style={styles.spacedCard}>
        <Text style={styles.sectionTitle}>What this space is for</Text>
        {highlights.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.highlightRow}>
            <View style={styles.dot} />
            <Text style={styles.highlightText}>{item}</Text>
          </View>
        ))}
      </SectionCard>

      {note ? (
        <SectionCard style={styles.noteCard}>
          <Text style={styles.noteLabel}>Current status</Text>
          <Text style={styles.noteText}>{note}</Text>
        </SectionCard>
      ) : null}
    </AppShell>
  )
}

export default PlaceholderScreen

const styles = StyleSheet.create({
  spacedCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: appTheme.colors.title,
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: appTheme.colors.accent,
    marginRight: 12,
    marginTop: 7,
  },
  highlightText: {
    flex: 1,
    color: appTheme.colors.body,
    fontSize: 15,
    lineHeight: 22,
  },
  noteCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  noteLabel: {
    color: appTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  noteText: {
    color: appTheme.colors.primaryDeep,
    fontSize: 15,
    lineHeight: 22,
  },
})
