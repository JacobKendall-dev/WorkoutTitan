import { StyleSheet, Text, View, Pressable } from 'react-native'
import { Link, useRouter } from 'expo-router'
import React from 'react'
import AppShell from '../../../components/AppShell'
import SectionCard from '../../../components/SectionCard'
import { appTheme } from '../../../constants/appTheme'

const CATEGORIES = [
  {
    id: 'weights',
    name: 'Weights',
    icon: '🏋️',
    iconBg: '#f4ddd6',
    workouts: [
      { label: 'Upper body', href: '/dashboard/workout/weightlifting/upperbodyW' },
      { label: 'Lower body', href: '/dashboard/workout/weightlifting/lowerbodyW' },
    ],
  },
  {
    id: 'cardio',
    name: 'Cardio',
    icon: '🏃',
    iconBg: '#f8e4d2',
    workouts: [
      { label: 'Running', href: '/dashboard/workout/cardio/running' },
      { label: 'Cycling', href: '/dashboard/workout/cardio/cycling' },
      { label: 'Swimming', href: '/dashboard/workout/cardio/swimming' },
    ],
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics',
    icon: '🤸',
    iconBg: '#efdde4',
    workouts: [
      { label: 'Upper body', href: '/dashboard/workout/calisthenics/upperbodyC' },
      { label: 'Lower body', href: '/dashboard/workout/calisthenics/lowerbodyC' },
      { label: 'Core', href: '/dashboard/workout/calisthenics/core' },
    ],
  },
  {
    id: 'create',
    name: 'Create',
    icon: '➕',
    iconBg: '#f4d5bf',
    workouts: [{ label: 'New custom workout', href: '/dashboard/workout/createWorkout' }],
  },
]

const Workout = () => {
  const router = useRouter()

  return (
    <AppShell
      title="Workout"
      subtitle="Choose a workout below, or create your own."
    >
      <SectionCard style={styles.heroCard}>
        <Text style={styles.heroLabel}>Workout hub</Text>
        <View style={styles.heroActions}>
          <Link href="/dashboard/workout/challenges" asChild>
            <Pressable style={styles.primaryAction}>
              <Text style={styles.primaryActionText}>Challenges</Text>
            </Pressable>
          </Link>
          <Link href="/dashboard/workout/calendar" asChild>
            <Pressable style={styles.secondaryAction}>
              <Text style={styles.secondaryActionText}>Calendar</Text>
            </Pressable>
          </Link>
        </View>
      </SectionCard>

      <View style={styles.categoryGrid}>
        {CATEGORIES.map((category) => (
          <SectionCard key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={[styles.iconWrap, { backgroundColor: category.iconBg }]}>
                <Text style={styles.iconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryTitle} numberOfLines={1}>
                {category.name}
              </Text>
            </View>

            <View style={styles.chipWrap}>
              {category.workouts.map((workout) => (
                <Pressable
                  key={workout.href}
                  style={styles.chip}
                  onPress={() => router.push(workout.href)}
                >
                  <Text style={styles.chipText} numberOfLines={1}>
                    {workout.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </SectionCard>
        ))}
      </View>
    </AppShell>
  )
}

export default Workout

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: 12,
    paddingVertical: 14,
  },
  heroLabel: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#f4b183',
    borderColor: '#ffd6be',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  primaryActionText: {
    color: '#4c271d',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 234, 228, 0.16)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 42,
  },
  secondaryActionText: {
    color: '#fff7f2',
    fontSize: 14,
    fontWeight: '700',
  },
  categoryGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  categoryCard: {
    width: '48.5%',
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
    marginBottom: 0,
  },
  categoryHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 17,
  },
  categoryTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    flexShrink: 1,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipText: {
    color: appTheme.colors.primaryDeep,
    fontSize: 12,
    fontWeight: '700',
  },
})