import { StyleSheet, Text, View, FlatList, Modal, Pressable, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Slider from '@react-native-community/slider';
import { useWorkouts } from '../../../../hooks/useWorkouts';

const WORKOUTS = [
  {id: '1', name: 'Bench', muscle: 'Chest'},
  {id: '2', name: 'Incline Bench', muscle: 'Upper Chest'},
  {id: '3', name: 'Bicep Curls', muscle: 'Biceps'},
  {id: '4', name: 'Shoulder Press', muscle: 'Shoulders'},
  {id: '5', name: 'Lateral Raises', muscle: 'Lats'},
  {id: '6', name: 'Cable Rows', muscle: 'Lats'},
  {id: '7', name: 'Lap Pull-Downs', muscle: 'Lats'}
]

const PRESETS = [
  {label: '30s', seconds: 30 },
  {label: '1m', seconds: 60},
  {label: '2m', seconds: 120}
]

const UpperbodyW = () => {
const intervalRef = useRef(null)
const [duration, setDuration] = useState(60)
const [remaining, setRemaining] = useState(60)
const [selected, setSelected] = useState(null)
const [sets, setSets] = useState([
  { weight: '', reps: '' },
  { weight: '', reps: '' },
  { weight: '', reps: '' },
])
const [personalBest, setPersonalBest] = useState('')

const { logExercise, exercises, addOwnedItem } = useWorkouts()

const minutes = Math.floor(remaining / 60)
const seconds = Math.floor(remaining % 60)

const startTimer = () => {
  if (intervalRef.current) return
  intervalRef.current = setInterval(() => {
    setRemaining( prev => {
      if (prev <= 1){
      clearInterval(intervalRef.current)
      intervalRef.current = null
      return 0
    }else {
      return prev - 1
    }
  })
  }, 1000)
}

const stopTimer = () => {
  clearInterval(intervalRef.current)
  intervalRef.current = null
  setRemaining(duration)
}

const addSet = () => {
  setSets([...sets, {weight: '', reps: ''}])
}

const handleSelect = (item) => {
  setSelected(item)
  setSets([
    { weight: '', reps: '' },
    { weight: '', reps: '' },
    { weight: '', reps: '' },
  ])
}

const handleDuration = (item) => {
  stopTimer()
  setDuration(item.seconds)
  setRemaining(item.seconds)
}

const handleExit = (theSelected) =>{
  clearInterval(intervalRef.current)
  setRemaining(duration)
  setSelected(null)
}

const handleLogAndExit = (theSelected) =>{
  clearInterval(intervalRef.current)
  setRemaining(duration)
  setSelected(null)
  logExercise(theSelected.name, theSelected.muscle, sets, personalBest)
}

const handleLog = (theSelected) => {
  logExercise(theSelected.name, theSelected.muscle, sets, personalBest)
}

  useEffect(() => {
    if (selected) {
      setPersonalBest(String(exercises[selected.name]?.personalBest ?? ""));
      setSets(
        exercises[selected.name]?.sets?.map(s => ({
          weight: s.weight ?? "",
          reps: s.reps ?? ""
        })) ?? []
      )
    }
  }, [selected]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data = {WORKOUTS}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
          <Pressable onPress={() => handleSelect(item)} >
              <Text>{item.name}</Text>
          </Pressable>
            <View style={styles.rowStyle}>
                <Text>PB: {String(exercises?.[item?.name]?.personalBest ?? "")}</Text>
            </View>
              <View>
                {exercises?.[item.name]?.sets?.map((set, index) => (
                  <Text key={index}>
                    Set {index + 1}: {set.weight} lbs x {set.reps} reps
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
        {/* header row */}
      <View style={styles.rowStyle}>
        <Text>Sets</Text>
        <Text>Weight</Text>
        <Text>Reps</Text>
      </View>

      {sets.map((set, index) => (
      <View key={index} style={styles.rowStyle}>
        <Text>{index + 1}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(val) => setSets(sets.map((s, i) => i === index ? {...s, weight: val} : s))}
          value={set.weight}
          keyboardType="numeric"
          placeholder="lbs"
          />
        <TextInput
        style={styles.input}
        onChangeText={(val) => setSets(sets.map((s, i) => i === index ? {...s, reps: val} : s))}
        value={set.reps}
        keyboardType="numeric"
        placeholder="reps"
        />
      </View>
      ))}
      <View style={styles.rowStyle}>
        <Pressable onPress={addSet}>
        <Text>Add Set + </Text>
        </Pressable>
      </View>

      <Slider 
          style={{width: '80%', height: 40, marginVertical: 20}}
          value={remaining}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#21cc8d"
          maximumTrackTintColor="#0d0d0d"
          thumbTintColor="transparent"
          disabled={true}
        />

        <Slider
          step={5}
          style={{width: '80%', height: 40, marginVertical: 20}}
          value={duration}
          minimumValue={0}
          maximumValue={300}
          minimumTrackTintColor="#21cc8d"
          maximumTrackTintColor="#ddd"
          thumbTintColor="#21cc8d"
          disabled={intervalRef.current !== null}
          onValueChange={(val) => {
            setDuration(val)
            setRemaining(val)
          }}
        />
      
      <View style={styles.rowStyle}>
        {PRESETS.map((item) => ( 
          <Pressable key={item.label} onPress={() => handleDuration(item)} style={styles.button}>
            <Text>{item.label}</Text>
          </Pressable>
        ))}
      
      </View>
      <Pressable onPress={startTimer} style={styles.button}>
        <Text>Start Timer: {minutes}:{seconds.toString().padStart(2, '0')}</Text>
      </Pressable>
      <Pressable onPress={stopTimer} style={styles.button}>
        <Text>Stop Timer</Text>
      </Pressable>
      
        <Pressable onPress={() => handleExit(selected)}  style={styles.button}>
          <Text>
            Exit
          </Text>
        </Pressable>

        <TextInput
        style={styles.input}
        onChangeText={setPersonalBest}
        value={personalBest}
        keyboardType="numeric"
        />

        <Pressable onPress={() => handleLog(selected)}  style={styles.button}>
          <Text>
            Logging
          </Text>
        </Pressable>

        <Pressable onPress={() => handleLogAndExit(selected)}  style={styles.button}>
          <Text>
            Log and Exit
          </Text>
        </Pressable>

        </View>
      
      </TouchableWithoutFeedback>
    </Modal>
    )}
  </SafeAreaView>
  )
}

export default UpperbodyW

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