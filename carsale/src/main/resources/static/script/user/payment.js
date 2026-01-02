const CONFIG = {
    API_ME: "/api/accounts/me",
    API_CART: "/api/cart",
    API_ORDER: "/api/orders",
    TOKEN_KEY: "token"
};

const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    initPaymentPage();
});

async function initPaymentPage() {
    const token = localStorage.getItem(CONFIG.TOKEN_KEY);
    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "/screen/guest/login.html";
        return;
    }
    await Promise.all([loadProfile(), loadCartDetails()]);
}

// 1. Tải Profile (Username, Email, Name, Phone)
async function loadProfile() {
    try {
        const res = await fetch(CONFIG.API_ME, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_KEY)}` }
        });
        const result = await res.json();

        if (result.success && result.data) {
            const user = result.data;
            $('username').value = user.username || "";
            $('email').value = user.email || "";
            $('fullName').value = user.fullName || "";
            $('phoneNumber').value = user.phoneNumber || "";
            
            // Nội dung chuyển khoản: USERNAME + ORDER
            $('transfer-note').innerHTML = `<strong>"${(user.username || 'USER').toUpperCase()} ORDER"</strong>`;
        }
    } catch (err) {
        console.error("Profile error", err);
    }
}

// 2. Tải Giỏ hàng (Danh sách xe + Tổng tiền)
async function loadCartDetails() {
    try {
        const res = await fetch(CONFIG.API_CART, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_KEY)}` }
        });
        const result = await res.json();

        if (result.success && result.data) {
            const cart = result.data;
            const listContainer = $('order-items-list');
            listContainer.innerHTML = ""; // Xóa chữ Loading

            if (cart.items.length === 0) {
                alert("Your cart is empty!");
                window.location.href = "/screen/user/cart.html";
                return;
            }

            // Render danh sách xe
            cart.items.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.className = "order-item-row";
                itemDiv.innerHTML = `
                    <span class="car-name">${item.carName}</span>
                    <span class="car-qty">x${item.quantity}</span>
                `;
                listContainer.appendChild(itemDiv);
            });

            $('display-total').innerText = formatUSD(cart.totalPrice);
        }
    } catch (err) {
        console.error("Cart error", err);
    }
}

// 3. Submit
$('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!confirm("Confirm your payment and order?")) return;

    const orderData = {
        phoneNumber: $('phoneNumber').value,
        paymentMethod: "BANKING"
    };

    try {
        const res = await fetch(CONFIG.API_ORDER, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(CONFIG.TOKEN_KEY)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if ((await res.json()).success) {
            alert("🎉 Success! Your order is being processed.");
            window.location.href = "/screen/user/orders.html";
        }
    } catch (err) {
        alert("Server error.");
    }
});

function formatUSD(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}