// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnOsbyHKXRJzS1F1eumtjwuVzOHCQb1Wc",
  authDomain: "otp-hackathon-accountagr.firebaseapp.com",
  projectId: "otp-hackathon-accountagr",
  storageBucket: "otp-hackathon-accountagr.appspot.com",
  messagingSenderId: "12005736072",
  appId: "1:12005736072:web:fa5b8678427176d330e93d",
  measurementId: "G-1ZEDLRWQZB",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var auth = firebase.auth();
export { auth, firebase };
