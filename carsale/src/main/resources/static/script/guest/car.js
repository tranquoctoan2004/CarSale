// script/guest/car.js

// Fake car data (6 cars)
const carsData = [
    {
        id: 1,
        name: "Toyota Camry 2024",
        brand: "toyota",
        price: 28500,
        originalPrice: 33500,
        fuelType: "hybrid",
        transmission: "automatic",
        seats: 5,
        year: 2024,
        discount: 15,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["discount", "popular"],
        popularity: 95
    },
    {
        id: 2,
        name: "Honda Civic 2024",
        brand: "honda",
        price: 24200,
        originalPrice: null,
        fuelType: "petrol",
        transmission: "automatic",
        seats: 5,
        year: 2024,
        discount: 0,
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["new"],
        popularity: 88
    },
    {
        id: 3,
        name: "Ford Mustang GT",
        brand: "ford",
        price: 42800,
        originalPrice: null,
        fuelType: "petrol",
        transmission: "manual",
        seats: 4,
        year: 2023,
        discount: 0,
        image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["hot"],
        popularity: 92
    },
    {
        id: 4,
        name: "BMW X5 2024",
        brand: "bmw",
        price: 65300,
        originalPrice: null,
        fuelType: "diesel",
        transmission: "automatic",
        seats: 7,
        year: 2024,
        discount: 0,
        image: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["premium"],
        popularity: 78
    },
    {
        id: 5,
        name: "Mercedes C-Class",
        brand: "mercedes",
        price: 48900,
        originalPrice: 54000,
        fuelType: "petrol",
        transmission: "automatic",
        seats: 5,
        year: 2023,
        discount: 10,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["discount"],
        popularity: 85
    },
    {
        id: 6,
        name: "Tesla Model 3",
        brand: "tesla",
        price: 39990,
        originalPrice: null,
        fuelType: "electric",
        transmission: "automatic",
        seats: 5,
        year: 2024,
        discount: 0,
        image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        tags: ["electric"],
        popularity: 96
    }
];

// State variables
let sortBy = 'newest';

// DOM elements
const carGrid = document.getElementById('carGrid');
const resultCount = document.getElementById('resultCount');
const sortSelect = document.getElementById('sortSelect');

// Format price with commas
function formatPrice(price) {
    return '$' + price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Get badge HTML based on tags
function getBadgeHTML(car) {
    if (car.tags.includes('discount')) {
        return `<span class="discount-badge">-${car.discount}%</span>`;
    }
    if (car.tags.includes('new')) {
        return '<span class="new-badge">NEW</span>';
    }
    if (car.tags.includes('hot')) {
        return '<span class="hot-badge">HOT</span>';
    }
    if (car.tags.includes('premium')) {
        return '<span class="premium-badge">PREMIUM</span>';
    }
    if (car.tags.includes('electric')) {
        return '<span class="eco-badge">ELECTRIC</span>';
    }
    return '';
}

// Create car card HTML
function createCarCard(car) {
    return `
        <div class="card">
            <div class="card-image" style="background-image: url('${car.image}');">
                ${getBadgeHTML(car)}
            </div>
            <div class="card-content">
                <h3>${car.name}</h3>
                <div class="car-details">
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1)}</span>
                    <span><i class="fas fa-cogs"></i> ${car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1)}</span>
                    <span><i class="fas fa-users"></i> ${car.seats} Seats</span>
                    <span><i class="fas fa-calendar"></i> ${car.year}</span>
                </div>
                <div class="price-section">
                    ${car.originalPrice ? `<p class="original-price">${formatPrice(car.originalPrice)}</p>` : ''}
                    <p class="current-price">${formatPrice(car.price)}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-details">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                    <button class="btn-cart">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Sort cars based on selected option
function sortCars(cars, sortOption) {
    const sortedCars = [...cars];
    
    switch(sortOption) {
        case 'newest':
            return sortedCars.sort((a, b) => b.year - a.year || b.id - a.id);
        case 'oldest':
            return sortedCars.sort((a, b) => a.year - b.year || a.id - b.id);
        case 'price-low':
            return sortedCars.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sortedCars.sort((a, b) => b.price - a.price);
        case 'popular':
            return sortedCars.sort((a, b) => b.popularity - a.popularity);
        default:
            return sortedCars;
    }
}

// Display cars
function displayCars() {
    // Apply sorting
    const sortedCars = sortCars(carsData, sortBy);
    
    // Clear and display cars
    carGrid.innerHTML = '';
    sortedCars.forEach(car => {
        carGrid.innerHTML += createCarCard(car);
    });
    
    // Update result count
    resultCount.textContent = `Showing ${sortedCars.length} cars`;
}

// Initialize car page specific functionality
function initCarPage() {
    console.log('CarSale Cars Page initialized');
    
    // Initialize car display
    displayCars();
    
    // Set up sort select listener
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortBy = e.target.value;
            displayCars();
        });
    }
    
    // Add event listeners to car buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    });
    
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality from guest.js
    // (These functions are called automatically in guest.js)
    
    // Initialize car page specific functionality
    initCarPage();
});