// ⚡ SYNC CONFIGURATION WITH LOGIN
const STORAGE_KEYS = {
    TOKEN: "token", 
    USER: "user"    
};

// ⚡ GLOBAL VARIABLES
let currentUserId = null;
let searchTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    initUserHome();
});

// 1. Initialize Page
function initUserHome() {
    checkLoginStatus();
    loadComments(); 
}

// 2. Check Login Status to get AccountId
function checkLoginStatus() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            currentUserId = user.accountId;
        } catch (e) {
            // Error parsing user data
        }
    }
}

// 3. Get Bearer Token
function getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

// 4. Load Comments (Anti-cache enabled)
async function loadComments(username = "") {
    const v = new Date().getTime(); 
    const url = username 
        ? `/api/comments/search?username=${encodeURIComponent(username)}&v=${v}`
        : `/api/comments?v=${v}`;

    try {
        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
            renderComments(result.data);
        }
    } catch (error) {
        // Silent catch for loading errors
    }
}

// 5. Render Comments to HTML
function renderComments(comments) {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    if (!comments || comments.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No comments found.</p>';
        return;
    }

    container.innerHTML = comments.map(cmt => `
        <div class="review" style="position: relative; border-bottom: 1px solid #eee; padding: 15px 0;">
            <div class="review-header" style="display: flex; align-items: center; gap: 10px;">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(cmt.fullName)}&background=ffcc00&color=fff" 
                     style="width: 40px; height: 40px; border-radius: 50%;">
                <div class="review-info">
                    <h4 style="margin: 0;">${cmt.fullName} <small style="color: #888;">(@${cmt.username})</small></h4>
                    <span style="font-size: 11px; color: #bbb;">${cmt.reviewDate}</span>
                </div>
            </div>
            <div style="color: #ffcc00; margin: 5px 0;">
                ${'★'.repeat(cmt.rating)}${'☆'.repeat(5 - cmt.rating)}
            </div>
            <p style="margin: 8px 0; color: #444;">${cmt.content}</p>
            
            ${cmt.accountId === currentUserId ? `
                <div class="review-actions" style="position: absolute; top: 10px; right: 0;">
                    <button onclick="prepareEdit(${cmt.commentId}, '${cmt.content.replace(/'/g, "\\'")}', ${cmt.rating})" 
                            style="background:none; border:none; color: #3498db; cursor:pointer; margin-right: 10px;">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button onclick="deleteComment(${cmt.commentId})" 
                            style="background:none; border:none; color: #e74c3c; cursor:pointer;">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// 6. Handle Submit (POST & PUT)
async function handleCommentSubmit() {
    const token = getAuthToken();
    const content = document.getElementById('commentInput').value.trim();
    const ratingElement = document.querySelector('input[name="rating"]:checked');
    const editingId = document.getElementById('editingCommentId').value;

    if (!token) {
        alert("Please login to post a comment!");
        return;
    }
    if (!content) {
        alert("Content cannot be empty!");
        return;
    }

    const payload = {
        content: content,
        rating: ratingElement ? parseInt(ratingElement.value) : 5
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/comments/${editingId}` : `/api/comments`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            alert(editingId ? "✅ Updated successfully!" : "✅ Posted successfully!");
            resetCommentForm();
            loadComments(); 
        } else {
            alert(" Failed: " + (result.message || "Internal Server Error"));
        }
    } catch (error) {
        alert(" Server connection error!");
    }
}

// 7. Edit Mode: Populate Form
function prepareEdit(id, content, rating) {
    document.getElementById('formTitle').innerText = "Edit Your Review";
    document.getElementById('editingCommentId').value = id; 
    document.getElementById('commentInput').value = content;
    
    const starRadio = document.getElementById(`st${rating}`);
    if (starRadio) starRadio.checked = true;

    document.getElementById('btnSubmitCmt').innerText = "Update Now";
    document.getElementById('btnCancelEdit').style.display = "inline-block";
    
    document.querySelector('.comment-form-box').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('commentInput').focus();
}

// 8. Delete Comment
async function deleteComment(id) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    
    const token = getAuthToken();

    try {
        const response = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert(" Comment deleted successfully!");
            loadComments(); 
        } else {
            alert(" Delete failed: " + (result.message || "You don't have permission"));
        }
    } catch (error) {
        alert(" Network error!");
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

// 10. Search Debounce
function debounceSearch() {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const val = document.getElementById('searchUserCmt').value.trim();
        loadComments(val);
    }, 600);
}