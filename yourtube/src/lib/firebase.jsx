import {
  initializeApp,
  getApps,
  getApp,
} from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDK8RM3UVOviSPOx2DLcDDFtMkBkaL-rCE",
  authDomain: "yourtube-31c5c.firebaseapp.com",
  projectId: "yourtube-31c5c",
  storageBucket: "yourtube-31c5c.firebasestorage.app",
  messagingSenderId: "100744690652",
  appId: "1:100744690652:web:b818ce2787229a247d6d19",
  measurementId: "G-M7MXMR87L",
};

// Prevent Firebase from being initialized more than once
const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Google Authentication Provider
export const provider = new GoogleAuthProvider();