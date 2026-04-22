import { StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider';
import { useWorkouts } from '../../../../hooks/useWorkouts';

const WORKOUTS = [
  {id: '1', name: 'Lunges', muscle: 'Thigh', field: 'reps'},
  {id: '2', name: 'Calfraises', muscle: 'Calfs', field: 'reps'},
  {id: '3', name: 'Wall sit', muscle: 'Thigh', field: 'seconds'},
]

const PRESETS = [
  {label: '30s', seconds: 30 },
  {label: '1m', seconds: 60},
  {label: '2m 30s', seconds: 150}
]

const LowerbodyC = () => {
const intervalRef = useRef(null)
const [duration, setDuration] = useState(60)
const [remaining, setRemaining] = useState(60)
const [selected, setSelected] = useState(null)

const createEmptySet = () => ({
  reps: '',
  seconds: ''
});

const [sets, setSets] = useState([
  createEmptySet(),
  createEmptySet(),
  createEmptySet(),
])

const [personalBest, setPersonalBest] = useState('')

const { logExercise, exercises } = useWorkouts()

const minutes = Math.floor(remaining / 60)
const seconds = Math.floor(remaining % 60)

const startTimer = () => {
  if (intervalRef.current) return
  intervalRef.current = setInterval(() => {
    setRemaining(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        return 0
      }
      return prev - 1
    })
  }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalRef.current)
  intervalRef.current = null
  setRemaining(duration)
}

const addSet = () => {
  setSets(prev => [...prev, createEmptySet()]);
}

const deleteSet = () => {
  setSets(prev => prev.length <= 1 ? prev : prev.slice(0, -1))
}

const handleSelect = (item) => {
  setSelected(item)
}

const handleDuration = (item) => {
  stopTimer()
  setDuration(item.seconds)
  setRemaining(item.seconds)
}

const handleExit = () => {
  clearInterval(intervalRef.current)
  setRemaining(duration)
  setSelected(null)
}

const handleLogAndExit = () => {
const safeSets = sets.map(set => ({
  reps: set.reps === '' ? 0 : Number(set.reps),
  seconds: set.seconds === '' ? 0 : Number(set.seconds)
}));
  clearInterval(intervalRef.current)
  setRemaining(duration)
  setSelected(null)
  console.log(JSON.stringify(safeSets, null, 2))
    console.log(personalBest)
  logExercise(selected.name, selected.muscle, safeSets, personalBest)
}

const handleLog = () => {
const safeSets = sets.map(set => ({
  reps: Number.isFinite(Number(set.reps)) ? Number(set.reps) : 0,
  seconds: Number.isFinite(Number(set.seconds)) ? Number(set.seconds) : 0
}));
  logExercise(selected.name, selected.muscle, safeSets, personalBest)
}

/* 🔥 FIX: proper prefill (reps + seconds preserved) */
useEffect(() => {
  if (!selected) return;

  const existing = exercises[selected.name]?.sets;

  setPersonalBest(String(exercises[selected.name]?.personalBest ?? ""));

  if (existing?.length) {
    setSets(
    existing.map(s => ({
        reps: s.reps ?? '',
        seconds: s.seconds ?? '',
        _min: undefined,
        _sec: undefined
    }))
    );
  } else {
    setSets([
      createEmptySet(),
      createEmptySet(),
      createEmptySet(),
    ]);
  }
}, [selected, exercises]);

return (
<SafeAreaView style={styles.container}>
  <FlatList
    data={WORKOUTS}
    keyExtractor={(item) => item.id}
    renderItem={({item}) => (
      <View style={styles.card}>
        <Pressable onPress={() => handleSelect(item)}>
          <Text>{item.name}</Text>
        </Pressable>

        <View style={styles.rowStyle}>
          <Text>PB: {String(exercises?.[item?.name]?.personalBest ?? "")}</Text>
        </View>

        <View>
          {exercises?.[item.name]?.sets?.map((set, index) => (
            <Text key={index}>
              Set {index + 1}: {set[item.field]} {item.field === 'seconds' ? 'sec' : 'reps'}
            </Text>
          ))}
        </View>
      </View>
    )}
  />

{selected && (
<Modal animationType="slide" visible={true} onRequestClose={() => setSelected(null)}>
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<View style={styles.container}>

<View style={styles.rowStyle}>
  <Text>Set</Text>

  {selected?.field === 'seconds' ? (
    <>
      <Text>Min</Text>
      <Text>Sec</Text>
    </>
  ) : (
    <Text>Reps</Text>
  )}
</View>

{sets.map((set, index) => (
  <View key={index} style={styles.rowStyle}>
    <Text>{index + 1}</Text>

    {selected?.field === 'seconds' ? (
      <>
        {/* MINUTES */}
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="min"
        value={
            set._min ??
            (set.seconds !== '' ? String(Math.floor(set.seconds / 60)) : '')
        }
        onChangeText={(minVal) => {
            setSets(prev =>
            prev.map((s, i) => {
                if (i !== index) return s;

                const mins = Number(minVal) || 0;
                const secs = Number(s.seconds || 0) % 60;

                return {
                ...s,
                seconds: mins * 60 + secs,
                _min: minVal // 👈 UI only
                };
            })
            );
        }}
        />

        {/* SECONDS */}
        <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="sec"
        value={
            set._sec ??
            (set.seconds !== '' ? String(set.seconds % 60) : '')
        }
        onChangeText={(secVal) => {
            setSets(prev =>
            prev.map((s, i) => {
                if (i !== index) return s;

                const secs = Number(secVal) || 0;
                const mins = Math.floor(Number(s.seconds || 0) / 60);

                return {
                ...s,
                seconds: mins * 60 + secs,
                _sec: secVal // 👈 UI only
                };
            })
            );
        }}
        />
      </>
    ) : (
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={set.reps}
        onChangeText={(val) =>
          setSets(prev =>
            prev.map((s, i) =>
              i === index ? { ...s, reps: val } : s
            )
          )
        }
      />
    )}
  </View>
))}

<View style={styles.rowStyle}>
  <Pressable onPress={addSet}><Text>Add Set +</Text></Pressable>
  <Pressable onPress={deleteSet}><Text>Remove Set -</Text></Pressable>
</View>

<Pressable onPress={startTimer} style={styles.button}>
  <Text>Start Timer: {minutes}:{seconds.toString().padStart(2,'0')}</Text>
</Pressable>

<Pressable onPress={stopTimer} style={styles.button}>
  <Text>Stop Timer</Text>
</Pressable>

<Pressable onPress={handleExit} style={styles.button}>
  <Text>Exit</Text>
</Pressable>

<TextInput
  style={styles.input}
  onChangeText={setPersonalBest}
  value={personalBest}
  keyboardType="numeric"
/>

<Pressable onPress={handleLog} style={styles.button}>
  <Text>Logging</Text>
</Pressable>

<Pressable onPress={handleLogAndExit} style={styles.button}>
  <Text>Log and Exit</Text>
</Pressable>

</View>
</TouchableWithoutFeedback>
</Modal>
)}
</SafeAreaView>
)
}

export default LowerbodyC

const styles = StyleSheet.create({
  button: {
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    height: 40,
    width: 80,
    borderColor: '#2a2a2a',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f1f1',
    paddingTop: 60,
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    width: 80,
    textAlign: 'center',
  }
})