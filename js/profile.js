import { state } from "./state.js";
import { els } from "./ui.js";
import { t } from "./i18n.js";
import { saveProfileData } from "./db.js";

export function renderProfile() {
  els.profileNameInput.value = state.profile.name || state.currentUser?.displayName || "";
  els.profilePhoneInput.value = state.profile.phoneNumber || "";
  els.profileBirthdayInput.value = state.profile.birthday || "";
  els.profileEmailInput.value = state.currentUser?.email || "";

  if (!els.profileStatus.textContent) {
    els.profileStatus.textContent = t(state.lang, "profileIdle");
  }
}

export async function handleSaveProfile() {
  if (!state.currentUser) return;

  try {
    await saveProfileData(state.currentUser, {
      name: els.profileNameInput.value.trim(),
      phoneNumber: els.profilePhoneInput.value.trim(),
      birthday: els.profileBirthdayInput.value || ""
    });
    els.profileStatus.textContent = t(state.lang, "profileSaved");
  } catch {
    els.profileStatus.textContent = t(state.lang, "profileSaveFail");
  }
}
