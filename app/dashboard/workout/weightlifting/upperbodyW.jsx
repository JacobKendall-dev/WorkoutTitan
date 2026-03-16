import {
  StyleSheet, Text, View, FlatList,
  Pressable, Modal, Animated
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import Slider from '@react-native-community/slider'

const WORKOUTS = [
  { id: '1', name: 'Bench Press', sets: '4 x 8', muscle: 'Chest' },
  { id: '2', name: 'Overhead Press', sets: '3 x 10', muscle: 'Shoulders' },
  { id: '3', name: 'Incline Dumbbell Press', sets: '3 x 12', muscle: 'Upper Chest' },
  { id: '4', name: 'Triceps', sets: '3 x 15', muscle: 'Triceps' },
]

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
]

// --- Timer Component ---
const Timer = () => {
  const [sliderValue, setSliderValue] = useState(60)
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(60)
  const intervalRef = useRef(null)
  const progressAnim = useRef(new Animated.Value(1)).current

  const applyValue = (val) => {
    setSliderValue(val)
    setRemaining(val)
    progressAnim.setValue(1)
  }

  const handleGo = () => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
      progressAnim.stopAnimation()
      progressAnim.setValue(1)
      setRemaining(sliderValue)
      return
    }

    setRunning(true)
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: sliderValue * 1000,
      useNativeDriver: false,
    }).start()

    let count = sliderValue
    intervalRef.current = setInterval(() => {
      count -= 1
      setRemaining(count)
      if (count <= 0) {
        clearInterval(intervalRef.current)
        setRunning(false)
        progressAnim.setValue(1)
        setRemaining(sliderValue)
      }
    }, 1000)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`
  }

  return (
    <View style={timerStyles.wrapper}>

      {/* Label + countdown */}
      <View style={timerStyles.labelRow}>
        <Text style={timerStyles.label}>TIMER</Text>
        <Text style={timerStyles.countdown}>
          {running ? formatTime(remaining) : formatTime(sliderValue)}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={timerStyles.barTrack}>
        <Animated.View style={[timerStyles.barFill, { width: barWidth }]} />
      </View>

      {/* Presets */}
      <View style={timerStyles.presets}>
        {PRESETS.map((p) => (
          <Pressable
            key={p.label}
            onPress={() => !running && applyValue(p.seconds)}
            style={[
              timerStyles.preset,
              sliderValue === p.seconds && timerStyles.presetActive,
              running && timerStyles.presetDisabled,
            ]}
          >
            <Text style={[
              timerStyles.presetText,
              sliderValue === p.seconds && timerStyles.presetTextActive,
            ]}>
              {p.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Slider */}
      <Slider
        style={timerStyles.slider}
        value={sliderValue}
        minimumValue={5}
        maximumValue={300}
        step={5}
        minimumTrackTintColor="#e05c2e"
        maximumTrackTintColor="#2a2a2a"
        thumbTintColor="#e05c2e"
        onValueChange={!running ? applyValue : undefined}
        disabled={running}
      />

      {/* GO / STOP */}
      <Pressable
        style={[timerStyles.goBtn, running && timerStyles.goBtnStop]}
        onPress={handleGo}
      >
        <Text style={timerStyles.goText}>{running ? 'STOP' : 'GO'}</Text>
      </Pressable>

    </View>
  )
}

// --- Main Component ---
const UpperbodyW = () => {
  const [selected, setSelected] = useState(null)

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Upperbody Weights</Text>
      <Text style={styles.subtitle}>TAP A WORKOUT TO START</Text>

      <FlatList
        data={WORKOUTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable onPress={() => setSelected(item)}>
            {({ pressed }) => (
              <View style={[styles.card, pressed && styles.cardPressed]}>
                <View style={styles.cardLeft}>
                  <Text style={styles.cardNumber}>{item.id.padStart(2, '0')}</Text>
                </View>
                <View style={styles.cardCenter}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardMeta}>{item.muscle} · {item.sets}</Text>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.cardArrow}>›</Text>
                </View>
              </View>
            )}
          </Pressable>
        )}
      />

      {selected && (
        <Modal animationType="slide" visible={true} onRequestClose={() => setSelected(null)}>
          <View style={modalStyles.container}>

            <View style={modalStyles.header}>
              <View>
                <Text style={modalStyles.headerEyebrow}>WORKOUT</Text>
                <Text style={modalStyles.headerTitle}>{selected.name}</Text>
                <Text style={modalStyles.headerMeta}>{selected.muscle} · {selected.sets}</Text>
              </View>
              <Pressable onPress={() => setSelected(null)} style={modalStyles.closeBtn}>
                <Text style={modalStyles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Timer />

          </View>
        </Modal>
      )}

    </View>
  )
}

export default UpperbodyW

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 6,
    marginBottom: 30,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cardPressed: {
    backgroundColor: '#222',
    borderColor: '#e05c2e',
  },
  cardLeft: {
    backgroundColor: '#e05c2e',
    width: 50,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardNumber: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
  cardCenter: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  cardName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  cardMeta: {
    color: '#666',
    fontSize: 12,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardRight: {
    paddingRight: 16,
  },
  cardArrow: {
    color: '#e05c2e',
    fontSize: 28,
    fontWeight: '300',
  },
})

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
  },
  headerEyebrow: {
    color: '#e05c2e',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerMeta: {
    color: '#555',
    fontSize: 13,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeBtn: {
    backgroundColor: '#1e1e1e',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
})

const timerStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  countdown: {
    color: '#e05c2e',
    fontSize: 22,
    fontWeight: '800',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  barFill: {
    height: 6,
    backgroundColor: '#e05c2e',
    borderRadius: 3,
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  preset: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
  },
  presetActive: {
    backgroundColor: '#2a1a14',
    borderColor: '#e05c2e',
  },
  presetDisabled: {
    opacity: 0.4,
  },
  presetText: {
    color: '#666',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1,
  },
  presetTextActive: {
    color: '#e05c2e',
  },
  slider: {
    width: '100%',
    height: 36,
  },
  goBtn: {
    marginTop: 12,
    backgroundColor: '#e05c2e',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  goBtnStop: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#e05c2e',
  },
  goText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 3,
  },
})