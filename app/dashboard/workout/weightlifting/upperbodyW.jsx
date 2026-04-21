import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Slider from '@react-native-community/slider'
import AppShell from '../../../../components/AppShell'
import { useWorkouts } from '../../../../hooks/useWorkouts'

const WORKOUTS = [
  { id: '1', name: 'Bench', sets: '4x8', muscle: 'Chest' },
  { id: '2', name: 'Incline Bench', sets: '3x10', muscle: 'Upper Chest' },
  { id: '3', name: 'Bicep Curls', sets: '3x12', muscle: 'Biceps' },
  { id: '4', name: 'Dips', sets: '3x15', muscle: 'Lower Chest' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

const createBlankSets = () => [
  { weight: '', reps: '' },
  { weight: '', reps: '' },
  { weight: '', reps: '' },
]

const UpperbodyW = () => {
  const intervalRef = useRef(null)
  const [duration, setDuration] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [selected, setSelected] = useState(null)
  const [sets, setSets] = useState(createBlankSets)
  const [personalBest, setPersonalBest] = useState('')

  const { logExercise, exercises, logWorkoutActivity } = useWorkouts()

  const minutes = Math.floor(remaining / 60)
  const seconds = Math.floor(remaining % 60)

  const stopTimer = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = null
    setRemaining(duration)
  }

  const startTimer = () => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          return 0
        }

        return prev - 1
      })
    }, 1000)
  }

  const addSet = () => {
    setSets((currentSets) => [...currentSets, { weight: '', reps: '' }])
  }

  const handleSelect = (item) => {
    setSelected(item)
    setSets(createBlankSets())
    setPersonalBest('')
    setDuration(60)
    setRemaining(60)

    logWorkoutActivity('weights', 'Upper body', item.name).catch((error) => {
      console.log('Unable to log workout activity:', error)
    })
  }

  const handleDuration = (item) => {
    stopTimer()
    setDuration(item.seconds)
    setRemaining(item.seconds)
  }

  const handleExit = async (selectedWorkout) => {
    stopTimer()
    setSelected(null)
    await logExercise(selectedWorkout.name, selectedWorkout.muscle, sets, personalBest)
  }

  const handleLog = async (selectedWorkout) => {
    await logExercise(selectedWorkout.name, selectedWorkout.muscle, sets, personalBest)
  }

  useEffect(() => {
    if (!selected) return

    setPersonalBest(String(exercises[selected.name]?.personalBest ?? ''))
    setSets(
      exercises[selected.name]?.sets?.map((set) => ({
        weight: String(set.weight ?? ''),
        reps: String(set.reps ?? ''),
      })) ?? createBlankSets()
    )
  }, [selected, exercises])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  return (
    <>
      <AppShell
        title="Upper Body Weights"
        subtitle="Track working sets, preserve your personal best, and keep a built-in rest timer between sets."
        scroll={false}
        contentContainerStyle={styles.screenLayout}
      >
        <FlatList
          data={WORKOUTS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => handleSelect(item)}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>{item.sets} • {item.muscle}</Text>
              <View style={styles.metricRow}>
                <Text style={styles.metricLabel}>Personal best</Text>
                <Text style={styles.metricValue}>
                  {String(exercises?.[item?.name]?.personalBest ?? 'Not set')}
                </Text>
              </View>
              <View style={styles.loggedSets}>
                {exercises?.[item.name]?.sets?.length ? (
                  exercises[item.name].sets.map((set, index) => (
                    <Text key={`${item.id}-${index}`} style={styles.loggedSetText}>
                      Set {index + 1}: {set.weight} lbs x {set.reps} reps
                    </Text>
                  ))
                ) : (
                  <Text style={styles.emptySetText}>No logged sets yet for this exercise.</Text>
                )}
              </View>
            </Pressable>
          )}
        />
      </AppShell>

      {selected ? (
        <Modal animationType="slide" visible transparent onRequestClose={() => setSelected(null)}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalBackdrop}>
              <View style={styles.modalCard}>
                <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
                  <Text style={styles.modalTitle}>{selected.name}</Text>
                  <Text style={styles.modalSubtitle}>
                    Log your working sets, adjust your timer, and save the session when you finish.
                  </Text>

                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Set</Text>
                    <Text style={styles.tableHeaderText}>Weight</Text>
                    <Text style={styles.tableHeaderText}>Reps</Text>
                  </View>

                  {sets.map((set, index) => (
                    <View key={`set-${index}`} style={styles.setRow}>
                      <Text style={styles.setIndex}>{index + 1}</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setSets((currentSets) =>
                            currentSets.map((currentSet, currentIndex) =>
                              currentIndex === index ? { ...currentSet, weight: value } : currentSet
                            )
                          )
                        }
                        value={set.weight}
                        keyboardType="numeric"
                        placeholder="lbs"
                        placeholderTextColor="#998a85"
                      />
                      <TextInput
                        style={styles.input}
                        onChangeText={(value) =>
                          setSets((currentSets) =>
                            currentSets.map((currentSet, currentIndex) =>
                              currentIndex === index ? { ...currentSet, reps: value } : currentSet
                            )
                          )
                        }
                        value={set.reps}
                        keyboardType="numeric"
                        placeholder="reps"
                        placeholderTextColor="#998a85"
                      />
                    </View>
                  ))}

                  <Pressable onPress={addSet} style={styles.addSetButton}>
                    <Text style={styles.addSetButtonText}>Add Set</Text>
                  </Pressable>

                  <View style={styles.timerCard}>
                    <Text style={styles.timerLabel}>Rest timer</Text>
                    <Text style={styles.timerValue}>
                      {minutes}:{seconds.toString().padStart(2, '0')}
                    </Text>

                    <Slider
                      style={styles.slider}
                      value={remaining}
                      minimumValue={0}
                      maximumValue={duration}
                      minimumTrackTintColor="#723a45"
                      maximumTrackTintColor="#d6b8b0"
                      thumbTintColor="transparent"
                      disabled
                    />

                    <Slider
                      step={5}
                      style={styles.slider}
                      value={duration}
                      minimumValue={0}
                      maximumValue={300}
                      minimumTrackTintColor="#723a45"
                      maximumTrackTintColor="#d6b8b0"
                      thumbTintColor="#723a45"
                      disabled={intervalRef.current !== null}
                      onValueChange={(value) => {
                        setDuration(value)
                        setRemaining(value)
                      }}
                    />

                    <View style={styles.presetRow}>
                      {PRESETS.map((item) => (
                        <Pressable key={item.label} onPress={() => handleDuration(item)} style={styles.presetButton}>
                          <Text style={styles.presetButtonText}>{item.label}</Text>
                        </Pressable>
                      ))}
                    </View>

                    <View style={styles.timerButtonRow}>
                      <Pressable onPress={startTimer} style={styles.primaryAction}>
                        <Text style={styles.primaryActionText}>Start Timer</Text>
                      </Pressable>
                      <Pressable onPress={stopTimer} style={styles.secondaryAction}>
                        <Text style={styles.secondaryActionText}>Reset Timer</Text>
                      </Pressable>
                    </View>
                  </View>

                  <Text style={styles.personalBestLabel}>Personal best</Text>
                  <TextInput
                    style={styles.personalBestInput}
                    onChangeText={setPersonalBest}
                    value={personalBest}
                    keyboardType="numeric"
                    placeholder="Optional personal best"
                    placeholderTextColor="#998a85"
                  />

                  <View style={styles.footerButtons}>
                    <Pressable onPress={() => handleLog(selected)} style={styles.secondaryActionWide}>
                      <Text style={styles.secondaryActionText}>Save Progress</Text>
                    </Pressable>
                    <Pressable onPress={() => handleExit(selected)} style={styles.primaryActionWide}>
                      <Text style={styles.primaryActionText}>Log And Exit</Text>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      ) : null}
    </>
  )
}

export default UpperbodyW

const styles = StyleSheet.create({
  screenLayout: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(247, 234, 228, 0.95)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ceb1a8',
    padding: 18,
    marginBottom: 14,
  },
  cardTitle: {
    color: '#5d343a',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#7b625d',
    fontSize: 14,
    marginBottom: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricLabel: {
    color: '#7b625d',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: {
    color: '#723a45',
    fontSize: 13,
    fontWeight: '800',
  },
  loggedSets: {
    gap: 6,
  },
  loggedSetText: {
    color: '#4f2c31',
    fontSize: 14,
    lineHeight: 20,
  },
  emptySetText: {
    color: '#8f6b64',
    fontSize: 14,
    fontStyle: 'italic',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.56)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    maxHeight: '90%',
    backgroundColor: '#fff5ef',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalContent: {
    padding: 20,
    paddingBottom: 34,
  },
  modalTitle: {
    color: '#5d343a',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: '#7b625d',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  tableHeaderText: {
    color: '#6f514c',
    fontSize: 13,
    fontWeight: '800',
    width: '30%',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  setIndex: {
    width: '10%',
    color: '#5d343a',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    width: '40%',
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ceb1a8',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: '#432328',
    textAlign: 'center',
  },
  addSetButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ead8d2',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 18,
  },
  addSetButtonText: {
    color: '#6a4a4f',
    fontSize: 14,
    fontWeight: '700',
  },
  timerCard: {
    backgroundColor: '#f7e6df',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e2c4bc',
    padding: 16,
    marginBottom: 18,
  },
  timerLabel: {
    color: '#7b5448',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  timerValue: {
    color: '#5d343a',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  slider: {
    width: '100%',
    height: 38,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  presetButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#d5b8af',
  },
  presetButtonText: {
    color: '#6a4a4f',
    fontWeight: '700',
  },
  timerButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#723a45',
  },
  primaryActionText: {
    color: '#f7e7e2',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryAction: {
    flex: 1,
    minHeight: 48,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ead8d2',
  },
  secondaryActionText: {
    color: '#6a4a4f',
    fontSize: 15,
    fontWeight: '700',
  },
  personalBestLabel: {
    color: '#5d343a',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  personalBestInput: {
    backgroundColor: '#fff8f5',
    borderWidth: 1,
    borderColor: '#ceb1a8',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: '#432328',
    marginBottom: 18,
  },
  footerButtons: {
    gap: 12,
  },
  secondaryActionWide: {
    minHeight: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ead8d2',
  },
  primaryActionWide: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#723a45',
  },
})

