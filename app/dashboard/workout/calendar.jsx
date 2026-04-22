import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import ScreenBackground from '../../../components/ScreenBackground'

const STORAGE_KEY = 'workout-calendar-plan'
const CUSTOM_WORKOUTS_KEY = 'custom-workout-library'
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const BUILT_IN_WORKOUTS = [
  { id: 'weights-upper', title: 'Upper Body Weights', category: 'Weightlifting', detail: 'Bench, press, and pull-focused lifting.' },
  { id: 'weights-lower', title: 'Lower Body Weights', category: 'Weightlifting', detail: 'Leg day lifting and strength work.' },
  { id: 'calisthenics-upper', title: 'Upper Body Calisthenics', category: 'Calisthenics', detail: 'Push, dip, and pull bodyweight work.' },
  { id: 'calisthenics-lower', title: 'Lower Body Calisthenics', category: 'Calisthenics', detail: 'Lunges, calf raises, and wall sits.' },
  { id: 'calisthenics-core', title: 'Core', category: 'Calisthenics', detail: 'Core-focused holds and trunk work.' },
  { id: 'cardio-running', title: 'Running', category: 'Cardio', detail: 'Distance or timed runs.' },
  { id: 'cardio-cycling', title: 'Cycling', category: 'Cardio', detail: 'Ride sessions and intervals.' },
  { id: 'cardio-swimming', title: 'Swimming', category: 'Cardio', detail: 'Lap sessions and swim work.' },
]

const addDays = (date, days) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const getStartOfMonth = (date) => {
  const next = new Date(date.getFullYear(), date.getMonth(), 1)
  next.setHours(0, 0, 0, 0)
  return next
}

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const toMonthKey = (date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  return `${year}-${month}`
}

const formatFullDate = (date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

const formatWeekRange = (startDate) => {
  const endDate = addDays(startDate, 6)

  return `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
}

const isSameDay = (left, right) => toDateKey(left) === toDateKey(right)

const normalizeCustomWorkouts = (savedValue) => {
  if (!Array.isArray(savedValue)) {
    return []
  }

  return savedValue
    .filter((item) => item && typeof item === 'object' && String(item.title ?? '').trim())
    .map((item, index) => ({
      id: item.id ?? `custom-${index}`,
      title: String(item.title ?? '').trim(),
      category: item.category ? String(item.category) : 'Custom',
      detail: item.description ? String(item.description) : 'Custom workout from your library.',
    }))
}

const normalizeStoredPlan = (savedValue, monthKey) => {
  if (!savedValue || typeof savedValue !== 'object') {
    return {}
  }

  if (savedValue.monthKey !== monthKey || typeof savedValue.assignments !== 'object' || !savedValue.assignments) {
    return {}
  }

  return savedValue.assignments
}

const Calendar = () => {
  const [schedule, setSchedule] = useState({})
  const [customWorkouts, setCustomWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDay, setActiveDay] = useState(null)
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const monthStart = useMemo(() => getStartOfMonth(now), [now])
  const monthKey = useMemo(() => toMonthKey(now), [now])

  const workoutOptions = useMemo(
    () => [
      ...BUILT_IN_WORKOUTS,
      ...customWorkouts.map((workout) => ({
        id: `custom-${workout.id}`,
        title: workout.title,
        category: 'Custom',
        detail: workout.detail,
      })),
    ],
    [customWorkouts]
  )

  const plannerDays = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const date = addDays(monthStart, index)
        return {
          date,
          dateKey: toDateKey(date),
          dayLabel: DAY_LABELS[date.getDay()],
          fullLabel: formatFullDate(date),
          isToday: isSameDay(date, now),
          weekNumber: Math.floor(index / 7) + 1,
        }
      }),
    [monthStart, now]
  )

  const weeks = useMemo(
    () =>
      Array.from({ length: 4 }, (_, index) => {
        const weekStart = addDays(monthStart, index * 7)
        return {
          key: `week-${index + 1}`,
          label: `Week ${index + 1}`,
          range: formatWeekRange(weekStart),
          days: plannerDays.slice(index * 7, index * 7 + 7),
        }
      }),
    [monthStart, plannerDays]
  )

  const persistSchedule = async (nextAssignments) => {
    setSchedule(nextAssignments)
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        monthKey,
        assignments: nextAssignments,
      })
    )
  }

  useEffect(() => {
    let isMounted = true

    const loadPlanner = async () => {
      try {
        const [savedPlanner, savedCustomWorkouts] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(CUSTOM_WORKOUTS_KEY),
        ])

        if (!isMounted) {
          return
        }

        const parsedPlanner = savedPlanner ? JSON.parse(savedPlanner) : null
        const normalizedAssignments = normalizeStoredPlan(parsedPlanner, monthKey)

        setSchedule(normalizedAssignments)

        if (!parsedPlanner || parsedPlanner.monthKey !== monthKey) {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              monthKey,
              assignments: {},
            })
          )
        }

        const parsedCustomWorkouts = savedCustomWorkouts ? JSON.parse(savedCustomWorkouts) : []
        setCustomWorkouts(normalizeCustomWorkouts(parsedCustomWorkouts))
      } catch (error) {
        console.error('Failed to load workout planner:', error)
        Alert.alert('Calendar error', 'We could not load your workout schedule right now.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPlanner()

    return () => {
      isMounted = false
    }
  }, [monthKey])

  const openWorkoutPicker = (day) => {
    setActiveDay(day)
    setIsPickerVisible(true)
  }

  const closeWorkoutPicker = () => {
    setActiveDay(null)
    setIsPickerVisible(false)
  }

  const getAssignedWorkout = (dateKey) => schedule[dateKey]

  const handleAssignWorkout = async (workout) => {
    if (!activeDay) {
      return
    }

    const nextAssignments = {
      ...schedule,
      [activeDay.dateKey]: {
        workoutId: workout.id,
        workoutTitle: workout.title,
        workoutCategory: workout.category,
        workoutDetail: workout.detail,
      },
    }

    try {
      await persistSchedule(nextAssignments)
      closeWorkoutPicker()
    } catch (error) {
      console.error('Failed to assign workout:', error)
      Alert.alert('Save failed', 'We could not save that workout to your calendar.')
    }
  }

  const handleClearWorkout = async () => {
    if (!activeDay) {
      return
    }

    const nextAssignments = { ...schedule }
    delete nextAssignments[activeDay.dateKey]

    try {
      await persistSchedule(nextAssignments)
      closeWorkoutPicker()
    } catch (error) {
      console.error('Failed to clear workout assignment:', error)
      Alert.alert('Update failed', 'We could not clear that workout day right now.')
    }
  }

  const renderDayCard = (day) => {
    const assignedWorkout = getAssignedWorkout(day.dateKey)

    return (
      <View key={day.dateKey} style={[styles.dayCard, day.isToday && styles.todayCard]}>
        <View style={styles.dayHeader}>
          <View>
            <Text style={styles.dayTitle}>{day.dayLabel}</Text>
            <Text style={styles.dayDate}>{day.fullLabel}</Text>
          </View>

          {day.isToday ? (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>Today</Text>
            </View>
          ) : null}
        </View>

        <Pressable
          style={[
            styles.workoutSlot,
            assignedWorkout ? styles.workoutSlotAssigned : styles.workoutSlotEmpty,
          ]}
          onPress={() => openWorkoutPicker(day)}
        >
          <Text style={styles.workoutSlotLabel}>Scheduled workout</Text>
          <Text
            style={[styles.workoutSlotValue, !assignedWorkout && styles.workoutSlotValuePlaceholder]}
            numberOfLines={2}
          >
            {assignedWorkout?.workoutTitle || 'Select a workout'}
          </Text>
          <Text style={styles.workoutSlotDetail} numberOfLines={2}>
            {assignedWorkout?.workoutDetail || 'Tap to plan this day.'}
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <ScreenBackground
      imageSource={require('../../../assets/images/Gradient2.png')}
      overlay
      overlayOpacity={0.35}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Workout Calendar</Text>
            <Text style={styles.subtitle}>
              Schedule workouts for each day across the first four weeks of the month, then refresh with a clean plan at midnight on the first.
            </Text>
            <Text style={styles.helperText}>
              Current schedule window: {monthStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • resets automatically on the 1st at 12:00 AM
            </Text>
          </View>

          {loading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color="#f6ddd6" />
              <Text style={styles.stateText}>Loading your workout planner...</Text>
            </View>
          ) : (
            <>
              {weeks.map((week) => (
                <View key={week.key} style={styles.weekSection}>
                  <View style={styles.weekHeader}>
                    <Text style={styles.weekTitle}>{week.label}</Text>
                    <Text style={styles.weekRange}>{week.range}</Text>
                  </View>

                  {week.days.map((day) => renderDayCard(day))}
                </View>
              ))}

              {customWorkouts.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyTitle}>No custom workouts saved yet.</Text>
                  <Text style={styles.emptyText}>
                    You can still schedule the built-in workout pages now, and any custom workouts you create will appear here automatically.
                  </Text>
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={isPickerVisible}
        animationType="slide"
        transparent
        onRequestClose={closeWorkoutPicker}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose A Workout</Text>
            <Text style={styles.modalSubtitle}>
              {activeDay ? `Schedule for ${activeDay.fullLabel}` : 'Select a calendar day'}
            </Text>

            {activeDay && getAssignedWorkout(activeDay.dateKey) ? (
              <Pressable style={styles.clearButton} onPress={handleClearWorkout}>
                <Text style={styles.clearButtonText}>Clear this workout</Text>
              </Pressable>
            ) : null}

            <FlatList
              data={workoutOptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable style={styles.workoutOption} onPress={() => handleAssignWorkout(item)}>
                  <Text style={styles.workoutOptionTitle}>{item.title}</Text>
                  <Text style={styles.workoutOptionCategory}>{item.category}</Text>
                  <Text style={styles.workoutOptionPreview} numberOfLines={3}>
                    {item.detail}
                  </Text>
                </Pressable>
              )}
              contentContainerStyle={styles.workoutListContent}
              showsVerticalScrollIndicator={false}
            />

            <Pressable style={styles.closeButton} onPress={closeWorkoutPicker}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  )
}

export default Calendar

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 76,
  },
  headerBlock: {
    marginBottom: 24,
  },
  title: {
    color: '#fff7f2',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#f6ddd6',
    fontSize: 15,
    lineHeight: 22,
  },
  helperText: {
    color: '#dbc7c2',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  centerState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  stateText: {
    color: '#f6ddd6',
    fontSize: 15,
    marginTop: 14,
  },
  weekSection: {
    marginBottom: 26,
  },
  weekHeader: {
    alignItems: 'center',
    backgroundColor: 'rgba(72, 38, 28, 0.72)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  weekTitle: {
    color: '#fff7f2',
    fontSize: 22,
    fontWeight: '800',
  },
  weekRange: {
    color: '#e8d2cb',
    fontSize: 13,
    marginTop: 4,
  },
  dayCard: {
    backgroundColor: 'rgba(32, 19, 14, 0.78)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  todayCard: {
    borderColor: 'rgba(255, 215, 174, 0.72)',
    shadowColor: '#f4b183',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayTitle: {
    color: '#fff7f2',
    fontSize: 20,
    fontWeight: '700',
  },
  dayDate: {
    color: '#dac0b8',
    fontSize: 13,
    marginTop: 2,
  },
  todayBadge: {
    backgroundColor: '#f4b183',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  todayBadgeText: {
    color: '#3e1f15',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  workoutSlot: {
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  workoutSlotAssigned: {
    backgroundColor: 'rgba(244, 177, 131, 0.18)',
    borderColor: 'rgba(255, 214, 190, 0.34)',
  },
  workoutSlotEmpty: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  workoutSlotLabel: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  workoutSlotValue: {
    color: '#fff7f2',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 6,
  },
  workoutSlotValuePlaceholder: {
    color: '#c8b4ad',
    fontWeight: '500',
  },
  workoutSlotDetail: {
    color: '#dac0b8',
    fontSize: 13,
    lineHeight: 19,
  },
  emptyCard: {
    backgroundColor: 'rgba(32, 19, 14, 0.78)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 8,
    padding: 20,
  },
  emptyTitle: {
    color: '#fff7f2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    color: '#dac0b8',
    fontSize: 14,
    lineHeight: 21,
  },
  modalBackdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  modalCard: {
    backgroundColor: '#fff5ef',
    borderRadius: 28,
    maxHeight: '86%',
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 18,
    width: '100%',
  },
  modalTitle: {
    color: '#502a20',
    fontSize: 24,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: '#7b5448',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
    marginTop: 6,
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#f7d9cb',
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearButtonText: {
    color: '#7d2f1f',
    fontSize: 13,
    fontWeight: '700',
  },
  workoutListContent: {
    paddingBottom: 8,
  },
  workoutOption: {
    backgroundColor: '#fffdfb',
    borderColor: '#ecd4ca',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  workoutOptionTitle: {
    color: '#502a20',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  workoutOptionCategory: {
    color: '#7d2f1f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  workoutOptionPreview: {
    color: '#7b5448',
    fontSize: 13,
    lineHeight: 19,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: '#5b3328',
    borderRadius: 18,
    marginTop: 8,
    paddingVertical: 14,
  },
  closeButtonText: {
    color: '#fff7f2',
    fontSize: 15,
    fontWeight: '700',
  },
})
