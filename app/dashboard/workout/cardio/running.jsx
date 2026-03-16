import { StyleSheet, Text, View, Button, ScrollView } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { getDistance } from '../../../../components/GetDistance';


const Running = () => {
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [averageSpeed, setAverageSpeed] = useState(null);
  const [runCompleted, setRunCompleted] = useState(false);
  const [finalTime, setFinalTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Live timer for UI
  const [isTimedRun, setIsTimedRun] = useState(false);

  //using useRef instead of useState so it doesn't re-render.
  const previousLocation = useRef(null);
  const startTime = useRef(null);
  const monitorRef = useRef(null);
  const totalDistanceRef = useRef(0);
  const timerIdRef = useRef(null);
  
const startRun = async ({distanceGoal = 0, timeGoal = null} = {}) => {
  if (monitorRef.current) {
    monitorRef.current.remove();
    monitorRef.current = null;
  }
  clearInterval(timerIdRef.current);

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission denied");
    return;
  }

  setIsTimedRun(Boolean(timeGoal));
  setRunCompleted(false);
  setAverageSpeed(null);
  setCurrentSpeed(0);
  setDistanceCovered(0);
  setFinalTime(null);
  setElapsedTime(0);
  totalDistanceRef.current = 0;

  // Warm up GPS immediately with low accuracy (fast),
  // then watchPositionAsync will upgrade to high accuracy
  const warmup = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced // fast, not perfect
  });
  previousLocation.current = {
    latitude: warmup.coords.latitude,
    longitude: warmup.coords.longitude
  };
  startTime.current = Date.now();

  const endRun = () => {
    monitorRef.current?.remove();
    monitorRef.current = null;
    clearInterval(timerIdRef.current);
    const endTimeVal = (Date.now() - startTime.current) / 1000;
    const avgSpeed = totalDistanceRef.current / endTimeVal;
    setFinalTime(endTimeVal);
    setAverageSpeed(avgSpeed);
    setRunCompleted(true);
  };

  monitorRef.current = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation, // upgrade from Highest
      timeInterval: 1000,
      distanceInterval: 1
    },
    (location) => {
      if (!location?.coords) return;

      // Reject low accuracy readings (accuracy = radius of uncertainty in meters)
      // Typical good GPS is under 10m, bad readings can be 50-100m+
      if (location.coords.accuracy > 20) return;

      const newCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };

      // Speed gate — ignore update if basically stationary
      const speed = location.coords.speed ?? 0;
      if (speed < 0 || speed < 0.5) {
        setCurrentSpeed(0);
        previousLocation.current = newCoords; // still update position
        return;
      }

      // Low-pass filter to smooth coordinates
      // Blends 70% new reading with 30% previous to reduce jitter
      const smoothed = {
        latitude:  0.7 * newCoords.latitude  + 0.3 * previousLocation.current.latitude,
        longitude: 0.7 * newCoords.longitude + 0.3 * previousLocation.current.longitude
      };

      const distance = getDistance(previousLocation.current, smoothed);
      if (distance > 0.1) totalDistanceRef.current += distance;
      previousLocation.current = smoothed;

      setDistanceCovered(totalDistanceRef.current);
      setCurrentSpeed(speed);

      if (distanceGoal && totalDistanceRef.current >= distanceGoal) {
        endRun();
      }
    }
  );

  if (timeGoal) {
    timerIdRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setElapsedTime(elapsed);
      if (elapsed >= timeGoal) endRun();
    }, 500);
  }
};

  return (
    <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
   

      <Text style={styles.title}>Running Title Screen</Text>

      <View style={styles.buttonsWrapper}>
      <Button title="10 m Tester" onPress={() => startRun({ distanceGoal: 10 })} />
      <Button title="Explode!(100 Meters)" onPress={() => startRun({ distanceGoal: 100 })} />
      <Button title="Sprint!(200 Meters)" onPress={() => startRun({ distanceGoal: 200 })} />
      <Button title="Max Effort(400 Meters)" onPress={() => startRun({ distanceGoal: 400 })} />
      <Button title="Hard sustained effort(800 Meters)" onPress={() => startRun({ distanceGoal: 800 })} />
      <Button title="Classic Middle Distance(1500 Meters)" onPress={() => startRun({ distanceGoal: 1500 })} />
      <Button title="Popular Benchmark(1 Mile)" onPress={() => startRun({ distanceGoal: 1609 })} />
      <Button title="5K(3.1 Miles)" onPress={() => startRun({ distanceGoal: 5000 })} />
      <Button title="10K(6.2 Miles)" onPress={() => startRun({ distanceGoal: 10000 })} />
      <Button title="Half Marathon!(13.1 Miles)" onPress={() => startRun({ distanceGoal: 21097 })} />
      <Button title="Marathon!(26.2 Miles)" onPress={() => startRun({ distanceGoal: 42195 })} />
      <Text style={styles.infoText}>These distance names suck ^</Text>

      <Button title="10 seconds(Tester)" onPress={() => startRun({ timeGoal: 10 })} />
      <Button title="Quick(5 min)" onPress={() => startRun({ timeGoal: 300 })} />
      <Button title="Short(15 min)" onPress={() => startRun({ timeGoal: 900 })} />
      <Button title="Standard(30 min)" onPress={() => startRun({ timeGoal: 1800 })} />
      <Button title="Long(60 min)" onPress={() => startRun({ timeGoal: 3600 })} />
      <Button title="Extended(90 min)" onPress={() => startRun({ timeGoal: 5400 })} />
      </View>

      <Text style={styles.infoText}>Current Speed: {currentSpeed?.toFixed(2)} m/s</Text>
      <Text style={styles.infoText}>Distance Covered: {distanceCovered?.toFixed(1)} m</Text>

      {isTimedRun && !runCompleted && (
        <Text style={styles.infoText}>Elapsed Time: {elapsedTime.toFixed(1)} s</Text>
      )}

      {runCompleted && (
        <>
          <Text style={styles.infoText}>Run Completed!</Text>
          <Text style={styles.infoText}>Average Speed: {averageSpeed} m/s</Text>
          <Text style={styles.infoText}>Final Time: {finalTime} seconds</Text>
        </>
      )}
      </ScrollView>
    
  )
}

export default Running

const styles = StyleSheet.create({
  title: {
    marginVertical: 40,
    fontSize: 20,
    textAlign: 'center', // optional, keeps title centered
  },

  container: {
    flex: 1,
    paddingHorizontal: 16, // space from screen edges
    backgroundColor: '#fff', // optional: sets background color
  },

  scrollContainer: {
    paddingBottom: 40,   // prevents last button from being cut off
    alignItems: 'stretch', // ensures buttons take full width
  },

  buttonsWrapper: {
    alignItems: 'stretch', // stretch buttons inside
    marginBottom: 20,      // space after buttons group
  },

  infoText: {
    textAlign: 'center',   // keeps info text centered
    marginVertical: 6,     // spacing between texts
    fontSize: 16,
  },

  link: {
    marginVertical: 20,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  scrollView: {
    flex: 1,             // takes full screen
    paddingHorizontal: 16, // optional spacing
  },
});
