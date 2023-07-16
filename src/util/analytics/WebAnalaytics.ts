import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDiF7SVsUuB5dK3kuXBI_5sI7XU8_iNuk8",
  authDomain: "wgplaner-a091e.firebaseapp.com",
  projectId: "wgplaner-a091e",
  storageBucket: "wgplaner-a091e.appspot.com",
  messagingSenderId: "594491784193",
  appId: "1:594491784193:web:0c68d523eead704e5fd400",
  measurementId: "G-B4NF2BQTRK",
};

const app = initializeApp(firebaseConfig);

export const webAnalytics = getAnalytics(app);

