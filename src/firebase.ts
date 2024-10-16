// 🚩 firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage} from 'firebase/storage';

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
    apiKey: process.env.REACT_APP_MAP_API_KEY,
    authDomain: process.env.REACT_APP_MAP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_MAP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_MAP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MAP_MESSAGIN_ID,
    appId: process.env.REACT_APP_MAP_ID,
    measurementId: process.env.REACT_APP_MAP_MEASUREMENT_ID,
};

// th 기본 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const fireDB = getFirestore(app);
const provider = new GoogleAuthProvider();
const firebaseStorage = getStorage(app);

// firebase map
const fbMapApp = initializeApp(firebaseConfig2, "firebase-map");
const fbMapAuth = getAuth(fbMapApp);
const fbMapDB = getFirestore(fbMapApp);
const fbMapStorage = getStorage(fbMapApp);

export { 
    auth, fireDB, provider, firebaseStorage, 
    fbMapAuth, fbMapDB, fbMapStorage 
};


