import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBhwkDkx_xCU51bd7owNF74FunoUec2KrY",
  authDomain: "hfsex-a6114.firebaseapp.com",
  projectId: "hfsex-a6114",
  storageBucket: "hfsex-a6114.firebasestorage.app",
  messagingSenderId: "35309193656",
  appId: "1:35309193656:web:32871f89f8729de715e74d",
  measurementId: "G-5EK9Q00F21"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
