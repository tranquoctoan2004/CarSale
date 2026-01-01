document.addEventListener("DOMContentLoaded", () => {
  initFilterEvents();
  fetchUsers(); // load lần đầu
});

/* =======================
   FETCH USERS (BACKEND FILTER)
======================= */
function fetchUsers({ keyword = "", status = "" } = {}) {
  const token = localStorage.getItem("token");

  const params = new URLSearchParams();
  if (keyword) {
    params.append("username", keyword);
    params.append("email", keyword);
  }
  if (status) params.append("status", status);

  fetch(`/api/accounts/search?${params.toString()}`, {
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(r => renderUsers(r.data || []))
    .catch(() => alert("Cannot load users"));
}

/* =======================
   FILTER EVENTS
======================= */
function initFilterEvents() {
  const searchInput = document.querySelector(".search-input");
  const statusSelect = document.querySelector(".filters select");

  searchInput.addEventListener(
    "input",
    debounce(() => applyFilter(), 400)
  );

  statusSelect.addEventListener("change", applyFilter);
}

function applyFilter() {
  const keyword = document.querySelector(".search-input").value.trim();
  const status = document.querySelector(".filters select").value;

  fetchUsers({
    keyword,
    status: status === "filterStatus" ? "" : status
  });
}

/* =======================
   DEBOUNCE
======================= */
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

/* =======================
   RENDER TABLE
======================= */
function renderUsers(users) {
  const tbody = document.getElementById("userTableBody");
  tbody.innerHTML = "";

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="7">No users found</td></tr>`;
    return;
  }

  users.forEach(u => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.accountId}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.roles.join(", ")}</td>
      <td class="status ${u.status}">${u.status}</td>
      <td>${u.createdAt?.substring(0, 10) || ""}</td>
      <td>
        <button class="view" data-id="${u.accountId}">
          <i class="fa-solid fa-eye"></i>
        </button>
        <button class="edit" data-id="${u.accountId}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" data-id="${u.accountId}">
          <i class="fa-solid fa-ban"></i>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* =======================
   EVENT DELEGATION
======================= */
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  if (btn.classList.contains("view")) openViewModal(id);
  if (btn.classList.contains("edit")) openEditModal(id);
  if (btn.classList.contains("delete")) deleteUser(id);
});

/* =======================
   MODAL CONTROL
======================= */
const modal = document.getElementById("userModal");
const viewBox = document.getElementById("viewUserBox");
const editBox = document.getElementById("editUserBox");

document.getElementById("closeModal").onclick = closeModal;
document.querySelector(".modal-overlay").onclick = closeModal;

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
  viewBox.classList.remove("hidden");
  editBox.classList.add("hidden");
}

/* =======================
   VIEW USER
======================= */
function openViewModal(id) {
  const token = localStorage.getItem("token");

  fetch(`/api/accounts/${id}`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(r => {
      const u = r.data;

      document.getElementById("detailId").innerText = u.accountId;
      document.getElementById("detailUsername").innerText = u.username;
      document.getElementById("detailEmail").innerText = u.email;
      document.getElementById("detailPhone").innerText = u.phoneNumber || "-";
      document.getElementById("detailStatus").innerText = u.status;
      document.getElementById("detailRoles").innerText = u.roles.join(", ");

      openModal();
    })
    .catch(() => alert("Cannot view user"));
}

/* =======================
   EDIT USER
======================= */
function openEditModal(id) {
  const token = localStorage.getItem("token");

  fetch(`/api/accounts/${id}`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(r => {
      const u = r.data;

      viewBox.classList.add("hidden");
      editBox.classList.remove("hidden");

      document.getElementById("editUserId").value = u.accountId;
      document.getElementById("editStatus").value = u.status.toUpperCase();

      document
        .querySelectorAll(".role-group input")
        .forEach(cb => (cb.checked = u.roles.includes(cb.value)));

      openModal();
    })
    .catch(() => alert("Cannot edit user"));
}

/* =======================
   SAVE EDIT
======================= */
document.getElementById("saveUserBtn").onclick = () => {
  const id = document.getElementById("editUserId").value;
  const status = document
    .getElementById("editStatus")
    .value.toLowerCase();

  const roles = [...document.querySelectorAll(".role-group input:checked")]
    .map(i => i.value);

  const token = localStorage.getItem("token");

  fetch(`/api/admin/accounts/${id}`, {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status, roles })
  })
    .then(res => {
      if (!res.ok) throw new Error();
      closeModal();
      fetchUsers(); // reload list
    })
    .catch(() => alert("Update failed"));
};

/* =======================
   DELETE USER
======================= */
function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  const token = localStorage.getItem("token");

  fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error();
      fetchUsers();
    })
    .catch(() => alert("Delete failed"));
}
document.getElementById("addUserBtn").addEventListener("click", () => {
  window.location.href =
    "/screen/guest/signup.html?mode=admin&returnUrl=/screen/admin/usermanagement.html";
});

