import { saveUserData, loadUserData } from "./db.js";

export const state = {
  currentUser: null,
  currentDate: new Date(),
  currentView: "month", // "month" or "year"
  entries: {}
};

// 🔄 从 Firebase 拉数据
export async function syncFromCloud() {
  if (!state.currentUser) return;

  try {
    const data = await loadUserData(state.currentUser.uid);

    if (data && data.entries) {
      state.entries = data.entries;
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
}

// ☁️ 保存到 Firebase
export async function syncFromCloud() {
  if (!state.currentUser) return;

  try {
    const data = await loadUserData(state.currentUser.uid);

    if (data && data.entries) {
      // ✅ 合并，而不是覆盖
      state.entries = {
        ...state.entries,
        ...data.entries
      };
    }
  } catch (err) {
    console.error("Load failed:", err);
  }
}
