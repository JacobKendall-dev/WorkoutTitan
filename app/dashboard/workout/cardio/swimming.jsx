import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import AppShell from '../../../../components/AppShell'
import SectionCard from '../../../../components/SectionCard'
import { getDistance } from '../../../../components/GetDistance'
import { useWorkouts } from '../../../../hooks/useWorkouts'

const DISTANCE_GOALS = [
  { label: '50 meter sprint', value: 50 },
  { label: '100 meters', value: 100 },
  { label: '250 meters', value: 250 },
  { label: '500 meters', value: 500 },
  { label: '800 meters', value: 800 },
  { label: '1500 meters', value: 1500 },
  { label: '2 kilometers', value: 2000 },
]

const TIME_GOALS = [
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '20 minutes', value: 1200 },
  { label: '30 minutes', value: 1800 },
  { label: '45 minutes', value: 2700 },
  { label: '60 minutes', value: 3600 },
]

const Swimming = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [distanceCovered, setDistanceCovered] = useState(0)
  const [averageSpeed, setAverageSpeed] = useState(null)
  const [swimCompleted, setSwimCompleted] = useState(false)
  const [finalTime, setFinalTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimedSwim, setIsTimedSwim] = useState(false)
  const [activeGoalLabel, setActiveGoalLabel] = useState('No swim in progress')

  const previousLocation = useRef(null)
  const startTime = useRef(null)
  const monitorRef = useRef(null)
  const totalDistanceRef = useRef(0)
  const timerIdRef = useRef(null)
  const { logWorkoutActivity } = useWorkouts()

  const stopActiveSwim = () => {
    monitorRef.current?.remove()
    monitorRef.current = null
    clearInterval(timerIdRef.current)
    timerIdRef.current = null
  }

  const startSwim = async ({ distanceGoal = 0, timeGoal = null, label }) => {
    stopActiveSwim()

    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert('Location permission is required to track a swim.')
      return
    }

    setActiveGoalLabel(label)
    setIsTimedSwim(Boolean(timeGoal))
    setSwimCompleted(false)
    setAverageSpeed(null)
    setCurrentSpeed(0)
    setDistanceCovered(0)
    setFinalTime(null)
    setElapsedTime(0)
    totalDistanceRef.current = 0

    const warmup = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    })

    previousLocation.current = {
      latitude: warmup.coords.latitude,
      longitude: warmup.coords.longitude,
    }

    startTime.current = Date.now()
    logWorkoutActivity('cardio', 'Swimming', label).catch((error) => {
      console.log('Unable to log workout activity:', error)
    })

    const endSwim = () => {
      stopActiveSwim()
      const endTimeValue = (Date.now() - startTime.current) / 1000
      const avgSpeed = endTimeValue > 0 ? totalDistanceRef.current / endTimeValue : 0
      setFinalTime(endTimeValue)
      setAverageSpeed(avgSpeed)
      setSwimCompleted(true)
    }

    monitorRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (location) => {
        if (!location?.coords) return
        if (location.coords.accuracy > 20) return

        const newCoords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }

        const speed = location.coords.speed ?? 0
        if (speed < 0 || speed < 0.2) {
          setCurrentSpeed(0)
          previousLocation.current = newCoords
          return
        }

        const smoothed = {
          latitude: 0.7 * newCoords.latitude + 0.3 * previousLocation.current.latitude,
          longitude: 0.7 * newCoords.longitude + 0.3 * previousLocation.current.longitude,
        }

        const distance = getDistance(previousLocation.current, smoothed)
        if (distance > 0.1) totalDistanceRef.current += distance

        previousLocation.current = smoothed
        setDistanceCovered(totalDistanceRef.current)
        setCurrentSpeed(speed)

        if (distanceGoal && totalDistanceRef.current >= distanceGoal) {
          endSwim()
        }
      }
    )

    if (timeGoal) {
      timerIdRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime.current) / 1000
        setElapsedTime(elapsed)
        if (elapsed >= timeGoal) endSwim()
      }, 500)
    }
  }

  useEffect(() => {
    return () => stopActiveSwim()
  }, [])

  return (
    <AppShell
      title="Swimming"
      subtitle="Track a distance-based or time-based swim."
    >
      <SectionCard style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current session</Text>
        <Text style={styles.statusTitle}>{activeGoalLabel}</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricName}>Speed</Text>
            <Text style={styles.metricValue}>{currentSpeed.toFixed(2)} m/s</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricName}>Distance</Text>
            <Text style={styles.metricValue}>{distanceCovered.toFixed(1)} m</Text>
          </View>
        </View>

        {isTimedSwim && !swimCompleted ? (
          <Text style={styles.helperText}>Elapsed time: {elapsedTime.toFixed(1)} s</Text>
        ) : null}

        {swimCompleted ? (
          <View style={styles.resultsBlock}>
            <Text style={styles.resultsTitle}>Swim completed</Text>
            <Text style={styles.helperText}>Average speed: {averageSpeed?.toFixed(2)} m/s</Text>
            <Text style={styles.helperText}>Final time: {finalTime?.toFixed(1)} seconds</Text>
          </View>
        ) : null}

        <Pressable style={styles.stopButton} onPress={stopActiveSwim}>
          <Text style={styles.stopButtonText}>Stop Active Tracking</Text>
        </Pressable>
      </SectionCard>

      <SectionCard style={styles.goalCard}>
        <Text style={styles.goalTitle}>Distance goals</Text>
        <View style={styles.goalGrid}>
          {DISTANCE_GOALS.map((goal) => (
            <Pressable
              key={goal.label}
              style={styles.goalButton}
              onPress={() => startSwim({ distanceGoal: goal.value, label: goal.label })}
            >
              <Text style={styles.goalButtonText}>{goal.label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>

      <SectionCard style={styles.goalCard}>
        <Text style={styles.goalTitle}>Timed goals</Text>
        <View style={styles.goalGrid}>
          {TIME_GOALS.map((goal) => (
            <Pressable
              key={goal.label}
              style={styles.goalButton}
              onPress={() => startSwim({ timeGoal: goal.value, label: goal.label })}
            >
              <Text style={styles.goalButtonText}>{goal.label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
    </AppShell>
  )
}

export default Swimming

const styles = StyleSheet.create({
  statusCard: {
    marginBottom: 16,
  },
  statusLabel: {
    color: '#f7d9c6',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  statusTitle: {
    color: '#fff7f2',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 14,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(247, 234, 228, 0.12)',
    borderRadius: 18,
    padding: 14,
  },
  metricName: {
    color: '#f4ddd6',
    fontSize: 13,
    marginBottom: 8,
  },
  metricValue: {
    color: '#fff7f2',
    fontSize: 20,
    fontWeight: '800',
  },
  helperText: {
    color: '#dac0b8',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 4,
  },
  resultsBlock: {
    marginTop: 6,
    marginBottom: 12,
  },
  resultsTitle: {
    color: '#f7d9c6',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  stopButton: {
    marginTop: 10,
    minHeight: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ead8d2',
  },
  stopButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  goalCard: {
    backgroundColor: 'rgba(247, 234, 228, 0.95)',
    borderColor: '#ceb1a8',
    marginBottom: 16,
  },
  goalTitle: {
    color: '#5d343a',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 14,
  },
  goalGrid: {
    gap: 10,
  },
  goalButton: {
    minHeight: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d6b8af',
    backgroundColor: '#fff8f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  goalButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
})
