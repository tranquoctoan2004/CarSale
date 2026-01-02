// script/guest/news.js

// Initialize news page specific functionality
function initNewsPage() {
    console.log('CarSale News Page initialized');
    
    // Add event listeners to news buttons
    document.querySelectorAll('.read-more-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    });
    
    document.querySelectorAll('.newsletter-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToLogin();
        });
    });
    
    // Add hover effects to news cards
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize common functionality from guest.js
    // (These functions are called automatically in guest.js)
    
    // Initialize news page specific functionality
    initNewsPage();
});