import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCccmma_B6gNdycE4n7a2-169iK5kO-T-I",
  authDomain: "monkey-blogging-23e8e.firebaseapp.com",
  projectId: "monkey-blogging-23e8e",
  storageBucket: "monkey-blogging-23e8e.appspot.com",
  messagingSenderId: "375050943125",
  appId: "1:375050943125:web:1a781435aa1047e4e9b99c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
