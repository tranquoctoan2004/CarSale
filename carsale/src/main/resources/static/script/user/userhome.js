 document.addEventListener("DOMContentLoaded", function () {
            const carContainer = document.getElementById("bestseller-container");

            async function loadBestseller() {
                try {
                    const response = await fetch('http://localhost:8080/api/cars');
                    const result = await response.json();
                    if (result.success && Array.isArray(result.data)) {
                        renderCars(result.data.slice(0, 4));
                        document.getElementById("welcomeMessage").textContent = "Our Top 4 Selection for You";
                    }
                } catch (error) {
                    carContainer.innerHTML = "<p style='grid-column: span 4;'>Server Error.</p>";
                }
            }

            function renderCars(cars) {
                carContainer.innerHTML = "";
                cars.forEach(car => {
                    const id = car.carId || car.id;
                    const imgPath = (car.imageUrl) ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
                    
                    const carHtml = `
                        <div class="card">
                            <div class="img">
                                <img src="${imgPath}" onerror="this.onerror=null; this.src='https://via.placeholder.com/400x250?text=Error';">
                            </div>
                            <div class="car-info">
                                <h4 style="margin: 5px 0;">${car.carName}</h4>
                                <p class="price-tag">$${Number(car.price).toLocaleString()}</p>
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

        // Hàm mở Modal
        async function showDetails(carId) {
            const modal = document.getElementById("carModal");
            modal.style.display = "block";
            
            try {
                const response = await fetch(`http://localhost:8080/api/cars/${carId}`);
                const result = await response.json();
                if(result.success) {
                    const car = result.data;
                    document.getElementById("modalTitle").textContent = car.carName;
                    document.getElementById("modalPrice").textContent = "$" + Number(car.price).toLocaleString();
                    document.getElementById("modalDesc").textContent = car.description || "This is a premium car available in our showroom.";
                    document.getElementById("modalImg").src = car.imageUrl ? `http://localhost:8080${car.imageUrl}` : 'https://via.placeholder.com/400x250?text=No+Image';
                    document.getElementById("modalCartBtn").onclick = () => addToCart(carId);
                }
            } catch (e) {
                console.error("Modal Error:", e);
            }
        }

        function closeModal() {
            document.getElementById("carModal").style.display = "none";
        }

        // Đóng modal khi bấm ra ngoài
        window.onclick = function(event) {
            if (event.target == document.getElementById("carModal")) closeModal();
        }

        function addToCart(id) {
            alert("Added Car #" + id + " to your cart!");
        }

        function submitComment() {
            const val = document.getElementById("commentInput").value;
            if(val.trim()) {
                alert("Thank you for your feedback!");
                document.getElementById("commentInput").value = "";
            }
        }