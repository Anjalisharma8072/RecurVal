import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2SaM5EZf6l1U7f3Stk9GrNHfYKAVARic",
  authDomain: "recurval-94b22.firebaseapp.com",
  projectId: "recurval-94b22",
  storageBucket: "recurval-94b22.firebasestorage.app",
  messagingSenderId: "887734072672",
  appId: "1:887734072672:web:289628ae3a7e957534da05",
  measurementId: "G-HGF47DZ9EB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
