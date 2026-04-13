import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import ScreenBackground from '../../../components/ScreenBackground'

const STORAGE_KEY = 'kitchen-calorie-tracker'
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const getStartOfWeek = (date = new Date()) => {
  const nextDate = new Date(date)
  nextDate.setHours(0, 0, 0, 0)
  nextDate.setDate(nextDate.getDate() - nextDate.getDay())
  return nextDate
}

const createWeekState = (date = new Date()) => {
  const startOfWeek = getStartOfWeek(date)
  const todayKey = toDateKey(date)

  return {
    weekStart: toDateKey(startOfWeek),
    dailyTotals: {
      [todayKey]: 0,
    },
  }
}

const normalizeTrackerState = (savedState, currentDate = new Date()) => {
  const freshWeek = createWeekState(currentDate)

  if (!savedState || typeof savedState !== 'object') {
    return freshWeek
  }

  if (savedState.weekStart !== freshWeek.weekStart) {
    return freshWeek
  }

  return {
    weekStart: savedState.weekStart,
    dailyTotals: {
      ...savedState.dailyTotals,
      [toDateKey(currentDate)]: savedState.dailyTotals?.[toDateKey(currentDate)] ?? 0,
    },
  }
}

const Tracker = () => {
  const [trackerState, setTrackerState] = useState(() => createWeekState())
  const [calorieInput, setCalorieInput] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)

  const today = new Date()
  const todayKey = toDateKey(today)
  const dayOfWeek = today.getDay()

  const weekDays = useMemo(() => {
    const start = getStartOfWeek(today)

    return DAY_LABELS.map((label, index) => {
      const currentDay = new Date(start)
      currentDay.setDate(start.getDate() + index)
      const dateKey = toDateKey(currentDay)

      return {
        label,
        dateKey,
        total: trackerState.dailyTotals?.[dateKey] ?? 0,
        isToday: dateKey === todayKey,
      }
    })
  }, [todayKey, trackerState.dailyTotals])

  const dailyTotal = trackerState.dailyTotals?.[todayKey] ?? 0
  const totalSoFar = weekDays
    .slice(0, dayOfWeek + 1)
    .reduce((sum, day) => sum + day.total, 0)
  const weeklyAverage = Math.round(totalSoFar / (dayOfWeek + 1))

  const saveTrackerState = async (nextState) => {
    setTrackerState(nextState)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState))
  }

  const syncTrackerState = async () => {
    try {
      const savedValue = await AsyncStorage.getItem(STORAGE_KEY)
      const parsedValue = savedValue ? JSON.parse(savedValue) : null
      const normalizedState = normalizeTrackerState(parsedValue)

      setTrackerState(normalizedState)

      if (JSON.stringify(parsedValue) !== JSON.stringify(normalizedState)) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedState))
      }
    } catch (error) {
      console.error('Failed to load calorie tracker', error)
      Alert.alert('Tracker error', 'We could not load your calorie tracker right now.')
    } finally {
      setIsLoaded(true)
    }
  }

  useEffect(() => {
    syncTrackerState()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      syncTrackerState()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const handleAddCalories = async () => {
    const calories = Number(calorieInput)

    if (!calorieInput.trim() || Number.isNaN(calories) || calories <= 0) {
      Alert.alert('Invalid entry', 'Please enter a calorie amount greater than 0.')
      return
    }

    try {
      const savedValue = await AsyncStorage.getItem(STORAGE_KEY)
      const parsedValue = savedValue ? JSON.parse(savedValue) : null
      const normalizedState = normalizeTrackerState(parsedValue)
      const currentTodayKey = toDateKey(new Date())
      const nextState = {
        ...normalizedState,
        dailyTotals: {
          ...normalizedState.dailyTotals,
          [currentTodayKey]: (normalizedState.dailyTotals?.[currentTodayKey] ?? 0) + calories,
        },
      }

      await saveTrackerState(nextState)
      setCalorieInput('')
    } catch (error) {
      console.error('Failed to save calorie entry', error)
      Alert.alert('Tracker error', 'We could not save that calorie entry.')
    }
  }

  const handleResetWeek = async () => {
    try {
      const freshState = createWeekState()
      await saveTrackerState(freshState)
      setCalorieInput('')
    } catch (error) {
      console.error('Failed to reset tracker', error)
      Alert.alert('Tracker error', 'We could not reset the tracker right now.')
    }
  }

  return (
    <ScreenBackground
      imageSource={require('../../../assets/images/Gradient2.png')}
      overlay
      overlayOpacity={0.35}
      contentStyle={styles.screenContent}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Calorie Tracker</Text>
          <Text style={styles.subtitle}>
            Log what you just ate, keep today&apos;s total, and track your weekly average.
          </Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Today</Text>
              <Text style={styles.summaryValue}>{isLoaded ? dailyTotal : '--'}</Text>
              <Text style={styles.summaryUnit}>calories</Text>
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Weekly Avg</Text>
              <Text style={styles.summaryValue}>{isLoaded ? weeklyAverage : '--'}</Text>
              <Text style={styles.summaryUnit}>calories/day</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Add Recent Calories</Text>
            <TextInput
              style={styles.input}
              value={calorieInput}
              onChangeText={setCalorieInput}
              keyboardType="numeric"
              placeholder="Enter calories"
              placeholderTextColor="#9d8d88"
            />

            <Pressable style={styles.primaryButton} onPress={handleAddCalories}>
              <Text style={styles.primaryButtonText}>Add To Today</Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>This Week</Text>
            {weekDays.map((day) => (
              <View
                key={day.dateKey}
                style={[styles.dayRow, day.isToday && styles.todayRow]}
              >
                <Text style={styles.dayLabel}>{day.label}</Text>
                <Text style={styles.dayValue}>{day.total} cal</Text>
              </View>
            ))}
            <Text style={styles.resetNote}>
              This tracker resets automatically each Sunday at 12:00 AM.
            </Text>
          </View>

          <Pressable style={styles.secondaryButton} onPress={handleResetWeek}>
            <Text style={styles.secondaryButtonText}>Reset This Week Now</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  )
}

export default Tracker

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 32,
  },
  title: {
    color: '#f7e7e2',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: '#524439',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#f2d8d1',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'rgba(92, 45, 51, 0.88)',
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#b98d84',
  },
  summaryLabel: {
    color: '#f6ddd6',
    fontSize: 14,
    marginBottom: 8,
  },
  summaryValue: {
    color: '#fff5f2',
    fontSize: 28,
    fontWeight: '700',
  },
  summaryUnit: {
    color: '#efd1c7',
    fontSize: 13,
    marginTop: 4,
  },
  panel: {
    backgroundColor: 'rgba(247, 234, 228, 0.94)',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#b79a92',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5d343a',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#c9afa7',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#432328',
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#723a45',
    borderRadius: 18,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#a86b75',
  },
  primaryButtonText: {
    color: '#f6ddd6',
    fontSize: 16,
    fontWeight: '600',
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4d2cd',
  },
  todayRow: {
    backgroundColor: '#f3e0db',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  dayLabel: {
    color: '#4e2a30',
    fontSize: 16,
    fontWeight: '600',
  },
  dayValue: {
    color: '#723a45',
    fontSize: 16,
    fontWeight: '700',
  },
  resetNote: {
    marginTop: 14,
    color: '#7a5b58',
    fontSize: 13,
    lineHeight: 19,
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#f0d0c6',
    backgroundColor: 'rgba(86, 39, 46, 0.7)',
  },
  secondaryButtonText: {
    color: '#fff0eb',
    fontSize: 15,
    fontWeight: '600',
  },
})
