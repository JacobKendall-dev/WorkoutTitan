import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import * as Location from 'expo-location'
import AppShell from '../../../../components/AppShell'
import SectionCard from '../../../../components/SectionCard'
import { getDistance } from '../../../../components/GetDistance'

const DISTANCE_GOALS = [
  { label: '10 m tester', value: 10 },
  { label: '100 meters', value: 100 },
  { label: '200 meters', value: 200 },
  { label: '400 meters', value: 400 },
  { label: '800 meters', value: 800 },
  { label: '1500 meters', value: 1500 },
  { label: '1 mile', value: 1609 },
  { label: '5K', value: 5000 },
  { label: '10K', value: 10000 },
  { label: 'Half marathon', value: 21097 },
  { label: 'Marathon', value: 42195 },
]

const TIME_GOALS = [
  { label: '10 seconds', value: 10 },
  { label: '5 minutes', value: 300 },
  { label: '15 minutes', value: 900 },
  { label: '30 minutes', value: 1800 },
  { label: '60 minutes', value: 3600 },
  { label: '90 minutes', value: 5400 },
]

const Running = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [distanceCovered, setDistanceCovered] = useState(0)
  const [averageSpeed, setAverageSpeed] = useState(null)
  const [runCompleted, setRunCompleted] = useState(false)
  const [finalTime, setFinalTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimedRun, setIsTimedRun] = useState(false)
  const [activeGoalLabel, setActiveGoalLabel] = useState('No run in progress')

  const previousLocation = useRef(null)
  const startTime = useRef(null)
  const monitorRef = useRef(null)
  const totalDistanceRef = useRef(0)
  const timerIdRef = useRef(null)

  const stopActiveRun = () => {
    monitorRef.current?.remove()
    monitorRef.current = null
    clearInterval(timerIdRef.current)
    timerIdRef.current = null
  }

  const startRun = async ({ distanceGoal = 0, timeGoal = null, label }) => {
    stopActiveRun()

    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert('Location permission is required to track a run.')
      return
    }

    setActiveGoalLabel(label)
    setIsTimedRun(Boolean(timeGoal))
    setRunCompleted(false)
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

    const endRun = () => {
      stopActiveRun()
      const endTimeValue = (Date.now() - startTime.current) / 1000
      const avgSpeed = endTimeValue > 0 ? totalDistanceRef.current / endTimeValue : 0
      setFinalTime(endTimeValue)
      setAverageSpeed(avgSpeed)
      setRunCompleted(true)
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
        if (speed < 0 || speed < 0.5) {
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
          endRun()
        }
      }
    )

    if (timeGoal) {
      timerIdRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime.current) / 1000
        setElapsedTime(elapsed)
        if (elapsed >= timeGoal) endRun()
      }, 500)
    }
  }

  useEffect(() => {
    return () => stopActiveRun()
  }, [])

  return (
    <AppShell
      title="Running"
      subtitle="Track a distance-based or time-based run with live speed and distance updates using your device location."
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

        {isTimedRun && !runCompleted ? (
          <Text style={styles.helperText}>Elapsed time: {elapsedTime.toFixed(1)} s</Text>
        ) : null}

        {runCompleted ? (
          <View style={styles.resultsBlock}>
            <Text style={styles.resultsTitle}>Run completed</Text>
            <Text style={styles.helperText}>Average speed: {averageSpeed?.toFixed(2)} m/s</Text>
            <Text style={styles.helperText}>Final time: {finalTime?.toFixed(1)} seconds</Text>
          </View>
        ) : null}

        <Pressable style={styles.stopButton} onPress={stopActiveRun}>
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
              onPress={() => startRun({ distanceGoal: goal.value, label: goal.label })}
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
              onPress={() => startRun({ timeGoal: goal.value, label: goal.label })}
            >
              <Text style={styles.goalButtonText}>{goal.label}</Text>
            </Pressable>
          ))}
        </View>
      </SectionCard>
    </AppShell>
  )
}

export default Running

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
