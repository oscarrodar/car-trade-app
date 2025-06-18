// src/config/firebaseConfig.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyD-D-RdQAXJw4siKfhewDSd6D6vO--70ZY",
  authDomain: "car-trader-42fa2.firebaseapp.com",
  projectId: "car-trader-42fa2",
  storageBucket: "car-trader-42fa2.firebasestorage.app",
  messagingSenderId: "644138701713",
  appId: "1:644138701713:web:2c1657ef9e9ed2294a8030",
  measurementId: "G-EQC9BFLPDM"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app); // Get the auth instance

export { app, auth }; // Export auth as well
