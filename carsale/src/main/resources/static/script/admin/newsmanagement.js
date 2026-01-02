const API_URL = '/api/admin/news';
const UPLOAD_BASE_URL = ''; // Đường dẫn hiển thị ảnh từ server
window.newsList = []; // Lưu trữ danh sách tin tức để dùng cho hàm View/Edit nhanh

// --- 1. TIỆN ÍCH HỖ TRỢ (DEBOUNCE & AUTH) ---

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getAuthHeader() {
    // Lưu ý: Đảm bảo key 'token' đồng nhất với bên Car
    const token = localStorage.getItem('token'); 
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// --- 2. KHỞI TẠO KHI TRANG LOAD ---

document.addEventListener('DOMContentLoaded', () => {
    // Load dữ liệu lần đầu
    fetchNews();

    // Thiết lập Tự động Search khi gõ phím
    const searchInput = document.getElementById('newsSearchInput');
    const statusSelect = document.getElementById('newsStatusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            console.log("Searching news...");
            fetchNews();
        }, 500));
    }

    if (statusSelect) {
        statusSelect.addEventListener('change', fetchNews);
    }

    // Xử lý Form Submit (Thêm/Sửa)
    const addNewsForm = document.getElementById('addNewsForm');
    if (addNewsForm) {
        addNewsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveNews();
        });
    }
});

// --- 3. XỬ LÝ DỮ LIỆU (FETCH & RENDER) ---

async function fetchNews() {
    const keyword = document.getElementById('newsSearchInput').value;
    const status = document.getElementById('newsStatusFilter').value;
    
    // Tạo tham số query
    const params = new URLSearchParams({ 
        title: keyword, 
        status: status, 
        page: 0, 
        size: 50 
    });

    try {
        const response = await fetch(`${API_URL}?${params}`, {
            headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "/login";
            return;
        }

        const result = await response.json();
        const tbody = document.getElementById('newsTableBody');

        if (result.success && result.data.content) {
            window.newsList = result.data.content; 
            const totalItems = result.data.totalElements;
            document.getElementById('totalNews').innerText = `${totalItems} Items`;

            const htmlRows = window.newsList.map(news => {
                const imgPath = news.imageUrl ? UPLOAD_BASE_URL + news.imageUrl : '/images/no-image-news.png';
                const formattedDate = new Date(news.date).toLocaleDateString('vi-VN');
                const statusClass = news.status ? news.status.toLowerCase() : 'draft';

                return `
                    <tr>
                        <td>${news.newsId}</td>
                        <td>
                            <img src="${imgPath}" style="width:60px;height:40px;object-fit:cover;border-radius:4px" 
                                 onerror="this.src='/images/no-image-news.png'">
                        </td>
                        <td><strong title="${news.title}">${news.title}</strong></td>
                        <td>${news.authorName || 'Admin'}</td>
                        <td>${formattedDate}</td>
                        <td><span class="badge ${getStatusBadgeClass(statusClass)}">${news.status}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="btn-icon btn-view" onclick="viewNewsDetail(${news.newsId})" title="View Detail"><i class="fa-solid fa-eye"></i></button>
                                <button class="btn-icon btn-edit" onclick="openEditNewsModal(${news.newsId})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                                <button class="btn-icon btn-delete" onclick="deleteNews(${news.newsId})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            tbody.innerHTML = htmlRows || '<tr><td colspan="7" style="text-align:center">No news articles found</td></tr>';
        }
    } catch (error) {
        console.error("Fetch news error:", error);
    }
}

// Hàm bổ trợ đổi màu badge theo status (Đã tối ưu trong CSS chung)
function getStatusBadgeClass(status) {
    if (status === 'published') return 'badge-success';
    if (status === 'draft') return 'badge-warning';
    return 'badge-secondary';
}

// --- 4. QUẢN LÝ CHI TIẾT & MODAL ---

function viewNewsDetail(newsId) {
    const news = window.newsList.find(n => n.newsId === newsId);
    if (!news) return;

    document.getElementById("viewNewsTitle").value = news.title || "";
    document.getElementById("viewNewsAuthor").value = news.authorName || "Admin";
    document.getElementById("viewNewsDate").value = new Date(news.date).toLocaleString('vi-VN');
    document.getElementById("viewNewsStatus").value = news.status || "";
    document.getElementById("viewNewsContent").value = news.content || "";

    const viewImg = document.getElementById("viewNewsImage");
    if (viewImg) viewImg.src = news.imageUrl ? UPLOAD_BASE_URL + news.imageUrl : "/images/no-image-news.png";

    // Gán ID vào nút edit của modal view để mở nhanh
    document.getElementById('btnEditFromView').onclick = () => {
        closeViewNewsModal();
        openEditNewsModal(newsId);
    };

    document.getElementById("viewNewsModal").style.display = "block";
}

function openAddNewsModal() {
    document.getElementById('modalTitle').innerText = "Add New Article";
    document.getElementById('addNewsForm').reset();
    document.getElementById('newsId').value = ""; 
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('addNewsModal').style.display = 'block';
}

// Vì news có content dài, nên gọi detail từ server hoặc lấy từ list
async function openEditNewsModal(newsId) {
    const news = window.newsList.find(n => n.newsId === newsId);
    if (!news) return;

    document.getElementById('modalTitle').innerText = "Edit News Article";
    document.getElementById('newsId').value = news.newsId;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsStatus').value = news.status.toLowerCase();
    document.getElementById('newsContent').value = news.content;
    
    if (news.imageUrl) {
        document.getElementById('imgPreview').src = UPLOAD_BASE_URL + news.imageUrl;
        document.getElementById('previewContainer').style.display = 'block';
    } else {
        document.getElementById('previewContainer').style.display = 'none';
    }

    document.getElementById('addNewsModal').style.display = 'block';
}

// --- 5. LỆNH XÓA & LƯU ---

async function saveNews() {
    const form = document.getElementById('addNewsForm');
    const formData = new FormData(form);
    const newsId = document.getElementById('newsId').value;

    const url = newsId ? `${API_URL}/${newsId}` : API_URL;
    const method = newsId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeader(),
            body: formData // Gửi FormData để upload ảnh
        });

        const result = await response.json();
        if (result.success) {
            alert("Article saved successfully!");
            closeAddNewsModal();
            fetchNews();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("Server error!");
    }
}

async function deleteNews(id) {
    if (confirm("Are you sure you want to delete this article?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE', 
                headers: getAuthHeader() 
            });
            const result = await response.json();
            if (result.success) fetchNews();
            else alert(result.message);
        } catch (error) {
            alert("Could not delete article.");
        }
    }
}

// Đóng modal
function closeAddNewsModal() { document.getElementById('addNewsModal').style.display = 'none'; }
function closeViewNewsModal() { document.getElementById('viewNewsModal').style.display = 'none'; }

// Click ra ngoài đóng modal
window.onclick = function (event) {
    const addModal = document.getElementById('addNewsModal');
    const viewModal = document.getElementById('viewNewsModal');
    if (event.target == addModal) closeAddNewsModal();
    if (event.target == viewModal) closeViewNewsModal();
}