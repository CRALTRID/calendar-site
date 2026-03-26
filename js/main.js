import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import {
  els,
  state,
  applyLanguage,
  setUser,
  showGate,
  showApp,
  setView,
  moveDate,
  resetToday,
  startProgress,
  stopProgress,
  setBusy
} from "./ui.js";

applyLanguage();

els.monthViewBtn.addEventListener("click", () => setView("month"));
els.yearViewBtn.addEventListener("click", () => setView("year"));
els.prevBtn.addEventListener("click", () => moveDate(-1));
els.nextBtn.addEventListener("click", () => moveDate(1));
els.todayBtn.addEventListener("click", resetToday);

els.loginBtn.addEventListener("click", async () => {
  try {
    startProgress();
    setBusy(els.loginBtn, state.lang === "zh" ? "正在登录…" : "Signing in…", true);
    els.gateStatus.textContent = state.lang === "zh" ? "正在打开 Google 登录…" : "Opening Google sign-in…";
    await loginWithGoogle();
  } catch (err) {
    console.error("login error:", err);
    els.gateStatus.textContent = (state.lang === "zh" ? "登录失败：" : "Login failed: ") + (err.code || err.message || "unknown error");
    stopProgress();
    setBusy(els.loginBtn, "", false);
  }
});

els.logoutBtn.addEventListener("click", async () => {
  try {
    startProgress();
    setBusy(els.logoutBtn, state.lang === "zh" ? "正在退出…" : "Signing out…", true);
    await logoutUser();
  } catch (err) {
    console.error("logout error:", err);
    stopProgress();
    setBusy(els.logoutBtn, "", false);
  }
});

watchAuthState((user) => {
  if (user) {
    setUser(user);
    showApp();
  } else {
    showGate();
    els.gateStatus.textContent = state.lang === "zh" ? "请先登录。" : "Please sign in first.";
  }

  stopProgress();
  setBusy(els.loginBtn, "", false);
  setBusy(els.logoutBtn, "", false);
});