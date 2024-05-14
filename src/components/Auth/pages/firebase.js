import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAef0EQJJNig0J9z9Z7V1o1gAazT0Aohc8",
  authDomain: "happy-paws-office.firebaseapp.com",
  projectId: "happy-paws-office",
  storageBucket: "happy-paws-office.appspot.com",
  messagingSenderId: "394632516498",
  appId: "1:394632516498:web:3bbb449299e9a65342674b",
  measurementId: "G-XDW1V85YM0",
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
// export const db = firebase.firestore();
export const google_provider = new firebase.auth.GoogleAuthProvider();
export const facebook_provider = new firebase.auth.FacebookAuthProvider();

// Set up reCAPTCHA verifier for phone authentication
export const setupRecaptcha = (containerId) => {
  return new firebase.auth.RecaptchaVerifier(containerId, {
    'size': 'invisible',
    'callback': function(response) {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA solved', response);
    },
    'expired-callback': function() {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
};
