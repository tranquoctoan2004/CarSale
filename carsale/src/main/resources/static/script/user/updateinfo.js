// ⚡ CẤU HÌNH (Khớp với trang Login của bạn)
const CONFIG = {
    TOKEN_KEY: "token",
    USER_KEY: "user",
    API_ME: "/api/accounts/me"
};

const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', function() {
    loadMyProfile();
});

// 1. Tải thông tin cá nhân khi vào trang
async function loadMyProfile() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    
    if (!token) {
        alert("Phiên đăng nhập hết hạn!");
        window.location.href = "/screen/guest/login.html";
        return;
    }

    try {
        const response = await fetch(CONFIG.API_ME, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok && result.data) {
            const user = result.data;
            if($('username'))    $('username').value = user.username || "";
            if($('fullName'))    $('fullName').value = user.fullName || "";
            if($('email'))       $('email').value = user.email || "";
            if($('phoneNumber')) $('phoneNumber').value = user.phoneNumber || "";
        }
    } catch (error) {
        console.error("Lỗi tải profile:", error);
    }
}

// 2. Xử lý khi nhấn nút Lưu (Cách 2: Quay về trang trước)
document.getElementById('updateProfileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    const updatedData = {
        fullName: $('fullName').value,
        email: $('email').value,
        phoneNumber: $('phoneNumber').value
    };

    try {
        const response = await fetch(CONFIG.API_ME, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            // Cập nhật lại cache local để trang trước đó hiển thị đúng tên mới
            let userLocal = JSON.parse(localStorage.getItem(CONFIG.USER_KEY) || "{}");
            userLocal.fullName = updatedData.fullName;
            userLocal.email = updatedData.email;
            userLocal.phoneNumber = updatedData.phoneNumber;
            localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(userLocal));

            alert("✅ Cập nhật thông tin thành công!");
            
            // QUAY VỀ TRANG TRƯỚC ĐÓ
            window.history.back(); 
        } else {
            const err = await response.json();
            alert("❌ Lỗi: " + (err.message || "Không thể cập nhật"));
        }
    } catch (error) {
        alert("❌ Lỗi kết nối máy chủ!");
        console.error(error);
    }
});