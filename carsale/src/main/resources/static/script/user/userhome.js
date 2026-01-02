// Khai báo biến toàn cục để lưu danh sách xe tương tự Admin
window.userCarList = []; 

document.addEventListener("DOMContentLoaded", function () {
    const carContainer = document.getElementById("bestseller-container");

    async function loadBestseller() {
        try {
            const response = await fetch('http://localhost:8080/api/cars');
            const result = await response.json();
            
            if (result.success && Array.isArray(result.data)) {
                // Lưu dữ liệu vào biến toàn cục để dùng cho hàm showDetails nhanh
                window.userCarList = result.data; 
                
                renderCars(result.data.slice(0, 4));
                document.getElementById("welcomeMessage").textContent = "Our Top 4 Selection for You";
            }
        } catch (error) {
            console.error("Fetch error:", error);
            carContainer.innerHTML = "<p style='grid-column: span 4;'>Server Error.</p>";
        }
    }

    function renderCars(cars) {
        carContainer.innerHTML = "";
        cars.forEach(car => {
            const id = car.carId || car.id;
            const imgPath = car.imageUrl ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
            
            // Format giá tiền đẹp theo chuẩn quốc tế giống code Admin của bạn
            const formattedPrice = new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'USD' 
            }).format(car.price);

            const carHtml = `
                <div class="card">
                    <div class="img">
                        <img src="${imgPath}" onerror="this.src='https://via.placeholder.com/400x250?text=Error';">
                    </div>
                    <div class="car-info">
                        <h4 style="margin: 5px 0;">${car.carName}</h4>
                        <p class="price-tag">${formattedPrice}</p>
                    </div>
                    <div class="actions">
                        <button onclick="showDetails(${id})">ⓘ Details</button>
                        <button onclick="addToCart(${id})">🛒 Cart</button>
                    </div>
                </div>`;
            carContainer.insertAdjacentHTML('beforeend', carHtml);
        });
    }

    loadBestseller();
});

// --- LOGIC HIỂN THỊ CHI TIẾT (ÁP DỤNG TỪ CODE ADMIN CỦA BẠN) ---
function showDetails(carId) {
    // Tìm xe trong danh sách đã load sẵn (không cần fetch lại)
    const car = window.userCarList.find(c => (c.carId || c.id) === carId);
    
    if (!car) {
        console.error("Car not found!");
        return;
    }

    const modal = document.getElementById("carModal");
    
    // Gán dữ liệu vào Modal (sử dụng các ID có trong HTML trang chủ của bạn)
    document.getElementById("modalTitle").textContent = car.carName;
    document.getElementById("modalPrice").textContent = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(car.price);
    
    // Description lấy từ DB, nếu không có thì để mặc định
    document.getElementById("modalDesc").textContent = car.description || "Experience luxury and performance with our premium " + car.brand + " models.";
    
    // Xử lý ảnh
    const imgPath = car.imageUrl ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
    document.getElementById("modalImg").src = imgPath;

    // Gán ID cho nút Add to Cart trong Modal
    document.getElementById("modalCartBtn").onclick = () => addToCart(carId);

    // Hiển thị Modal
    modal.style.display = "block";
}

function closeModal() {
    document.getElementById("carModal").style.display = "none";
}

// Đóng modal khi bấm ra ngoài vùng nội dung
window.onclick = function(event) {
    const modal = document.getElementById("carModal");
    if (event.target == modal) closeModal();
}
function goToCarsPage() {
    // Chuyển hướng sang trang danh sách xe
    // Bạn có thể thay đổi đường dẫn phù hợp với router của bạn (ví dụ: '/car', '/cars.html', v.v.)
    window.location.href = 'screen/user/car.html'; 
}