import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBomO9IiCm3JpWKbnT8jVEpqoXjx2TyUbo",
  authDomain: "workout-titan-6de6c.firebaseapp.com",
  projectId: "workout-titan-6de6c",
  storageBucket: "workout-titan-6de6c.firebasestorage.app",
  messagingSenderId: "291624337558",
  appId: "1:291624337558:web:5449bff0bc9a83972202b7",
  measurementId: "G-HSRSYDM30S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app);

