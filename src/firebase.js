import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCP_l2uREbRMcV6aHhB8yZXK7NdGNltxpA",
    authDomain: "bunk-mates-beccc.firebaseapp.com",
    projectId: "bunk-mates-beccc",
    storageBucket: "bunk-mates-beccc.firebasestorage.app",
    messagingSenderId: "37810808180",
    appId: "1:37810808180:web:94ca726e3c8f195a26f821",
    measurementId: "G-Y78WBDGF5Z"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = getFirestore(app);
