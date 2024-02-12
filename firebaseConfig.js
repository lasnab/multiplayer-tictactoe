// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB1qZadoBTnsc639N_wt-nB8UuTynU52ac',
  authDomain: 'tic-tac-toe-9d9ea.firebaseapp.com',
  databaseURL: 'https://tic-tac-toe-9d9ea-default-rtdb.firebaseio.com',
  projectId: 'tic-tac-toe-9d9ea',
  storageBucket: 'tic-tac-toe-9d9ea.appspot.com',
  messagingSenderId: '29416187363',
  appId: '1:29416187363:web:81b28587882e990be62cd6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
