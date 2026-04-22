import React from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import AppShell from './AppShell'
import SectionCard from './SectionCard'
import { appTheme } from '../constants/appTheme'
import { useWorkouts } from '../hooks/useWorkouts'

const PlaceholderScreen = ({ title, subtitle, highlights = [], note, activityConfig }) => {
  const { logWorkoutActivity } = useWorkouts()

  const handleStartSession = async () => {
    if (!activityConfig) return

    try {
      await logWorkoutActivity(activityConfig.categoryId, activityConfig.workoutName, activityConfig.exerciseName)
      Alert.alert('Session started', 'This workout was added to your weekly activity.')
    } catch (error) {
      Alert.alert('Unable to start session', 'Please try again in a moment.')
    }
  }

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

      {activityConfig ? (
        <SectionCard style={styles.actionCard}>
          <Text style={styles.noteLabel}>Activity</Text>
          <Text style={styles.noteText}>
            Start a session here to count it toward this week's sessions and streak.
          </Text>
          <Pressable style={styles.startButton} onPress={handleStartSession}>
            <Text style={styles.startButtonText}>{activityConfig.buttonLabel ?? 'Start Session'}</Text>
          </Pressable>
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
  actionCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  startButton: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: appTheme.colors.primary,
  },
  startButtonText: {
    color: '#f7e7e2',
    fontSize: 15,
    fontWeight: '700',
  },
})

