import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

import { auth, provider } from "./firebase.js";

export async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence);
  return signInWithPopup(auth, provider);
}

export async function logoutUser() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}