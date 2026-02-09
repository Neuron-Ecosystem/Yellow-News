import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA6ip448RTLHIYTaqHw0tNJ26TFpNiFuxc",
    authDomain: "yellow-news-65db7.firebaseapp.com",
    projectId: "yellow-news-65db7",
    storageBucket: "yellow-news-65db7.firebasestorage.app",
    messagingSenderId: "29184105367",
    appId: "1:29184105367:web:fd7a13d445b73d041fc2d2",
    measurementId: "G-RVQGP41T9S"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApps()[0];
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
