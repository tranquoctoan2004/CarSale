// ================== CONFIG ==================
const API_BASE = "/api/cart";

// Hàm hỗ trợ lấy Token và tạo Headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/screen/guest/login.html";
        return null;
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
};

// ================== LOAD CART ==================
function loadCart() {
    const headers = getAuthHeaders();
    if (!headers) return;

    fetch(API_BASE, { 
        method: "GET",
        headers: headers 
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            renderCart(result.data);
        } else {
            console.error("Lỗi từ server:", result.message);
            document.getElementById("cart-items").innerHTML = `<p>${result.message}</p>`;
        }
    })
    .catch(err => {
        console.error("Fetch error:", err);
        document.getElementById("cart-items").innerHTML = "<p>Không thể kết nối máy chủ</p>";
    });
}

// ================== RENDER CART ==================
function renderCart(cartData) {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("total-price");
    container.innerHTML = "";

    // Sửa hiển thị 0 thành $0.00
    if (!cartData || !cartData.items || cartData.items.length === 0) {
        container.innerHTML = "<div class='empty-msg'>🛒 Your cart is empty.</div>";
        totalElement.innerText = "$0.00"; 
        return;
    }

    cartData.items.forEach(item => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div class="cart-info">
                <h4>${item.carName}</h4>
                <p>Unit Price: <span class="price-text">${formatMoney(item.price)}</span></p>
                <p>Quantity: <b>${item.quantity}</b></p>
            </div>
            <button class="btn-remove" onclick="removeItem(${item.carId})">
                ❌ Remove
            </button>
        `;
        container.appendChild(div);
    });

    totalElement.innerText = formatMoney(cartData.totalPrice);
}

// ================== REMOVE 1 ITEM ==================
function removeItem(carId) {
    const headers = getAuthHeaders();
    if (!headers) return;

    fetch(`${API_BASE}/items/${carId}`, {
        method: "DELETE",
        headers: headers
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            loadCart(); 
        } else {
            alert("Error: " + result.message);
        }
    });
}

// ================== CLEAR ALL ==================
function clearCart() {
    if (!confirm("Are you sure you want to clear your cart?")) return;
    
    const headers = getAuthHeaders();
    fetch(`${API_BASE}/clear`, {
        method: "DELETE",
        headers: headers
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) loadCart();
    });
}

// ================== CHECKOUT ==================
function checkout() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to proceed to payment.");
        window.location.href = "/screen/user/login.html";
        return;
    }

    // Kiểm tra xem giỏ hàng có trống không trước khi thanh toán
    const container = document.getElementById("cart-items");
    if (container.querySelector(".empty-msg")) {
        alert("Your cart is empty!");
        return;
    }

    // Chuyển hướng sang trang payment
    window.location.href = "/screen/user/payment.html";
}

// Sửa hàm định dạng sang USD
function formatMoney(amount) {
    if (amount === undefined || amount === null) return "$0.00";
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

document.addEventListener("DOMContentLoaded", loadCart);