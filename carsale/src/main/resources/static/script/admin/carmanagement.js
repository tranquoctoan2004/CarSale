const API_URL = '/api/admin/cars';
window.carList = []; // Lưu trữ danh sách xe để dùng cho hàm View/Edit nhanh

// --- 1. TIỆN ÍCH HỖ TRỢ (DEBOUNCE & AUTH) ---

// Hàm trì hoãn thực thi: giúp đợi người dùng ngừng gõ 500ms mới gọi API
function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Lấy Token từ LocalStorage
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// --- 2. KHỞI TẠO KHI TRANG LOAD ---

document.addEventListener('DOMContentLoaded', () => {
    // Load dữ liệu lần đầu
    fetchCars();

    // Thiết lập Tự động Search khi gõ phím
    const searchInput = document.getElementById('searchKeyword');
    const statusSelect = document.getElementById('searchStatus');

    if (searchInput) {
        // Lắng nghe sự kiện 'input' thay vì chờ nhấn nút
        searchInput.addEventListener('input', debounce(() => {
            console.log("Auto searching...");
            fetchCars();
        }, 500));
    }

    if (statusSelect) {
        // Dropdown thay đổi là gọi API luôn
        statusSelect.addEventListener('change', fetchCars);
    }

    // Xử lý Form Submit (Thêm/Sửa)
    const addCarForm = document.getElementById('addCarForm');
    if (addCarForm) {
        addCarForm.addEventListener('submit', function (e) {
            e.preventDefault();
            saveCar();
        });
    }
});

// --- 3. XỬ LÝ DỮ LIỆU (FETCH & RENDER) ---

async function fetchCars() {
    const keyword = document.getElementById('searchKeyword').value;
    const status = document.getElementById('searchStatus').value;
    
    // Tạo tham số query
    const params = new URLSearchParams({ 
        carName: keyword, 
        brand: keyword,
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
        const tbody = document.getElementById('carTableBody');

        if (result.success && result.data.content) {
            window.carList = result.data.content; 

            // TỐI ƯU: Cộng dồn chuỗi rồi mới ghi vào innerHTML (giúp load cực nhanh)
            const htmlRows = window.carList.map(car => {
                const imgPath = car.imageUrl ? car.imageUrl : '/images/no-image.png';
                const formattedPrice = new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                }).format(car.price);
                
                const statusClass = car.status ? car.status.toLowerCase() : 'unknown';

                return `
                    <tr>
                        <td>${car.carId}</td>
                        <td><strong>${car.carName}</strong></td>
                        <td>${car.brand}</td>
                        <td>${formattedPrice}</td>
                        <td><span class="status ${statusClass}">${car.status}</span></td>
                        <td>
                            <img src="${imgPath}" class="img-thumbnail" 
                                 style="width:60px;height:40px;object-fit:cover;border-radius:4px" 
                                 onerror="this.src='/images/no-image.png'">
                        </td>
                        <td>
                            <button class="view" onclick="viewDetail(${car.carId})" title="View Detail"><i class="fa-solid fa-eye"></i></button>
                            <button class="edit" onclick='openEditModal(${JSON.stringify(car)})' title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button class="delete" onclick="deleteCar(${car.carId})" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            }).join('');

            tbody.innerHTML = htmlRows || '<tr><td colspan="7" style="text-align:center">No cars matched your search</td></tr>';
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// --- 4. QUẢN LÝ CHI TIẾT & MODAL ---

function viewDetail(carId) {
    const car = window.carList.find(c => c.carId === carId);
    if (!car) return;

    // Gán dữ liệu vào Modal View
    document.getElementById("viewCarName").value = car.carName || "";
    document.getElementById("viewBrand").value = car.brand || "";
    document.getElementById("viewPrice").value = car.price ? `$${car.price.toLocaleString()}` : "$0";
    document.getElementById("viewStatus").value = car.status || "";
    document.getElementById("viewDescription").value = car.description || "No description provided.";

    const viewImg = document.getElementById("viewImage");
    if (viewImg) viewImg.src = car.imageUrl || "/images/no-image.png";

    window.currentViewingCar = car;
    document.getElementById("viewCarModal").style.display = "block";
}

function openAddCarModal() {
    document.getElementById('modalTitle').innerText = "Add New Car";
    document.getElementById('addCarForm').reset();
    document.getElementById('carId').value = ""; 
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('addCarModal').style.display = 'block';
}

function openEditModal(car) {
    document.getElementById('modalTitle').innerText = "Edit Car Information";
    document.getElementById('carId').value = car.carId;
    document.getElementById('carName').value = car.carName;
    document.getElementById('brand').value = car.brand;
    document.getElementById('price').value = car.price;
    document.getElementById('status').value = car.status;
    document.getElementById('description').value = car.description || "";
    
    if (car.imageUrl) {
        document.getElementById('imgPreview').src = car.imageUrl;
        document.getElementById('previewContainer').style.display = 'block';
    } else {
        document.getElementById('previewContainer').style.display = 'none';
    }

    document.getElementById('addCarModal').style.display = 'block';
}

// --- 5. LỆNH XÓA & LƯU ---

async function saveCar() {
    const form = document.getElementById('addCarForm');
    const formData = new FormData(form);
    const carId = document.getElementById('carId').value;

    const url = carId ? `${API_URL}/${carId}` : API_URL;
    const method = carId ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: getAuthHeader(),
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            alert("Saved successfully!");
            closeAddCarModal();
            fetchCars();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("Server error!");
    }
}

async function deleteCar(id) {
    if (confirm("Are you sure you want to delete this car?")) {
        const response = await fetch(`${API_URL}/${id}`, { 
            method: 'DELETE', 
            headers: getAuthHeader() 
        });
        const result = await response.json();
        if (result.success) fetchCars();
    }
}

// Đóng modal
function closeAddCarModal() { document.getElementById('addCarModal').style.display = 'none'; }
function closeViewCarModal() { document.getElementById('viewCarModal').style.display = 'none'; }

// Click ra ngoài đóng modal
window.onclick = function (event) {
    if (event.target == document.getElementById('addCarModal')) closeAddCarModal();
    if (event.target == document.getElementById('viewCarModal')) closeViewCarModal();
}