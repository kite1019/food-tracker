import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCisKFWeg63UVRWzDtQUv7zJo8hg2_rtRA",
  authDomain: "food-tracker-a9532.firebaseapp.com",
  projectId: "food-tracker-a9532",
  storageBucket: "food-tracker-a9532.appspot.com",
  messagingSenderId: "209058769960",
  appId: "1:209058769960:web:5d7a77687ad01c4068991d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 