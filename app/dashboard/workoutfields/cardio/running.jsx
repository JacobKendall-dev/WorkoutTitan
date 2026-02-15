import { StyleSheet, Text, View, Button } from 'react-native'
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

  
  const previousLocation = useRef(null);
  const startTime = useRef(null);
  const monitorRef = useRef(null);
  const totalDistanceRef = useRef(0);
  const timerIdRef = useRef(null);
  

  const startRun = async ({distanceGoal = 0, timeGoal = null} = {}) => {
    
  monitorRef.current?.remove();
  clearInterval(timerIdRef.current);

  //For permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission denied");
    return;
  }

  setIsTimedRun(Boolean(timeGoal));

  //Reset states and UI
  setRunCompleted(false);
  setAverageSpeed(null);
  setCurrentSpeed(0);
  setDistanceCovered(0);
  setFinalTime(null);
  setElapsedTime(0);
  totalDistanceRef.current = 0;


  //To get initiall location values stored in start
  const start = await Location.getCurrentPositionAsync({ 
  accuracy: Location.Accuracy.Highest 
  })
  //To extract the coordinates location values specifically in start and put in prevLOcation
  previousLocation.current = {
    latitude: start.coords.latitude,
    longitude: start.coords.longitude
  }
  //Start time we will use to calculate the average speed at the end
  startTime.current = Date.now()

  const endRun = () => {
  monitorRef.current?.remove();
  clearInterval(timerIdRef.current);

  const endTimeVal = (Date.now() - startTime.current) / 1000
  const avgSpeed = totalDistanceRef.current / endTimeVal;
  setFinalTime(endTimeVal)
  setAverageSpeed(avgSpeed)
  setRunCompleted(true)
  }

  monitorRef.current = await Location.watchPositionAsync(
  {
    accuracy: Location.Accuracy.Highest,
    timeInterval: 1000,      // milliseconds between updates
    distanceInterval: 1      // meters between updates
  }, 
  (location) => {
    if (!location?.coords) return;

    const newCoords  = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }

    const distance = getDistance(previousLocation.current, newCoords)
    if (distance > 0.5) totalDistanceRef.current += distance; //it was jittery and apparently this helps with jumps
    previousLocation.current = newCoords
    setDistanceCovered(totalDistanceRef.current)


    const speed = location.coords.speed
    setCurrentSpeed(speed)

    if (distanceGoal && totalDistanceRef.current >= distanceGoal)
    {
      endRun()
    }
    
    

  }) //end of monitor function

  if (timeGoal) {
    timerIdRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      setElapsedTime(elapsed)
      if (elapsed >= timeGoal) {
        endRun();
      }
    }, 500); // check every 0.5s
  }

} //end of startRun

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Running Title Screen</Text>
      <Button title="10 m Run" onPress={() => startRun({ distanceGoal: 10 })} />
      <Button title="500 m Run" onPress={() => startRun({ distanceGoal: 500 })} />
      <Button title="1 km Run" onPress={() => startRun({ distanceGoal: 1000 })} />

      <Button title="10 second Run" onPress={() => startRun({ timeGoal: 10 })} />
      <Button title="5 min Run" onPress={() => startRun({ timeGoal: 300 })} />

      <Text>Current Speed: {currentSpeed?.toFixed(2)} m/s</Text>
      <Text>Distance Covered: {distanceCovered?.toFixed(1)} m</Text>

      {isTimedRun && !runCompleted && (
        <Text>Elapsed Time: {elapsedTime.toFixed(1)} s</Text>
      )}

      {runCompleted && (
        <>
          <Text>Run Completed!</Text>
          <Text>Average Speed: {averageSpeed} m/s</Text>
          <Text>Final Time: {finalTime} seconds</Text>
        </>
      )}


    </View>
  )
}

export default Running

const styles = StyleSheet.create({
    title: {
        marginVertical: 40,
        fontSize: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        marginVertical: 20,
        fontSize: 20,
        textDecorationLine: 'underline'
    },

})