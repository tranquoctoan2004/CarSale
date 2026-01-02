// ⚡ CẤU HÌNH ĐỒNG BỘ VỚI LOGIN
const STORAGE_KEYS = {
    TOKEN: "token",  // Đã sửa từ 'userToken' thành 'token'
    USER: "user"     // Key chứa object thông tin người dùng
};

// ⚡ BIẾN TOÀN CỤC
let currentUserId = null;
let searchTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    initUserHome();
});

// 1. Khởi tạo trang
function initUserHome() {
    checkLoginStatus();
    loadBestsellers(); // Hàm này bạn đã có logic riêng
    loadComments();    // Tải bình luận khi mở trang
}

// 2. Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    const welcomeMsg = document.getElementById('welcomeMessage');
    
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            currentUserId = user.accountId; // Lấy ID để kiểm tra quyền sửa/xóa
            
            if (welcomeMsg) {
                welcomeMsg.innerText = `Welcome back, ${user.fullName || user.username}!`;
            }
        } catch (e) {
            console.error("Lỗi parse thông tin user:", e);
        }
    }
}

// 3. Lấy Token từ Local Storage
function getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// 4. Tải danh sách bình luận (Có hỗ trợ tìm kiếm)
async function loadComments(username = "") {
    const url = username 
        ? `/api/comments/search?username=${encodeURIComponent(username)}`
        : `/api/comments`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
            renderComments(result.data);
        }
    } catch (error) {
        console.error("Không thể tải bình luận:", error);
    }
}

// 5. Hiển thị bình luận lên HTML
function renderComments(comments) {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    if (!comments || comments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No reviews found.</p>';
        return;
    }

    container.innerHTML = comments.map(cmt => `
        <div class="review">
            <div class="review-header">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.fullName)}&background=ffcc00&color=fff" class="review-avatar">
                <div class="review-info">
                    <h4>${cmt.fullName} <span style="font-size: 12px; color: #888;">(@${cmt.username})</span></h4>
                    <span class="review-date">${cmt.reviewDate}</span>
                </div>
            </div>
            <div class="review-rating" style="color: #ffcc00; margin-bottom: 8px;">
                ${'★'.repeat(cmt.rating)}${'☆'.repeat(5 - cmt.rating)}
            </div>
            <p class="review-text">${cmt.content}</p>
            
            ${cmt.accountId === currentUserId ? `
                <div class="review-actions">
                    <button class="btn-action btn-edit" title="Edit" onclick="prepareEdit(${cmt.commentId}, '${cmt.content.replace(/'/g, "\\'")}', ${cmt.rating})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn-action btn-delete" title="Delete" onclick="deleteComment(${cmt.commentId})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 6. Xử lý Gửi bình luận (Thêm mới hoặc Cập nhật)
async function handleCommentSubmit() {
    const token = getAuthToken();
    const content = document.getElementById('commentInput').value.trim();
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const editingId = document.getElementById('editingCommentId').value;

    // Kiểm tra đầu vào
    if (!token) {
        alert("Please login to perform this action!");
        return;
    }
    if (!content) {
        alert("Please enter your comment content.");
        return;
    }

    const rating = ratingElement ? parseInt(ratingElement.value) : 5;
    const payload = { content, rating };
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/comments/${editingId}` : `/api/comments`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Gửi token theo chuẩn Bearer
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert(editingId ? "Comment updated!" : "Comment posted!");
            resetCommentForm();
            loadComments(); // Tải lại danh sách
        } else {
            alert(result.message || "Something went wrong!");
        }
    } catch (error) {
        console.error("Lỗi gửi bình luận:", error);
        alert("Server error. Please try again later.");
    }
}

// 7. Chế độ Chỉnh sửa
function prepareEdit(id, content, rating) {
    document.getElementById('formTitle').innerText = "Edit Your Review";
    document.getElementById('editingCommentId').value = id;
    document.getElementById('commentInput').value = content;
    
    // Check đúng số sao đã đánh giá
    const starRadio = document.getElementById(`st${rating}`);
    if (starRadio) starRadio.checked = true;

    document.getElementById('btnSubmitCmt').innerText = "Update Review";
    document.getElementById('btnCancelEdit').style.display = "inline-block";
    
    // Cuộn xuống form
    document.querySelector('.comment-form-box').scrollIntoView({ behavior: 'smooth' });
}

// 8. Xóa bình luận
async function deleteComment(id) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    const token = getAuthToken();
    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            loadComments();
        } else {
            const res = await response.json();
            alert(res.message || "Could not delete comment.");
        }
    } catch (error) {
        alert("Network error.");
    }
}

// 9. Reset Form
function resetCommentForm() {
    document.getElementById('formTitle').innerText = "Leave a Comment";
    document.getElementById('editingCommentId').value = "";
    document.getElementById('commentInput').value = "";
    document.getElementById('st5').checked = true;
    document.getElementById('btnSubmitCmt').innerText = "Submit Review";
    document.getElementById('btnCancelEdit').style.display = "none";
}

// 10. Tìm kiếm thông minh (Debounce)
function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const val = document.getElementById('searchUserCmt').value.trim();
        loadComments(val);
    }, 600);
}

// Hàm giả lập (Placeholder) cho logic load xe cũ của bạn
function loadBestsellers() {
    console.log("Bestsellers data being fetched...");
}