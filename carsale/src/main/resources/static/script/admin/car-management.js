const API = "http://localhost:8080/api/cars";
const tableBody = document.getElementById("carTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

document.addEventListener("DOMContentLoaded", loadCars);
searchInput.addEventListener("input", loadCars);
statusFilter.addEventListener("change", loadCars);

async function loadCars() {
  let url = API;

  const keyword = searchInput.value;
  const status = statusFilter.value;

  if (keyword || status) {
    url += `?keyword=${keyword}&status=${status}`;
  }

  const res = await fetch(url);
  const cars = await res.json();

  renderCars(cars);
}

function renderCars(cars) {
  tableBody.innerHTML = "";

  cars.forEach(car => {
    tableBody.innerHTML += `
      <tr>
        <td>
          <img src="${car.imageUrl || '/images/no-image.png'}"
               class="car-img">
          ${car.carName}
        </td>

        <td>${car.brand || ""}</td>

        <td>$${Number(car.price).toLocaleString()}</td>

        <td class="${car.status === 'available' ? 'active' : 'pending'}">
          ${car.status}
        </td>

        <td>
          <button class="view" onclick="viewCar(${car.carId})">
            <i class="fa-solid fa-eye"></i>
          </button>

          <button class="edit" onclick="editCar(${car.carId})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>

          <button class="delete" onclick="deleteCar(${car.carId})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

function goAdd() {
  location.href = "car-form.html";
}

function editCar(id) {
  location.href = `car-form.html?id=${id}`;
}

function viewCar(id) {
  alert("View detail car ID = " + id);
}

async function deleteCar(id) {
  if (!confirm("Delete this car?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadCars();
}
