// 🚩 firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";


const firebaseConfig = {
    // firebase 설정과 관련된 개인 정보
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
    appId: process.env.REACT_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireDB = getFirestore(app);
const provider = new GoogleAuthProvider();

export { fireDB, auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, doc, setDoc, getDoc, updateDoc,arrayUnion, arrayRemove
}