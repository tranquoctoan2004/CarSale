document.addEventListener("DOMContentLoaded", () => {
  initFilterEvents();
  fetchUsers(); // Load lần đầu
});

/* =======================
    1. FETCH USERS (Lấy danh sách)
======================= */
function fetchUsers({ keyword = "", status = "" } = {}) {
  const token = localStorage.getItem("token");
  const params = new URLSearchParams();

  // 1. Xử lý keyword (Username/Email)
  if (keyword) {
    params.append("username", keyword);
    params.append("email", keyword);
  }

  // 2. Xử lý status (Chỉ append nếu status không rỗng)
  if (status) {
    // Nếu Backend của bạn nhạy cảm với chữ hoa/thường, 
    // hãy thử status.toUpperCase() hoặc để nguyên status tùy theo API cũ.
    params.append("status", status); 
  }

  params.append("size", 50);
  params.append("page", 0);

  fetch(`/api/accounts/search?${params.toString()}`, {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => res.json())
    .then(r => {
       renderUsers(r.data || []);
       // Nếu bạn có dùng hàm sort, hãy gọi ở đây để danh sách luôn gọn
       if (typeof sortById === "function") sortById(); 
    })
    .catch(() => console.error("Lỗi tải danh sách"));
}

/* =======================
    2. RENDER TABLE (Vẽ bảng)
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
    tr.id = `user-row-${u.accountId}`; // Đặt ID để tìm dòng khi update
    tr.innerHTML = getRowHTML(u);
    tbody.appendChild(tr);
  });
}

// Hàm bổ trợ để tạo nội dung trong dòng <tr>
function getRowHTML(u) {
  // Thêm (u.roles || []) để tránh lỗi nếu roles bị null
  const rolesDisplay = (u.roles || []).join(", ");
  const statusClass = u.status ? u.status.toLowerCase() : "pending";
  const createdAt = u.createdAt ? u.createdAt.substring(0, 10) : "";

  return `
    <td>${u.accountId}</td>
    <td>${u.username}</td>
    <td>${u.email}</td>
    <td>${rolesDisplay}</td>
    <td class="status ${statusClass}">${u.status || "UNKNOWN"}</td>
    <td>${createdAt}</td>
    <td>
      <button class="view" data-id="${u.accountId}"><i class="fa-solid fa-eye"></i></button>
      <button class="edit" data-id="${u.accountId}"><i class="fa-solid fa-pen-to-square"></i></button>
      <button class="delete" data-id="${u.accountId}"><i class="fa-solid fa-ban"></i></button>
    </td>
  `;
}

/* =======================
    3. CẬP NHẬT TỪNG DÒNG (Partial Update)
======================= */
document.getElementById("saveUserBtn").onclick = async () => {
  const id = document.getElementById("editUserId").value;
  const status = document.getElementById("editStatus").value; // Lấy từ Select
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`/api/admin/accounts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      // ✅ CHỈ gửi status, tuyệt đối không gửi roles hay bất kỳ trường nào khác
      body: JSON.stringify({ 
        status: status.toLowerCase() 
      })
    });

    if (response.ok) {
      closeModal();
      // ✅ Chỉ cập nhật ô Status trên bảng
      patchStatusOnlyUI(id, status);
      console.log("Cập nhật Status thành công!");
    } else {
      const err = await response.json().catch(() => ({}));
      // Nếu vẫn lỗi, nghĩa là Backend bắt buộc phải gửi Role nhưng xử lý Role bị lỗi
      alert("Backend báo lỗi: " + (err.message || "Lỗi trùng lặp dữ liệu Role"));
    }
  } catch (error) {
    alert("Không thể kết nối server");
  }
};

// Hàm cập nhật duy nhất ô Status
function patchStatusOnlyUI(id, newStatus) {
  const row = document.getElementById(`user-row-${id}`);
  if (row) {
    const statusCell = row.cells[4]; // Cột số 5
    const lowStatus = newStatus.toLowerCase();
    
    statusCell.innerText = lowStatus; 
    statusCell.className = `status ${lowStatus}`;

    // Hiệu ứng để biết đã xong
    row.style.backgroundColor = "#e8f5e9";
    setTimeout(() => row.style.backgroundColor = "", 800);
  }
}

/* =======================
    5. DELETE/BAN USER (Xử lý xóa/khóa)
======================= */
function deleteUser(id) {
  // 1. Hỏi xác nhận trước khi xóa
  if (!confirm("Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này khỏi danh sách?")) return;

  const token = localStorage.getItem("token");

  // 2. Gửi lệnh xóa đến Backend
  fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (res.ok) {
        // ✅ 3. TÌM DÒNG VÀ XÓA HẲN KHỎI GIAO DIỆN
        const row = document.getElementById(`user-row-${id}`);
        if (row) {
          // Thêm một chút hiệu ứng thu nhỏ trước khi biến mất (tùy chọn)
          row.style.transition = "all 0.3s ease";
          row.style.transform = "scale(0.8)";
          row.style.opacity = "0";
          
          // Sau 0.3 giây thì xóa hẳn khỏi DOM
          setTimeout(() => {
            row.remove();
          }, 300);
          
          console.log(`Đã xóa sạch user ID: ${id}`);
        }
      } else {
        alert("Không thể xóa người dùng này (Có thể do ràng buộc dữ liệu ở Backend)");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Lỗi kết nối khi xóa!");
    });
}

/* =======================
    CÁC HÀM TIỆN ÍCH KHÁC (Giữ nguyên logic của bạn)
======================= */
function initFilterEvents() {
  const searchInput = document.querySelector(".search-input");
  const statusSelect = document.querySelector(".filters select");

  // Lọc khi gõ phím (Debounce 400ms)
  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => applyFilter(), 400));
  }

  // Lọc khi chọn Status
  if (statusSelect) {
    statusSelect.addEventListener("change", applyFilter);
  }
}

function applyFilter() {
  const keyword = document.querySelector(".search-input").value.trim();
  const statusSelect = document.querySelector(".filters select");
  let status = statusSelect.value;

  // ✅ Logic quan trọng: Nếu là giá trị mặc định thì coi như không lọc status
  if (status === "filterStatus") {
    status = "";
  }

  fetchUsers({
    keyword,
    status: status
  });
}

function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

// Event Delegation cho nút View/Edit/Delete
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  if (!id) return;

  if (btn.classList.contains("view")) openViewModal(id);
  if (btn.classList.contains("edit")) openEditModal(id);
  if (btn.classList.contains("delete")) deleteUser(id);
});

// Modal Control
const modal = document.getElementById("userModal");
const viewBox = document.getElementById("viewUserBox");
const editBox = document.getElementById("editUserBox");

function openModal() { modal.classList.remove("hidden"); }
function closeModal() { 
  modal.classList.add("hidden"); 
  viewBox.classList.remove("hidden");
  editBox.classList.add("hidden");
}
document.getElementById("closeModal").onclick = closeModal;
document.querySelector(".modal-overlay").onclick = closeModal;

// View Modal
function openViewModal(id) {
  const token = localStorage.getItem("token");
  fetch(`/api/accounts/${id}`, { headers: { Authorization: "Bearer " + token } })
    .then(res => res.json())
    .then(r => {
      const u = r.data;
      document.getElementById("detailId").innerText = u.accountId;
      document.getElementById("detailUsername").innerText = u.username;
      document.getElementById("detailEmail").innerText = u.email;
      document.getElementById("detailFullname").innerText = u.fullName;
      document.getElementById("detailPhone").innerText = u.phoneNumber || "-";
      document.getElementById("detailStatus").innerText = u.status;
      document.getElementById("detailRoles").innerText = u.roles.join(", ");
      openModal();
    });
}

// Edit Modal
function openEditModal(id) {
  const token = localStorage.getItem("token");
  fetch(`/api/accounts/${id}`, { headers: { Authorization: "Bearer " + token } })
    .then(res => res.json())
    .then(r => {
      const u = r.data;
      viewBox.classList.add("hidden");
      editBox.classList.remove("hidden");
      document.getElementById("editUserId").value = u.accountId;
      document.getElementById("editStatus").value = u.status.toUpperCase();
      document.querySelectorAll(".role-group input").forEach(cb => (cb.checked = u.roles.includes(cb.value)));
      openModal();
    });
}

// Gán sự kiện cho nút Add New User
document.getElementById("addUserBtn").addEventListener("click", () => {
    const modal = document.getElementById("addModal");
    const iframe = document.getElementById("signupFrame");
    
    // Gán URL kèm mode=admin vào iframe
    iframe.src = "/screen/guest/signup.html?mode=admin";
    
    // Hiển thị modal
    modal.classList.remove("hidden");
});

// Hàm đóng modal
function closeAddModal() {
    const modal = document.getElementById("addModal");
    const iframe = document.getElementById("signupFrame");
    
    modal.classList.add("hidden");
    iframe.src = ""; // Xóa src để reset form cho lần sau
}

let isAscending = true; // Biến để theo dõi trạng thái sắp xếp

function sortById(forceAscending = null) {
  const tbody = document.getElementById("userTableBody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  if (rows.length === 0 || rows[0].innerText.includes("No users")) return;

  // Nếu forceAscending được truyền vào, dùng nó. Nếu không, dùng trạng thái hiện tại.
  const direction = (forceAscending !== null) ? forceAscending : isAscending;

  rows.sort((rowA, rowB) => {
    const idA = parseInt(rowA.cells[0].innerText);
    const idB = parseInt(rowB.cells[0].innerText);
    return direction ? idA - idB : idB - idA;
  });

  tbody.innerHTML = "";
  rows.forEach(row => tbody.appendChild(row));

  // Chỉ đảo chiều logic cho lần nhấn nút thủ công
  if (forceAscending === null) {
    isAscending = !isAscending;
    updateSortIcon();
  }
}

// Hàm cập nhật icon để người dùng biết đang sort hướng nào
function updateSortIcon() {
  const icon = document.querySelector("#idHeader i");
  if (isAscending) {
    icon.className = "fa-solid fa-sort-up";
  } else {
    icon.className = "fa-solid fa-sort-down";
  }
}
/* =======================
    6. XỬ LÝ KHI THÊM MỚI THÀNH CÔNG (Từ Iframe)
======================= */
window.addEventListener("message", (event) => {
    if (event.data.type === "SIGNUP_SUCCESS") {
        const newUser = event.data.user;
        if (!newUser) return;

        closeAddModal();
        addNewUserToTable(newUser);
        console.log("Admin: Thêm thành công user", newUser.username);
    }
});

function addNewUserToTable(u) {
    const tbody = document.getElementById("userTableBody");
    
    if (tbody.innerHTML.includes("No users found")) {
        tbody.innerHTML = "";
    }

    const tr = document.createElement("tr");
    tr.id = `user-row-${u.accountId}`;
    tr.innerHTML = getRowHTML(u);
    
    // Thêm vào đầu bảng
    tbody.prepend(tr);
    
    // Hiệu ứng
    tr.style.backgroundColor = "#d4edda";
    setTimeout(() => tr.style.backgroundColor = "", 2000);

    // Sắp xếp lại nhưng KHÔNG làm đảo chiều icon của người dùng
    // Ví dụ: Luôn giữ đúng trật tự hiện tại
    sortById(!isAscending); 
}