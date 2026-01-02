// Common redirect function for all guest pages
function redirectToLogin() {
    window.location.href = '../screen/user/login.html';
}

// Initialize navigation for guest pages
function initNavigation() {
    const navSelect = document.querySelector('.nav-select');
    if (navSelect) {
        navSelect.addEventListener('change', function() {
            if (this.value) {
                if (this.value === 'guest.html' || 
                    this.value === 'car.html' || 
                    this.value === 'news.html' || 
                    this.value === 'about.html') {
                    window.location.href = this.value;
                } else if (this.value.startsWith('#')) {
                    redirectToLogin();
                } else {
                    window.location.href = this.value;
                }
            }
        });
    }
    
    // Navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === 'guest.html' || 
                href === 'car.html' || 
                href === 'news.html' || 
                href === 'about.html') {
                return true;
            }
            if (href === '#' || href.startsWith('#')) {
                e.preventDefault();
                redirectToLogin();
            }
        });
    });
}

// Initialize search functionality
function initSearch(searchInputId) {
    const searchInput = document.getElementById(searchInputId);
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                redirectToLogin();
            }
        });
    }
}

// Initialize common buttons
function initCommonButtons() {
    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    }
    
    // User button
    const userBtn = document.querySelector('.user-btn');
    if (userBtn) {
        userBtn.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    }
    
    // Footer links
    document.querySelectorAll('.footer-bottom a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    });
    
    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    }
}

// Initialize star rating system (for review sections)
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;
    
    stars.forEach(star => {
        star.addEventListener('click', function(e) {
            e.preventDefault();
            const value = parseInt(this.getAttribute('data-value'));
            currentRating = value;
            
            // Update all stars visually
            stars.forEach((s, index) => {
                const icon = s.querySelector('i');
                if (index < value) {
                    icon.className = 'fas fa-star';
                    s.classList.add('active');
                } else {
                    icon.className = 'far fa-star';
                    s.classList.remove('active');
                }
            });
        });
        
        // Hover effects
        star.addEventListener('mouseenter', function() {
            const value = parseInt(this.getAttribute('data-value'));
            stars.forEach((s, index) => {
                if (index < value) {
                    s.style.color = '#ed8936';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach((s, index) => {
                if (index >= currentRating) {
                    s.style.color = '';
                }
            });
        });
    });
}

// Add hover effects to cards
function initCardHover() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Welcome section animation
function initWelcomeAnimation() {
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        setTimeout(() => {
            welcomeSection.style.opacity = '1';
            welcomeSection.style.transform = 'translateY(0)';
        }, 300);
        
        welcomeSection.style.opacity = '0';
        welcomeSection.style.transform = 'translateY(20px)';
        welcomeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + F to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.querySelector('.search');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('CarSale Guest Page initialized');
    
    // Initialize all common functionality
    initNavigation();
    initCommonButtons();
    initKeyboardShortcuts();
    
    // Initialize specific components if they exist
    if (document.querySelector('.star')) {
        initStarRating();
    }
    
    if (document.querySelector('.card')) {
        initCardHover();
    }
    
    if (document.querySelector('.welcome-section')) {
        initWelcomeAnimation();
    }
    
    // Initialize search (default search input id)
    initSearch('searchInput');
});