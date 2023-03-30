import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";

//The code block below should be copied and pasted from 
//  Google Firebase app configuration step.

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId:"",
  appId: ""
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp, db };
