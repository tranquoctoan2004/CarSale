// 1. ĐỔI LẠI ĐÚNG VỚI @RequestMapping của Controller
const API_BASE = "/api/orders"; 

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "/screen/user/login.html";
        return null;
    }
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Khớp với @RequestHeader("Authorization")
    };
};

// ================== LOAD CART ==================
// ================== LOAD CART ==================
function loadCart() {
    const headers = getAuthHeaders();
    if (!headers) return;

    // Lấy UserId từ LocalStorage (Ví dụ: 26 hoặc 27)
    const userId = localStorage.getItem("userId");

    // Gọi API lấy danh sách Order theo AccountId
    fetch(`/api/orders/user/${userId}`, { 
        method: "GET",
        headers: headers 
    })
    .then(res => res.json())
    .then(result => {
        console.log("Dữ liệu nhận được:", result);
        if (result.success) {
            // TRUYỀN THẲNG result.data (là mảng các Order) vào hàm render
            renderCart(result.data);
        } else {
            document.getElementById("cart-items").innerHTML = `<p>${result.message}</p>`;
        }
    })
    .catch(err => {
        console.error("Lỗi:", err);
        document.getElementById("cart-items").innerHTML = "<p>Không thể kết nối máy chủ</p>";
    });
}

// ================== RENDER CART ==================
function renderCart(orders) {
    const container = document.getElementById("cart-items");
    const totalElement = document.getElementById("total-price");
    container.innerHTML = "";

    if (!orders || orders.length === 0) {
        container.innerHTML = "<div class='empty-msg'>🛒 Giỏ hàng (Đơn hàng chờ) trống.</div>";
        totalElement.innerText = "$0.00"; 
        return;
    }

    let grandTotal = 0;

    orders.forEach(order => {
        // Cộng dồn tổng tiền từ cột total_price của bảng orders
        grandTotal += order.totalPrice;

        // Nếu bảng order_details đã được Join, chúng ta lấy thông tin xe
        // Ở đây tôi giả định mỗi Order có danh sách orderDetails bên trong
        const detailsHtml = order.orderDetails ? order.orderDetails.map(detail => `
            <div style="font-size: 0.9rem; color: #555;">
                🚗 Xe: ${detail.car.carName} | SL: ${detail.quantity}
            </div>
        `).join('') : `<div style="color: gray;">Mã đơn: #${order.orderId}</div>`;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.style = "border-bottom: 1px solid #eee; padding: 10px; margin-bottom: 10px;";
        
        div.innerHTML = `
            <div class="cart-info">
                <h4>Đơn hàng #${order.orderId}</h4>
                ${detailsHtml}
                <p>Ngày đặt: <b>${new Date(order.orderDate).toLocaleDateString()}</b></p>
                <p>Trạng thái: <span style="color: orange;">${order.orderStatus}</span></p>
                <p>Tổng đơn: <b class="price-text">${formatMoney(order.totalPrice)}</b></p>
            </div>
            <button class="btn-remove" onclick="removeItem(${order.orderId})">
                ❌ Hủy đơn
            </button>
        `;
        container.appendChild(div);
    });

    totalElement.innerText = formatMoney(grandTotal);
}

// ================== REMOVE ITEM ==================
function removeItem(carId) {
    const headers = getAuthHeaders();
    if (!headers) return;

    // Khớp với @DeleteMapping("/items/{carId}") trong Controller
    fetch(`${API_BASE}/items/${carId}`, {
        method: "DELETE",
        headers: headers
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) loadCart();
    });
}

// ================== CLEAR ALL ==================
function clearCart() {
    if (!confirm("Clear all?")) return;
    const headers = getAuthHeaders();
    // Khớp với @DeleteMapping("/clear") trong Controller
    fetch(`${API_BASE}/clear`, {
        method: "DELETE",
        headers: headers
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) loadCart();
    });
}

// (Các hàm checkout và formatMoney giữ nguyên...)