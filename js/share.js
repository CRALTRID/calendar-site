import { state } from "./state.js";
import { t } from "./i18n.js";
import { els } from "./ui.js";
import {
  inviteUserByEmail,
  updateMemberRole,
  removeMember,
  leaveSharedCalendar
} from "./db.js";

export function renderOwnedSharedMembers() {
  els.ownSharedUsersList.innerHTML = "";

  const sharedMeta = state.calendar?.sharedMeta || {};
  const ids = Object.keys(sharedMeta);

  if (!ids.length && state.activeCalendarOwnerUid === state.currentUser?.uid) {
    const empty = document.createElement("div");
    empty.className = "member-row";
    empty.innerHTML = `<div>${t(state.lang, "noSharedUsers")}</div>`;
    els.ownSharedUsersList.appendChild(empty);
    return;
  }

  ids.forEach((uid) => {
    const item = sharedMeta[uid];
    const row = document.createElement("div");
    row.className = "member-row";

    const main = document.createElement("div");
    main.innerHTML = `
      <div><strong>${item.name || item.email || uid}</strong></div>
      <div class="small">${item.email || ""}</div>
    `;

    const roleSelect = document.createElement("select");
    roleSelect.innerHTML = `
      <option value="editor">${t(state.lang, "roleEditor")}</option>
      <option value="viewer">${t(state.lang, "roleViewer")}</option>
    `;
    roleSelect.value = item.role || "editor";
    roleSelect.disabled = state.activeCalendarOwnerUid !== state.currentUser?.uid;
    roleSelect.addEventListener("change", async () => {
      try {
        await updateMemberRole(uid, roleSelect.value);
        els.shareStatus.textContent = t(state.lang, "roleUpdated");
      } catch {
        els.shareStatus.textContent = t(state.lang, "roleUpdateFail");
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "danger";
    removeBtn.textContent = t(state.lang, "removeMember");
    removeBtn.disabled = state.activeCalendarOwnerUid !== state.currentUser?.uid;
    removeBtn.addEventListener("click", async () => {
      try {
        await removeMember(uid);
        els.shareStatus.textContent = t(state.lang, "memberRemoved");
      } catch {
        els.shareStatus.textContent = t(state.lang, "memberRemoveFail");
      }
    });

    row.appendChild(main);
    row.appendChild(roleSelect);
    row.appendChild(removeBtn);
    els.ownSharedUsersList.appendChild(row);
  });
}

export function renderSharedWithMe() {
  els.sharedCalendarsList.innerHTML = "";

  if (!state.sharedCalendars.length) {
    const empty = document.createElement("div");
    empty.className = "shared-item";
    empty.textContent = t(state.lang, "noSharedCalendars");
    els.sharedCalendarsList.appendChild(empty);
    return;
  }

  state.sharedCalendars.forEach((calendar) => {
    const role = calendar.sharedMeta?.[state.currentUser.uid]?.role || "viewer";
    const isCurrent = state.activeCalendarId === calendar.id;

    const item = document.createElement("div");
    item.className = "shared-item";

    item.innerHTML = `
      <h4>${calendar.title || t(state.lang, "sharedCalendarName")}</h4>
      <p>${t(state.lang, "sharedBy")}：${calendar.ownerName || calendar.ownerEmail || ""}</p>
      <div class="small">${t(state.lang, "sharedRole")}：${role === "editor" ? t(state.lang, "roleEditor") : t(state.lang, "roleViewer")}</div>
    `;

    const btnRow = document.createElement("div");
    btnRow.className = "row-wrap mt16";

    const openBtn = document.createElement("button");
    openBtn.textContent = isCurrent ? t(state.lang, "sharedOpenCurrent") : t(state.lang, "sharedOpenThis");
    openBtn.disabled = isCurrent;
    openBtn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open-calendar", { detail: calendar.id }));
    });

    const leaveBtn = document.createElement("button");
    leaveBtn.className = "danger";
    leaveBtn.textContent = t(state.lang, "leaveShared");
    leaveBtn.addEventListener("click", async () => {
      try {
        await leaveSharedCalendar(calendar.id, state.currentUser.uid);
        els.shareStatus.textContent = t(state.lang, "leaveSharedSuccess");
      } catch {
        els.shareStatus.textContent = t(state.lang, "leaveSharedFail");
      }
    });

    btnRow.appendChild(openBtn);
    btnRow.appendChild(leaveBtn);
    item.appendChild(btnRow);

    els.sharedCalendarsList.appendChild(item);
  });
}

export function renderSharePage() {
  renderOwnedSharedMembers();
  renderSharedWithMe();
}

export async function handleInvite() {
  if (!state.currentUser) {
    els.shareStatus.textContent = t(state.lang, "inviteNeedLogin");
    return;
  }

  try {
    await inviteUserByEmail(els.inviteEmailInput.value, els.inviteRoleSelect.value);
    els.shareStatus.textContent = t(state.lang, "inviteSuccess");
    els.inviteEmailInput.value = "";
  } catch (err) {
    if (err.message === "empty-email") {
      els.shareStatus.textContent = t(state.lang, "inviteNoEmail");
    } else if (err.message === "invite-self") {
      els.shareStatus.textContent = t(state.lang, "inviteSelf");
    } else if (err.message === "user-not-found") {
      els.shareStatus.textContent = t(state.lang, "inviteNotFound");
    } else {
      els.shareStatus.textContent = t(state.lang, "inviteFail");
    }
  }
}
