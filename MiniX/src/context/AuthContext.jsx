// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import API_BASE_URL from "../config";
import { auth } from "../firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword 
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  axios.defaults.baseURL = API_BASE_URL;

  // Auto fetch user on page refresh via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Securely sync Firebase login state with Express Backend Cookie layer
        try {
          const idToken = await currentUser.getIdToken();
          await axios.post("/api/auth/firebase", { idToken }, { withCredentials: true });
        } catch (err) {
          console.error("Backend auth sync failed:", err);
        }

        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || "User",
          email: currentUser.email,
          photoURL: currentUser.photoURL
        });
      } else {
        setUser(null);
        // Clean backend session cookie as well
        await axios.post("/api/auth/logout", {}, { withCredentials: true }).catch(() => null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Register
  const registerUser = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(userCredential.user, { displayName: name });
    setUser({
      uid: userCredential.user.uid,
      name,
      email,
      photoURL: userCredential.user.photoURL
    });
    return userCredential.user;
  };

  // Login
  const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  // Google Login
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  };

  // Update profile
  const updateProfile = async (name, email) => {
    if (auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName: name });
      setUser((prev) => ({ ...prev, name }));
      return auth.currentUser;
    }
  };

  // Update password
  const updatePassword = async (oldPassword, newPassword) => {
    if (auth.currentUser) {
      await firebaseUpdatePassword(auth.currentUser, newPassword);
    }
  };

  // Logout
  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerUser,
        loginUser,
        loginWithGoogle,
        logoutUser,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
