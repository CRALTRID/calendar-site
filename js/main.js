import { loginWithGoogle, watchAuthState } from "./auth.js";

document.getElementById("gateTitle").textContent = "Challenge Hub";
document.getElementById("gateDesc").textContent = "Please sign in to continue.";
document.getElementById("loginBtn").textContent = "Google Login";
document.getElementById("gateStatus").textContent = "Auth module loaded.";

watchAuthState((user) => {
  document.getElementById("gateStatus").textContent = user
    ? `Signed in as ${user.email || "user"}`
    : "Not signed in";
});

document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    await loginWithGoogle();
  } catch (err) {
    document.getElementById("gateStatus").textContent =
      err.code || err.message || "login failed";
  }
});
