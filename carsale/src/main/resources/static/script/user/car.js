// Biến toàn cục để lưu danh sách xe giúp mở Modal nhanh
window.allCars = [];

document.addEventListener("DOMContentLoaded", () => {
  loadCars();

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      loadCars(sortSelect.value);
    });
  }
});

function loadCars(sort) {
  let url = "/api/cars";
  if (sort) url += `?sort=${sort}`;

  fetch(url)
    .then(res => res.json())
    .then(result => {
      console.log("Cars loaded:", result);

      if (!result.success || !Array.isArray(result.data)) {
        document.getElementById("carList").innerHTML = "<p>No cars available.</p>";
        return;
      }

      // Lưu vào biến toàn cục để hàm showDetails sử dụng
      window.allCars = result.data;

      const carList = document.getElementById("carList");
      carList.innerHTML = "";

      result.data.forEach(car => {
        const id = car.carId || car.id;
        const imgPath = car.imageUrl ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
        
        // Định dạng giá tiền
        const formattedPrice = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(car.price);

        carList.innerHTML += `
          <div class="car-card">
            <img src="${imgPath}" alt="${car.carName}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x250?text=Error';">
            <div class="car-info">
              <h3 style="margin: 10px 0 5px 0;">${car.carName}</h3>
              <p style="font-size: 0.9em; color: #666;">Brand: ${car.brand}</p>
              <p style="color: #e44d26; font-weight: bold; font-size: 1.1em;">${formattedPrice}</p>
              <div class="actions">
                <button onclick="showDetails(${id})">ⓘ Details</button>
                <button onclick="addToCart(${id})">🛒 +Cart</button>
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error("Load cars error:", err);
      document.getElementById("carList").innerHTML = "<p>Server Connection Error.</p>";
    });
}

// --- LOGIC MODAL CHI TIẾT ---
function showDetails(carId) {
  // Tìm xe trong mảng đã load sẵn
  const car = window.allCars.find(c => (c.carId || c.id) === carId);
  
  if (!car) {
    console.error("Car not found in local list!");
    return;
  }

  const modal = document.getElementById("carModal");
  
  // Đổ dữ liệu vào Modal
  document.getElementById("modalTitle").textContent = car.carName;
  document.getElementById("modalBrand").textContent = car.brand;
  document.getElementById("modalPrice").textContent = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
  }).format(car.price);
  
  document.getElementById("modalDesc").textContent = car.description || "No specific description available for this luxury model. Please contact us for more details.";
  
  const imgPath = car.imageUrl ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
  document.getElementById("modalImg").src = imgPath;

  // Gán sự kiện cho nút Cart trong Modal
  document.getElementById("modalCartBtn").onclick = () => addToCart(carId);

  // Hiển thị Modal
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("carModal").style.display = "none";
}

// Đóng modal khi bấm ra ngoài vùng trắng
window.onclick = function(event) {
  const modal = document.getElementById("carModal");
  if (event.target == modal) {
    closeModal();
  }
};

function addToCart(carId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        window.location.href = "/screen/user/login.html";
        return;
    }

    const requestData = {
        carId: carId,
        quantity: 1
    };

    fetch("/api/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
    })
    .then(res => res.json())
    .then(result => {
        if (result.success) {
            alert("Added to cart successfully!");
        } else {
            alert("Lỗi: " + result.message);
        }
    })
    .catch(err => {
        console.error("Error adding to cart:", err);
        alert("Could not connect to the server.");
    });
}