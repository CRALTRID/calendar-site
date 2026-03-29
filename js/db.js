import { db } from "./firebase.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

export async function saveUserData(uid, data) {
  await setDoc(doc(db, "users", uid), data);
}

export async function loadUserData(uid) {
  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}
