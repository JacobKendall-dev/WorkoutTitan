import Slider from '@react-native-community/slider'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import AppShell from './AppShell'
import SectionCard from './SectionCard'
import { appTheme } from '../constants/appTheme'
import { useWorkouts } from '../hooks/useWorkouts'

const DEFAULT_PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const createEmptySet = () => ({
  weight: '',
  reps: '',
  seconds: '',
  _min: undefined,
  _sec: undefined,
})

const createDefaultSets = () => [createEmptySet(), createEmptySet(), createEmptySet()]

const formatLoggedSet = (set, fieldType) => {
  if (fieldType === 'weightReps') {
    return `${set.weight ?? 0} lbs x ${set.reps ?? 0} reps`
  }

  if (fieldType === 'seconds') {
    return `${set.seconds ?? 0} sec`
  }

  return `${set.reps ?? 0} reps`
}

const normalizeSetsForFieldType = (existingSets, fieldType) => {
  if (!Array.isArray(existingSets) || !existingSets.length) {
    return createDefaultSets()
  }

  return existingSets.map((set) => ({
    weight: fieldType === 'weightReps' ? String(set.weight ?? '') : '',
    reps: fieldType !== 'seconds' ? String(set.reps ?? '') : '',
    seconds: fieldType === 'seconds' ? String(set.seconds ?? '') : '',
    _min: undefined,
    _sec: undefined,
  }))
}

const serializeSets = (sets, fieldType) =>
  sets.map((set) => {
    if (fieldType === 'weightReps') {
      return {
        weight: Number.isFinite(Number(set.weight)) ? Number(set.weight) : 0,
        reps: Number.isFinite(Number(set.reps)) ? Number(set.reps) : 0,
      }
    }

    if (fieldType === 'seconds') {
      return {
        seconds: Number.isFinite(Number(set.seconds)) ? Number(set.seconds) : 0,
      }
    }

    return {
      reps: Number.isFinite(Number(set.reps)) ? Number(set.reps) : 0,
    }
  })

const formatTimerValue = (remaining) => {
  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const WorkoutLoggerScreen = ({
  title,
  subtitle,
  workouts,
  presets = DEFAULT_PRESETS,
  emptyDescription = 'Choose an exercise to start logging sets and timers.',
}) => {
  const intervalRef = useRef(null)
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [sets, setSets] = useState(createDefaultSets)
  const [personalBest, setPersonalBest] = useState('')

  const { exercises, logExercise } = useWorkouts()

  const selectedHistory = useMemo(() => {
    if (!selectedWorkout) {
      return null
    }

    return exercises?.[selectedWorkout.name] ?? null
  }, [exercises, selectedWorkout])

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRemaining(duration)
  }

  const startTimer = () => {
    if (intervalRef.current) {
      return
    }

    intervalRef.current = setInterval(() => {
      setRemaining((previous) => {
        if (previous <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          return 0
        }

        return previous - 1
      })
    }, 1000)
  }

  const handleSelectWorkout = (workout) => {
    stopTimer()
    setSelectedWorkout(workout)
  }

  const handleCloseModal = () => {
    stopTimer()
    setSelectedWorkout(null)
  }

  const handlePresetDuration = (preset) => {
    stopTimer()
    setDuration(preset.seconds)
    setRemaining(preset.seconds)
  }

  const handleAddSet = () => {
    setSets((previous) => [...previous, createEmptySet()])
  }

  const handleRemoveSet = () => {
    setSets((previous) => (previous.length <= 1 ? previous : previous.slice(0, -1)))
  }

  const handleFieldChange = (index, field, value) => {
    setSets((previous) =>
      previous.map((set, setIndex) => (setIndex === index ? { ...set, [field]: value } : set))
    )
  }

  const handleSecondsInputChange = (index, unit, value) => {
    setSets((previous) =>
      previous.map((set, setIndex) => {
        if (setIndex !== index) {
          return set
        }

        const currentSeconds = Number(set.seconds || 0)
        const currentMinutesPart = Math.floor(currentSeconds / 60)
        const currentSecondsPart = currentSeconds % 60

        if (unit === 'minutes') {
          const minutesValue = Number(value) || 0
          return {
            ...set,
            seconds: String(minutesValue * 60 + currentSecondsPart),
            _min: value,
          }
        }

        const secondsValue = Number(value) || 0
        return {
          ...set,
          seconds: String(currentMinutesPart * 60 + secondsValue),
          _sec: value,
        }
      })
    )
  }

  const handleLogWorkout = async ({ closeAfterLog = false } = {}) => {
    if (!selectedWorkout) {
      return
    }

    await logExercise(
      selectedWorkout.name,
      selectedWorkout.muscle,
      serializeSets(sets, selectedWorkout.fieldType),
      personalBest
    )

    if (closeAfterLog) {
      handleCloseModal()
    }
  }

  useEffect(() => {
    if (!selectedWorkout) {
      return
    }

    setPersonalBest(String(selectedHistory?.personalBest ?? ''))
    setSets(normalizeSetsForFieldType(selectedHistory?.sets, selectedWorkout.fieldType))
  }, [selectedHistory, selectedWorkout])

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <AppShell title={title} subtitle={subtitle}>
      <SectionCard style={styles.heroCard}>
        <Text style={styles.heroLabel}>Exercise Library</Text>
        <Text style={styles.heroBody}>{emptyDescription}</Text>
      </SectionCard>

      <SectionCard style={styles.listCard}>
        <Text style={styles.sectionTitle}>Available exercises</Text>
        <View style={styles.exerciseStack}>
          {workouts.map((workout) => {
            const history = exercises?.[workout.name]
            const hasSets = Array.isArray(history?.sets) && history.sets.length > 0

            return (
              <Pressable
                key={workout.id}
                style={styles.exerciseCard}
                onPress={() => handleSelectWorkout(workout)}
              >
                <View style={styles.exerciseHeader}>
                  <View style={styles.exerciseCopy}>
                    <Text style={styles.exerciseTitle}>{workout.name}</Text>
                    <Text style={styles.exerciseMuscle}>{workout.muscle}</Text>
                  </View>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>PB {String(history?.personalBest ?? 0)}</Text>
                  </View>
                </View>

                <Text style={styles.exerciseHint}>
                  {hasSets
                    ? history.sets.slice(0, 2).map((set) => formatLoggedSet(set, workout.fieldType)).join(' • ')
                    : 'No sets logged yet'}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </SectionCard>

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selectedWorkout)}
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalKeyboardView}
            >
              <View style={styles.modalCard}>
                <ScrollView
                  contentContainerStyle={styles.modalContent}
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.modalTitle}>{selectedWorkout?.name}</Text>
                  <Text style={styles.modalSubtitle}>
                    {selectedWorkout?.muscle} session logging
                  </Text>

                  <View style={styles.modalTopRow}>
                    <Text style={styles.modalLabel}>Personal best</Text>
                    <TextInput
                      style={styles.personalBestInput}
                      onChangeText={setPersonalBest}
                      value={personalBest}
                      keyboardType="numeric"
                      placeholder="0"
                      placeholderTextColor="#998a85"
                    />
                  </View>

                  <View style={styles.setsHeader}>
                    <Text style={styles.setsTitle}>Sets</Text>
                    <View style={styles.inlineActions}>
                      <Pressable style={styles.smallButton} onPress={handleAddSet}>
                        <Text style={styles.smallButtonText}>Add Set</Text>
                      </Pressable>
                      <Pressable style={styles.smallButtonMuted} onPress={handleRemoveSet}>
                        <Text style={styles.smallButtonMutedText}>Remove Set</Text>
                      </Pressable>
                    </View>
                  </View>

                  <View style={styles.setsStack}>
                    {sets.map((set, index) => (
                      <View key={`${selectedWorkout?.id}-${index}`} style={styles.setCard}>
                        <Text style={styles.setCardTitle}>Set {index + 1}</Text>

                        {selectedWorkout?.fieldType === 'weightReps' ? (
                          <View style={styles.inputRow}>
                            <View style={styles.inputWrap}>
                              <Text style={styles.inputLabel}>Weight</Text>
                              <TextInput
                                style={styles.input}
                                value={set.weight}
                                keyboardType="numeric"
                                placeholder="lbs"
                                placeholderTextColor="#998a85"
                                onChangeText={(value) => handleFieldChange(index, 'weight', value)}
                              />
                            </View>
                            <View style={styles.inputWrap}>
                              <Text style={styles.inputLabel}>Reps</Text>
                              <TextInput
                                style={styles.input}
                                value={set.reps}
                                keyboardType="numeric"
                                placeholder="reps"
                                placeholderTextColor="#998a85"
                                onChangeText={(value) => handleFieldChange(index, 'reps', value)}
                              />
                            </View>
                          </View>
                        ) : null}

                        {selectedWorkout?.fieldType === 'reps' ? (
                          <View style={styles.singleInputWrap}>
                            <Text style={styles.inputLabel}>Reps</Text>
                            <TextInput
                              style={styles.input}
                              value={set.reps}
                              keyboardType="numeric"
                              placeholder="reps"
                              placeholderTextColor="#998a85"
                              onChangeText={(value) => handleFieldChange(index, 'reps', value)}
                            />
                          </View>
                        ) : null}

                        {selectedWorkout?.fieldType === 'seconds' ? (
                          <View style={styles.inputRow}>
                            <View style={styles.inputWrap}>
                              <Text style={styles.inputLabel}>Minutes</Text>
                              <TextInput
                                style={styles.input}
                                value={
                                  set._min ??
                                  (set.seconds !== '' ? String(Math.floor(Number(set.seconds) / 60)) : '')
                                }
                                keyboardType="numeric"
                                placeholder="min"
                                placeholderTextColor="#998a85"
                                onChangeText={(value) => handleSecondsInputChange(index, 'minutes', value)}
                              />
                            </View>
                            <View style={styles.inputWrap}>
                              <Text style={styles.inputLabel}>Seconds</Text>
                              <TextInput
                                style={styles.input}
                                value={
                                  set._sec ??
                                  (set.seconds !== '' ? String(Number(set.seconds) % 60) : '')
                                }
                                keyboardType="numeric"
                                placeholder="sec"
                                placeholderTextColor="#998a85"
                                onChangeText={(value) => handleSecondsInputChange(index, 'seconds', value)}
                              />
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>

                  <SectionCard style={styles.timerCard}>
                    <Text style={styles.timerLabel}>Rest timer</Text>
                    <Text style={styles.timerValue}>{formatTimerValue(remaining)}</Text>
                    <Slider
                      style={styles.slider}
                      value={remaining}
                      minimumValue={0}
                      maximumValue={duration}
                      minimumTrackTintColor={appTheme.colors.accent}
                      maximumTrackTintColor="#d5beb6"
                      thumbTintColor="transparent"
                      disabled
                    />
                    <Slider
                      style={styles.slider}
                      step={5}
                      value={duration}
                      minimumValue={0}
                      maximumValue={300}
                      minimumTrackTintColor={appTheme.colors.primary}
                      maximumTrackTintColor="#e4d1ca"
                      thumbTintColor={appTheme.colors.primary}
                      disabled={intervalRef.current !== null}
                      onValueChange={(value) => {
                        setDuration(value)
                        setRemaining(value)
                      }}
                    />

                    <View style={styles.presetRow}>
                      {presets.map((preset) => (
                        <Pressable
                          key={preset.label}
                          style={styles.presetButton}
                          onPress={() => handlePresetDuration(preset)}
                        >
                          <Text style={styles.presetButtonText}>{preset.label}</Text>
                        </Pressable>
                      ))}
                    </View>

                    <View style={styles.modalButtonRow}>
                      <Pressable style={styles.secondaryButton} onPress={startTimer}>
                        <Text style={styles.secondaryButtonText}>Start Timer</Text>
                      </Pressable>
                      <Pressable style={styles.secondaryButton} onPress={stopTimer}>
                        <Text style={styles.secondaryButtonText}>Reset Timer</Text>
                      </Pressable>
                    </View>
                  </SectionCard>

                  <View style={styles.modalButtonRow}>
                    <Pressable style={styles.secondaryButton} onPress={handleCloseModal}>
                      <Text style={styles.secondaryButtonText}>Close</Text>
                    </Pressable>
                    <Pressable style={styles.primaryButton} onPress={() => handleLogWorkout()}>
                      <Text style={styles.primaryButtonText}>Save</Text>
                    </Pressable>
                  </View>

                  <Pressable
                    style={styles.fullPrimaryButton}
                    onPress={() => handleLogWorkout({ closeAfterLog: true })}
                  >
                    <Text style={styles.fullPrimaryButtonText}>Save and Exit</Text>
                  </Pressable>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AppShell>
  )
}

export default WorkoutLoggerScreen

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
  },
  listCard: {
    backgroundColor: appTheme.colors.cardSoft,
    borderColor: appTheme.colors.borderSoft,
  },
  sectionTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  exerciseStack: {
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  exerciseCopy: {
    flex: 1,
  },
  exerciseTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  exerciseMuscle: {
    color: '#7b625d',
    fontSize: 14,
    fontWeight: '600',
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1e2dc',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: {
    color: appTheme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  exerciseHint: {
    color: '#775a56',
    fontSize: 14,
    lineHeight: 20,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(19, 10, 12, 0.56)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalKeyboardView: {
    maxHeight: '94%',
  },
  modalCard: {
    backgroundColor: '#fff5ef',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    paddingBottom: 36,
  },
  modalTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#7b625d',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  modalTopRow: {
    marginBottom: 16,
  },
  modalLabel: {
    color: appTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  personalBestInput: {
    backgroundColor: '#fff8f5',
    borderColor: '#ceb1a8',
    borderRadius: 16,
    borderWidth: 1,
    color: appTheme.colors.primaryDeep,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  setsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  setsTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 20,
    fontWeight: '800',
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    backgroundColor: appTheme.colors.primary,
    borderRadius: 14,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  smallButtonText: {
    color: '#f7e7e2',
    fontSize: 13,
    fontWeight: '700',
  },
  smallButtonMuted: {
    backgroundColor: '#ead8d2',
    borderRadius: 14,
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  smallButtonMutedText: {
    color: '#6a4a4f',
    fontSize: 13,
    fontWeight: '700',
  },
  setsStack: {
    gap: 10,
    marginBottom: 18,
  },
  setCard: {
    backgroundColor: '#fff8f5',
    borderColor: '#ead8d2',
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
  },
  setCardTitle: {
    color: appTheme.colors.primaryDeep,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputWrap: {
    flex: 1,
  },
  singleInputWrap: {
    width: '100%',
  },
  inputLabel: {
    color: '#6f514b',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fffdfb',
    borderColor: '#ceb1a8',
    borderRadius: 16,
    borderWidth: 1,
    color: appTheme.colors.primaryDeep,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlign: 'center',
  },
  timerCard: {
    backgroundColor: '#f8eae4',
    borderColor: '#d9bbb2',
    marginBottom: 18,
  },
  timerLabel: {
    color: appTheme.colors.primary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  timerValue: {
    color: appTheme.colors.primaryDeep,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  slider: {
    height: 36,
    width: '100%',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  presetButton: {
    backgroundColor: '#fff8f5',
    borderColor: '#d9bbb2',
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  presetButtonText: {
    color: '#6a4a4f',
    fontSize: 13,
    fontWeight: '700',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#ead8d2',
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  secondaryButtonText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: appTheme.colors.primary,
    borderRadius: 18,
    flex: 1,
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    color: '#f7e7e2',
    fontSize: 15,
    fontWeight: '700',
  },
  fullPrimaryButton: {
    alignItems: 'center',
    backgroundColor: appTheme.colors.primaryDeep,
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 52,
  },
  fullPrimaryButtonText: {
    color: '#fff7f2',
    fontSize: 15,
    fontWeight: '800',
  },
})
