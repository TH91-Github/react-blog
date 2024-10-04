// 🚩 firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, deleteDoc, updateDoc, arrayUnion, arrayRemove, getDocs, query, where, limit, orderBy, startAfter } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const firebaseConfig2 = {
    // firebase 설정과 관련된 개인 정보
    apiKey: process.env.REACT_APP_API_KEY2,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN2,
    projectId: process.env.REACT_APP_PROJECT_ID2,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET2,
    messagingSenderId: process.env.REACT_APP_MESSAGIN_ID2,
    appId: process.env.REACT_APP_ID2,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID2,
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireDB = getFirestore(app);
const provider = new GoogleAuthProvider();
const firebaseStorage = getStorage(app);

// const app2 = initializeApp(firebaseConfig2, "secondary"); // 두 번째 앱은 이름을 지정해야 합니다.
// const auth2 = getAuth(app2);
// const fireDB2 = getFirestore(app2);
// const firebaseStorage2 = getStorage(app2);


export { fireDB, auth, provider, firebaseStorage, signInWithPopup, signInWithRedirect, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, collection, doc, setDoc, deleteDoc, getDoc, getDocs, updateDoc,arrayUnion, arrayRemove, query, where, onAuthStateChanged, limit, orderBy, startAfter, ref, uploadBytes, getDownloadURL
}


