const API_BASE = '/api/admin/comments';
let currentReplyId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadComments();

    // Lắng nghe sự kiện Search
    document.getElementById('searchInput').addEventListener('input', debounce(loadComments, 500));
    document.getElementById('statusFilter').addEventListener('change', loadComments);

    // Nút xác nhận gửi Reply
    document.getElementById('confirmReplyBtn').addEventListener('click', submitReply);
});

// 1. Tải danh sách bình luận
async function loadComments() {
    const search = document.getElementById('searchInput').value;
    const status = document.getElementById('statusFilter').value;
    const token = localStorage.getItem('token'); // Lấy JWT từ localStorage

    try {
        // Gọi API với phân trang và filter (đã khớp với Backend ở bước trước)
        const response = await fetch(`${API_BASE}?content=${search}&status=${status}&page=0&size=50`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (result.success) {
            renderTable(result.data);
            document.getElementById('commentCount').innerText = result.data.length;
        }
    } catch (error) {
        console.error("Failed to load comments", error);
    }
}

// 2. Hiển thị dữ liệu lên bảng
function renderTable(comments) {
    const tbody = document.getElementById('commentTableBody');
    tbody.innerHTML = '';

    comments.forEach(comment => {
        // Row chính
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${comment.commentId}</td>
            <td><strong>${comment.fullName}</strong><br><small>@${comment.username}</small></td>
            <td>${comment.content}</td>
            <td>${"⭐".repeat(comment.rating)}</td>
            <td>${comment.reviewDate}</td>
            <td>
                <button class="reply" onclick="openReplyModal(${comment.commentId}, '${comment.fullName}')">
                    <i class="fa-solid fa-reply"></i>
                </button>
                <button class="delete" onclick="deleteComment(${comment.commentId})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);

        // Row phụ cho Admin Reply (nếu có)
        if (comment.adminReply) {
            const replyRow = document.createElement('tr');
            replyRow.className = 'reply-row';
            replyRow.innerHTML = `
                <td colspan="6">
                    <div class="reply-box">
                        <strong>Admin (${comment.adminReply.adminName}):</strong>
                        <p>${comment.adminReply.content}</p>
                        <span class="reply-date">Replied on: ${comment.adminReply.createdAt}</span>
                    </div>
                </td>
            `;
            tbody.appendChild(replyRow);
        }
    });
}

// 3. Mở Modal Reply
function openReplyModal(id, name) {
    currentReplyId = id;
    document.getElementById('replyingTo').innerText = `Replying to: ${name}`;
    document.getElementById('replyContent').value = '';
    document.getElementById('replyModal').classList.add('active');
}

function closeModal() {
    document.getElementById('replyModal').classList.remove('active');
}

// 4. Gửi Reply về Backend
async function submitReply() {
    const content = document.getElementById('replyContent').value;
    const token = localStorage.getItem('token'); // Đảm bảo key này khớp với CONFIG.TOKEN_KEY

    // KIỂM TRA 1: Token có tồn tại không?
    if (!token || token === "null" || token === "undefined") {
        alert("Phiên làm việc hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/screen/guest/login.html"; // Đường dẫn trang login của bạn
        return;
    }

    if (!content.trim()) return alert("Please enter reply content!");

    try {
        const response = await fetch(`${API_BASE}/${currentReplyId}/reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token chuẩn
            },
            body: JSON.stringify({ content: content })
        });

        // Đọc kết quả từ server
        const result = await response.json();

        if (response.ok && result.success) {
            alert("Reply submitted!");
            closeModal();
            loadComments();
        } else {
            alert("Lỗi: " + (result.message || "Không thể gửi phản hồi"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hệ thống gặp sự cố khi gửi reply.");
    }
}

// 5. Xóa Comment
async function deleteComment(id) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            loadComments();
        }
    } catch (error) {
        alert("Delete failed");
    }
}

// Hàm bổ trợ debounce để search không bị gọi API liên tục
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}