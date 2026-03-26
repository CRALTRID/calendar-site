import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

import { db } from "./firebase.js";
import { state, makeDefaultCalendar } from "./state.js";
import { t } from "./i18n.js";

let unsubscribeActiveCalendar = null;
let unsubscribeProfile = null;
let unsubscribeSharedCalendars = null;

export function cleanupSubscriptions() {
  if (unsubscribeActiveCalendar) {
    unsubscribeActiveCalendar();
    unsubscribeActiveCalendar = null;
  }
  if (unsubscribeProfile) {
    unsubscribeProfile();
    unsubscribeProfile = null;
  }
  if (unsubscribeSharedCalendars) {
    unsubscribeSharedCalendars();
    unsubscribeSharedCalendars = null;
  }
}

export function calendarDocRef(id) {
  return doc(db, "calendars", id);
}

export function userDocRef(uid) {
  return doc(db, "users", uid);
}

export async function ensureProfileExists(user) {
  const ref = userDocRef(user.uid);
  const snap = await getDoc(ref);

  const base = {
    name: user.displayName || "",
    phoneNumber: "",
    birthday: "",
    email: user.email || "",
    emailLower: (user.email || "").toLowerCase(),
    photoURL: user.photoURL || "",
    displayName: user.displayName || ""
  };

  if (!snap.exists()) {
    await setDoc(ref, base);
  } else {
    await setDoc(ref, base, { merge: true });
  }
}

export function subscribeProfile(user, onChange) {
  const ref = userDocRef(user.uid);
  unsubscribeProfile = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      state.profile = { ...state.profile, ...snap.data() };
      onChange?.();
    }
  });
}

export async function saveProfileData(user, data) {
  const ref = userDocRef(user.uid);
  await setDoc(ref, {
    ...data,
    email: user.email || "",
    emailLower: (user.email || "").toLowerCase(),
    photoURL: user.photoURL || "",
    displayName: user.displayName || ""
  }, { merge: true });
}

export async function createCalendarForUser(user, title) {
  const calendar = makeDefaultCalendar(state.lang);
  calendar.title = title || t(state.lang, "newCalendarDefault");
  calendar.ownerUid = user.uid;
  calendar.ownerEmail = user.email || "";
  calendar.ownerName = user.displayName || "";
  calendar.createdAt = Date.now();
  calendar.updatedAt = Date.now();

  const ref = await addDoc(collection(db, "calendars"), calendar);
  return ref.id;
}

export async function loadOwnedCalendars(user) {
  const q = query(collection(db, "calendars"), where("ownerUid", "==", user.uid));
  const snap = await getDocs(q);

  state.ownedCalendars = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.title || "").localeCompare(b.title || ""));
}

export function subscribeSharedCalendars(user, onChange) {
  const q = query(collection(db, "calendars"), where("sharedWith", "array-contains", user.uid));
  unsubscribeSharedCalendars = onSnapshot(q, (snap) => {
    state.sharedCalendars = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    onChange?.();
  });
}

export function subscribeActiveCalendar(calendarId, onChange, onError) {
  if (unsubscribeActiveCalendar) {
    unsubscribeActiveCalendar();
    unsubscribeActiveCalendar = null;
  }

  state.activeCalendarId = calendarId;
  const ref = calendarDocRef(calendarId);

  unsubscribeActiveCalendar = onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        state.calendar = snap.data();
        state.activeCalendarOwnerUid = state.calendar.ownerUid;
        onChange?.();
      }
    },
    (err) => {
      onError?.(err);
    }
  );
}

export async function openFirstAvailableCalendar(user) {
  await loadOwnedCalendars(user);

  if (state.ownedCalendars.length > 0) {
    return state.ownedCalendars[0].id;
  }

  const newId = await createCalendarForUser(user, t(state.lang, "myCalendarName"));
  await loadOwnedCalendars(user);
  return newId;
}

export async function saveCurrentCalendar() {
  if (!state.activeCalendarId || !state.calendar) return;
  await setDoc(calendarDocRef(state.activeCalendarId), {
    ...state.calendar,
    updatedAt: Date.now()
  }, { merge: true });
}

export async function saveCalendarTitle(title) {
  if (!state.activeCalendarId || !state.calendar) return;
  state.calendar.title = title;
  await saveCurrentCalendar();
}

export async function deleteCalendarById(calendarId) {
  await deleteDoc(calendarDocRef(calendarId));
}

export async function inviteUserByEmail(email, role) {
  if (!state.currentUser || !state.activeCalendarId || !state.calendar) {
    throw new Error("invite-not-ready");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("empty-email");
  }

  if (normalizedEmail === (state.currentUser.email || "").toLowerCase()) {
    throw new Error("invite-self");
  }

  const userQ = query(collection(db, "users"), where("emailLower", "==", normalizedEmail));
  const userSnap = await getDocs(userQ);

  if (userSnap.empty) {
    throw new Error("user-not-found");
  }

  const targetDoc = userSnap.docs[0];
  const targetUid = targetDoc.id;
  const targetData = targetDoc.data();

  const sharedWith = Array.isArray(state.calendar.sharedWith) ? [...state.calendar.sharedWith] : [];
  if (!sharedWith.includes(targetUid)) {
    sharedWith.push(targetUid);
  }

  const sharedMeta = state.calendar.sharedMeta || {};
  sharedMeta[targetUid] = {
    uid: targetUid,
    email: targetData.email || normalizedEmail,
    name: targetData.name || targetData.displayName || "",
    photoURL: targetData.photoURL || "",
    role
  };

  state.calendar.sharedWith = sharedWith;
  state.calendar.sharedMeta = sharedMeta;
  await saveCurrentCalendar();
}

export async function updateMemberRole(targetUid, role) {
  if (!state.calendar) return;
  const sharedMeta = state.calendar.sharedMeta || {};
  if (!sharedMeta[targetUid]) return;
  sharedMeta[targetUid].role = role;
  state.calendar.sharedMeta = sharedMeta;
  await saveCurrentCalendar();
}

export async function removeMember(targetUid) {
  if (!state.calendar) return;

  const sharedWith = Array.isArray(state.calendar.sharedWith)
    ? state.calendar.sharedWith.filter((uid) => uid !== targetUid)
    : [];

  const sharedMeta = state.calendar.sharedMeta || {};
  delete sharedMeta[targetUid];

  state.calendar.sharedWith = sharedWith;
  state.calendar.sharedMeta = sharedMeta;
  await saveCurrentCalendar();
}

export async function leaveSharedCalendar(calendarId, uid) {
  const ref = calendarDocRef(calendarId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const data = snap.data();
  const sharedWith = Array.isArray(data.sharedWith)
    ? data.sharedWith.filter((id) => id !== uid)
    : [];
  const sharedMeta = data.sharedMeta || {};
  delete sharedMeta[uid];

  await setDoc(ref, {
    sharedWith,
    sharedMeta,
    updatedAt: Date.now()
  }, { merge: true });
}
