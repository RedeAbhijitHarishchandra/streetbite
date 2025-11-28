import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, Firestore } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth'
import { getAnalytics, Analytics } from 'firebase/analytics'

// Use provided Firebase config (falls back to existing env vars if you prefer)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "street-bite-v1.firebaseapp.com",
  projectId: "street-bite-v1",
  storageBucket: "street-bite-v1.firebasestorage.app",
  messagingSenderId: "1079217158988",
  appId: "1:1079217158988:web:3d3684e3842a090e7a6de9",
  measurementId: "G-WQYD7PQ34B"
}

// Initialize app only on client side
let app: FirebaseApp | null = null
let db: Firestore | null = null
let auth: Auth | null = null
let analytics: Analytics | null = null

// Only initialize Firebase on client side (browser)
if (typeof window !== 'undefined') {
  // Initialize app once
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  // Initialize Firestore
  if (app) {
    db = getFirestore(app)

    // Initialize Auth
    auth = getAuth(app)

    // Initialize analytics (optional, may fail if not enabled)
    try {
      analytics = getAnalytics(app)
    } catch (e) {
      // Analytics not critical - ignore errors
      console.warn('Firebase analytics initialization failed (this is okay):', e)
    }
  }
}

// Firestore CRUD functions removed. Use lib/api.ts for backend communication.
// Firestore is now only used for real-time features (listeners).

// Helper function to get auth instance (throws error if not initialized)
export function getAuthInstance(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase Auth can only be used on the client side')
  }
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Make sure you are in the browser environment.')
  }
  return auth
}

// Helper function to check if Firebase Auth is ready
export function isAuthReady(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return auth !== null && app !== null
}

// Helper function to get current auth status
export function getAuthStatus(): { ready: boolean; error?: string } {
  if (typeof window === 'undefined') {
    return { ready: false, error: 'Not in browser environment' }
  }
  if (!app) {
    return { ready: false, error: 'Firebase app not initialized' }
  }
  if (!auth) {
    return { ready: false, error: 'Firebase Auth not initialized' }
  }
  return { ready: true }
}

// Export app, db, and auth if other modules need direct access
export { app, db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
export type { FirebaseUser }
