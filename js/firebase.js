import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBwrV0E8MWsHMlG31Xe2az6M9rb5dCjilM",
    authDomain: "flareuglobal-31f46.firebaseapp.com",
    databaseURL: "https://flareuglobal-31f46-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "flareuglobal-31f46",
    storageBucket: "flareuglobal-31f46.firebasestorage.app",
    messagingSenderId: "508953363954",
    appId: "1:508953363954:web:e7991c8d571611c790d76b",
    measurementId: "G-S1ZXDVL6LV"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);