import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../lib/firebaseConfig";

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    async function login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const response = userCredential.user;
        setUser(response)
        console.log("User ID:", response.uid); // ← This is the unique Firebase user ID
        console.log("Email:", response.email);

        } catch (error) {
            throw Error(error.message)
        }
    }

    async function register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const response = userCredential.user;
        setUser(response)

        await login(email, password)

        } catch (error) {
            throw Error(error.message)
        }
    }

    async function logout() {
        try{
            await signOut(auth)
        } catch(error) {
            console.log(error)
        }
        setUser(null);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user ?? null)
            setAuthChecked(true) // ✅ fires only after Firebase responds
        })

        return () => unsubscribe() // ✅ cleanup is returned directly to useEffect
    }, [])

return(
    <UserContext.Provider value={{ user, login, register, logout, authChecked}}>
        {children}
    </UserContext.Provider>
)
}
