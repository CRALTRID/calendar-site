export function updateProfileUI(user) {
  document.getElementById("userName").textContent = user.displayName;
  document.getElementById("userEmail").textContent = user.email;
}
