// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('CarSale Guest Page initialized');
    
    // Initialize star rating system
    initStarRating();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize all login buttons
    initLoginButtons();
    
    // Initialize navigation select
    initNavigation();
    
    // Add hover effects to cards
    initCardHover();
    
    // Add animation to welcome section
    initWelcomeAnimation();
});

// Star rating system (visual only)
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

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('.search');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                window.location.href = '../user/login.html';
            }
        });
    }
}

// Add event listeners to all buttons that need login
function initLoginButtons() {
    // Wishlist buttons
    document.querySelectorAll('.btn-wishlist').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    });
    
    // Details buttons
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    });
    
    // Cart buttons
    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    });
    
    // Submit review button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    }
    
    // Newsletter button
    const newsletterBtn = document.querySelector('.subscribe-form button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    }
    
    // Social media links
    document.querySelectorAll('.social-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    });
    
    // Footer quick links
    document.querySelectorAll('.footer-section a').forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href') !== 'guest.html') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = '../user/login.html';
            });
        }
    });
    
    // Footer policy links
    document.querySelectorAll('.footer-bottom a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../user/login.html';
        });
    });
}

// Navigation select
function initNavigation() {
    const navSelect = document.querySelector('.nav-select');
    if (navSelect) {
        navSelect.addEventListener('change', function() {
            if (this.value) {
                window.location.href = this.value;
            }
        });
    }
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