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
    description: 'Upper and lower body strength sessions, timers, and progress logging.',
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
    description: 'Distance, timed sessions, and route-based training screens.',
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
    description: 'Bodyweight-focused logging for upper, lower, and core work.',
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
    description: 'Build your own workout entries and keep them in one place.',
    workouts: [{ label: 'Create custom workout', href: '/dashboard/workout/createWorkout' }],
  },
]

const Workout = () => {
  const router = useRouter()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <AppShell
      title="Workout"
      subtitle={`Choose a workout from one of our present, or create your own custom workout. `}
    >
      <SectionCard style={styles.heroCard}>
        <Text style={styles.heroLabel}>Workout hub</Text>
        <Text style={styles.heroBody}>
          Checkout the challenges or schedule upcoming workouts
        </Text>
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

      <View style={styles.categoryStack}>
        {CATEGORIES.map((category) => (
          <SectionCard key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              {category.id === 'create' ? (
                <View style={[styles.iconWrap, { backgroundColor: category.iconBg }]}>
                  <Text style={styles.iconText}>{category.icon}</Text>
                </View>
              ) : null}
              <View style={styles.categoryCopy}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryDescription}>{category.description}</Text>
              </View>
            </View>

            <View style={styles.linkStack}>
              {category.workouts.map((workout) => (
                <Pressable
                  key={workout.href}
                  style={styles.linkCard}
                  onPress={() => router.push(workout.href)}
                >
                  <Text style={styles.linkTitle}>{workout.label}</Text>
                  <Text style={styles.linkDetail}>Open this workout page</Text>
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
    marginBottom: 16,
  },
  heroLabel: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heroBody: {
    color: '#f8ece7',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: '#f4b183',
    borderColor: '#ffd6be',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryActionText: {
    color: '#4c271d',
    fontSize: 15,
    fontWeight: '800',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: 'rgba(247, 234, 228, 0.16)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  secondaryActionText: {
    color: '#fff7f2',
    fontSize: 15,
    fontWeight: '700',
  },
  categoryStack: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  categoryHeader: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  categoryCopy: {
    flex: 1,
  },
  categoryTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  categoryDescription: {
    color: '#775a56',
    fontSize: 14,
    lineHeight: 20,
  },
  linkStack: {
    gap: 10,
  },
  linkCard: {
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },
  linkTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  linkDetail: {
    color: '#7b625d',
    fontSize: 13,
  },
})

