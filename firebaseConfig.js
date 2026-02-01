import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCHRJhIok0BQnaKjFIoriG02q_iIUd-6OA",
  authDomain: "ninjagoals-a8047.firebaseapp.com",
  projectId: "ninjagoals-a8047",
  storageBucket: "ninjagoals-a8047.firebasestorage.app",
  messagingSenderId: "286293582746",
  appId: "1:286293582746:web:533634acbc9fba527e5023"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)

