import { loginWithGoogle, logoutUser, watchAuthState } from "./auth.js";
import { state, syncFromCloud } from "./state.js";
import { renderCalendar } from "./calendar.js";

const $ = (id) => document.getElementById(id);

// ========= DOM =========
const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");

const authGate = $("authGate");
const app = $("app");

const userName = $("userName");
const userEmail = $("userEmail");
const userAvatar = $("userAvatar");

const calendarContainer = $("calendarContainer");

const prevBtn = $("prevBtn");
const todayBtn = $("todayBtn");
const nextBtn = $("nextBtn");

const monthViewBtn = $("monthViewBtn");
const yearViewBtn = $("yearViewBtn");

const shareBtn = $("shareBtn");

// ========= UI =========
function showGate() {
  authGate?.classList.remove("hidden");
  app?.classList.add("hidden");
}

function showApp() {
  authGate?.classList.add("hidden");
  app?.classList.remove("hidden");
}

function updateUser(user) {
  if (!user) return;

  if (userName) userName.textContent = user.displayName || "User";
  if (userEmail) userEmail.textContent = user.email || "";
  if (userAvatar && user.photoURL) userAvatar.src = user.photoURL;
}

// ========= 渲染 =========
function render() {
  renderCalendar(calendarContainer, state);
}

// ========= 错误处理（🔥关键） =========
function handleError(err) {
  console.error(err);

  if (!err || !err.message) {
    alert("Unknown error");
    return;
  }

  // 🔥 API KEY 错误
  if (err.message.includes("api-key-not-valid")) {
    alert("❌ Firebase配置错误（API KEY不对）\n去 firebase.js 重新复制 config");
    return;
  }

  // 🔥 未授权域名
  if (err.message.includes("auth/unauthorized-domain")) {
    alert("❌ 域名未授权\n去 Firebase → Authentication → Settings 添加域名");
    return;
  }

  // 🔥 popup 被阻止
  if (err.message.includes("popup-blocked")) {
    alert("❌ 浏览器拦截登录弹窗，请允许弹窗");
    return;
  }

  // 默认
  alert(err.message);
}

// ========= 登录 =========
loginBtn && (loginBtn.onclick = async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    handleError(err);
  }
});

// ========= 登出 =========
logoutBtn && (logoutBtn.onclick = async () => {
  try {
    await logoutUser();
  } catch (err) {
    handleError(err);
  }
});

// ========= Auth监听 =========
watchAuthState(async (user) => {
  state.currentUser = user;

  if (user) {
    updateUser(user);

    try {
      await syncFromCloud();
    } catch (err) {
      handleError(err);
    }

    showApp();
    render();
  } else {
    showGate();
  }
});

// ========= 导航 =========
prevBtn && (prevBtn.onclick = () => {
  state.currentDate = new Date(
    state.currentDate.getFullYear(),
    state.currentDate.getMonth() - 1,
    1
  );
  render();
});

nextBtn && (nextBtn.onclick = () => {
  state.currentDate = new Date(
    state.currentDate.getFullYear(),
    state.currentDate.getMonth() + 1,
    1
  );
  render();
});

todayBtn && (todayBtn.onclick = () => {
  state.currentDate = new Date();
  render();
});

// ========= 视图 =========
monthViewBtn && (monthViewBtn.onclick = () => {
  state.currentView = "month";
  render();
});

yearViewBtn && (yearViewBtn.onclick = () => {
  state.currentView = "year";
  render();
});

// ========= 分享 =========
if (shareBtn) {
  shareBtn.onclick = () => {
    const data = btoa(JSON.stringify(state.entries));
    const link = `${location.origin}?data=${data}`;

    navigator.clipboard.writeText(link);
    alert("Share link copied!");
  };
}

// ========= 读取分享 =========
const params = new URLSearchParams(location.search);
if (params.get("data")) {
  try {
    state.entries = JSON.parse(atob(params.get("data")));
  } catch {}
}
