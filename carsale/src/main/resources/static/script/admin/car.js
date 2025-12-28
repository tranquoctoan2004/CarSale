const API_URL = "/api/cars";
const tbody = document.getElementById("carTableBody");
const searchInput = document.querySelector(".search-input");

/* ================= LOAD ALL ================= */
async function loadCars() {
  try {
    const res = await fetch(API_URL);
    const cars = await res.json();

    tbody.innerHTML = "";
    cars.forEach(renderRow);
  } catch (err) {
    console.error("Load cars failed", err);
  }
}

/* ================= RENDER ROW ================= */
function renderRow(car) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>
      <img src="${car.imageUrl || "/image/no-image.png"}"
           class="car-img"
           style="width:60px;height:40px;object-fit:cover"/>
      <strong>${car.carName}</strong><br/>
      <small>${car.brand || ""}</small>
    </td>

    <td>${formatPrice(car.price)}</td>

    <td class="${car.status === "available" ? "active" : "pending"}">
      ${car.status}
    </td>

    <td>
      <button class="edit" onclick="editCar(${car.carId})">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button class="delete" onclick="deleteCar(${car.carId})">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);
}

/* ================= DELETE ================= */
async function deleteCar(id) {
  if (!confirm("Delete this car?")) return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    loadCars();
  } else {
    alert("Delete failed");
  }
}

/* ================= SEARCH ================= */
searchInput.addEventListener("input", async (e) => {
  const keyword = e.target.value.trim();

  if (!keyword) {
    loadCars();
    return;
  }

  const res = await fetch(
    `/api/cars/search?brand=${encodeURIComponent(keyword)}`
  );
  const cars = await res.json();

  tbody.innerHTML = "";
  cars.forEach(renderRow);
});

/* ================= UTIL ================= */
function formatPrice(price) {
  return Number(price).toLocaleString("vi-VN") + " ₫";
}

/* ================= INIT ================= */
loadCars();

/* ================= PLACEHOLDER ================= */
function editCar(id) {
  alert("Edit car id = " + id + " (chưa làm)");
}
