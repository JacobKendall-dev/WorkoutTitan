import { StyleSheet, Text, View } from 'react-native'
import { db, auth } from "../lib/firebaseConfig";
import {collection, doc, onSnapshot, setDoc, increment } from "firebase/firestore"
import React, { useEffect, useState } from 'react'

export function useWorkouts(){
    const [exercises, setExercises] = useState({});
    
    const user = auth.currentUser;
    const userId = user?.uid;

    //create or update in (db, 'users', userId, 'exercises')
    async function logExercise(exerciseName, muscle, sets, personalBest) {
    if (!user) throw new Error("User not logged in");

    const exerciseRef = doc(db, 'users', userId, 'exercises', exerciseName);

    await setDoc(exerciseRef, {
        exerciseAmount: increment(1),
        muscle: muscle,
        sets: sets,
        personalBest: personalBest,
        lastUpdated: new Date()
    });

    console.log(`Updated ${exerciseName} for ${userId}`);
    }

    //read the exercises from (db, 'users', userId, 'exercises')
    const subscribeToExercises = () => {
    if (!userId) return () => {};

    const unsubscribe = onSnapshot(
      collection(db, 'users', userId, 'exercises'),
      (snapshot) => {
        const allData = {};
        snapshot.docs.forEach(doc => {
          allData[doc.id] = doc.data();
        });
        setExercises(allData);
      }
    )
    return unsubscribe;
    }

    useEffect(() => {
        const unsubscribe = subscribeToExercises();

        return () => unsubscribe();
    }, [userId]);

    return {logExercise, exercises}
}
