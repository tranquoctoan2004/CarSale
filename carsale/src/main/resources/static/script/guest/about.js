// script/guest/about.js

// Initialize about page specific functionality
function initAboutPage() {
    console.log('CarSale About Page initialized');
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add hover effects to team cards
    const teamCards = document.querySelectorAll('.team-card');
    teamCards.forEach(card => {
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
    
    // Initialize about page specific functionality
    initAboutPage();
});