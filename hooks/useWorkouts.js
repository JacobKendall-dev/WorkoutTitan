import { StyleSheet, Text, View } from 'react-native'
import { db, auth } from "../lib/firebaseConfig";
import {collection, doc, onSnapshot, setDoc, updateDoc, increment, arrayUnion } from "firebase/firestore"
import React, { useEffect, useState } from 'react'
import {images} from '../data/challenges.js'
import {checkAllChallenges} from '../utils/challengeEngine.js'

export function useWorkouts(){
    const [exercises, setExercises] = useState({});
    const [ownedItems, setOwnedItems] = useState([]);
    
    const user = auth.currentUser;
    const userId = user?.uid;

    //create or update in (db, 'users', userId, 'exercises')
    async function logExercise(exerciseName, muscle, sets, personalBest) {
      if (!user) throw new Error("User not logged in");

      const exerciseRef = doc(db, 'users', userId, 'exercises', exerciseName);

      try {
        await updateDoc(exerciseRef, {
          exerciseAmount: increment(1),
          muscle: muscle,
          sets: sets,
          personalBest: Number(personalBest) || 0,
          lastUpdated: new Date()
        });
      } catch (err) {
        // document doesn't exist yet → create it
        await setDoc(exerciseRef, {
          exerciseAmount: 1,
          muscle: muscle,
          sets: sets,
          personalBest: Number(personalBest) || 0,
          lastUpdated: new Date()
        })
      }

      const updatedExercises = {
        ...exercises,
        [exerciseName]: {
          ...exercises[exerciseName],
          sets: sets, 
          personalBest
        }
      }
        await checkAllChallenges(updatedExercises, ownedItems, addOwnedItem)

      console.log(`Updated ${exerciseName} for ${userId}`);
    }

    async function addOwnedItem(itemId) {
      if (!user) throw new Error("User not logged in")

      const userRef = doc(db, 'users', userId)

      await setDoc(userRef, {
        ownedItems: arrayUnion(itemId)
      }, { merge: true })
    }

    //read the exercises from (db, 'users', userId, 'exercises')
    const subscribeToExercises = () => {
      if (!userId) return

      const ref = collection(db, 'users', userId, 'exercises');

      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const allData = {}

        snapshot.forEach((doc) => {
          allData[doc.id] = doc.data();
        })

        setExercises(allData);
      })

      return unsubscribe;
    }

    const subscribeToOwnedItems = () => {
      if (!userId) return () => {}

      const userRef = doc(db, 'users', userId);

      const unsubscribe = onSnapshot(userRef, (snap) => {
        const data = snap.data()
        setOwnedItems(data?.ownedItems || []);
      })

      return unsubscribe
    }

    useEffect(() => {
      if (!userId) return

      const unsubExercises = subscribeToExercises()
      const unsubOwnedItems = subscribeToOwnedItems()

      return () => {
        unsubExercises?.()
        unsubOwnedItems?.()
      }
    }, [userId])

    return {logExercise, exercises, ownedItems}
}