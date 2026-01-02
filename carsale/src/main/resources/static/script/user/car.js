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

  if (sort) {
    url += `?sort=${sort}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(result => {
      console.log("API RESULT:", result); // debug

      if (!result.success || !Array.isArray(result.data)) {
        console.error("Invalid API response:", result);
        return;
      }

      const carList = document.getElementById("carList");
      if (!carList) return;

      carList.innerHTML = "";

      result.data.forEach(car => {
        carList.innerHTML += `
          <div class="car-card">
            <img src="http://localhost:8080${car.imageUrl}" alt="${car.carName}">
            <div class="car-info">
              <h3>${car.carName}</h3>
              <p><strong>Brand:</strong> ${car.brand}</p>
              <p><strong>Price:</strong> $${Number(car.price).toLocaleString()}</p>
              <p><strong>Description:</strong> ${car.description ?? ""}</p>
              <div class="actions">
                <button onclick="addToCart(${car.carId})">🛒 Add to Cart</button>
                <button>♥ Favorite</button>
              </div>
            </div>
          </div>
        `;
      });
    })
    .catch(err => console.error("Load cars error:", err));
}

function addToCart(carId) {
  alert("Add to cart carId = " + carId);
}
