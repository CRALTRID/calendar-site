import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import { auth, provider } from "./firebase.js";

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function logoutUser() {
  return signOut(auth);
}

export function watchAuthState(cb) {
  onAuthStateChanged(auth, cb);
}
