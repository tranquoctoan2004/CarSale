// script/common/layoutadmin.js

async function loadLayoutAdmin() {
    try {
        // Load header
        const headerResponse = await fetch("../components/headeradmin.html");
        const headerHtml = await headerResponse.text();
        document.getElementById("header").innerHTML = headerHtml;

        // Load sidebar
        const sidebarResponse = await fetch("../components/sidebaradmin.html");
        const sidebarHtml = await sidebarResponse.text();
        document.getElementById("sidebar").innerHTML = sidebarHtml;

        // Sau khi load xong, thiết lập các chức năng
        setupSidebarToggle();
        setupActiveMenu();
        setupNavigation();
        setupSearch();
        setupNotifications();
        setupUserProfile();
        
        // Kiểm tra authentication
        checkAdminAuth();

    } catch (error) {
        console.error("Error loading admin layout:", error);
        showErrorMessage("Failed to load layout. Please refresh the page.");
    }
}

function setupSidebarToggle() {
    const menuIcon = document.querySelector('.menu-icon');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuIcon && sidebar) {
        // Tạo overlay nếu chưa có
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
        
        menuIcon.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
            
            // Lưu trạng thái vào localStorage
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            document.body.classList.remove('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', false);
        });
        
        // Khôi phục trạng thái từ localStorage
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState === 'true') {
            sidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        }
        
        // Đóng sidebar khi click ra ngoài (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && 
                sidebar.classList.contains('collapsed') &&
                !sidebar.contains(e.target) && 
                !menuIcon.contains(e.target)) {
                sidebar.classList.remove('collapsed');
                document.body.classList.remove('sidebar-collapsed');
            }
        });
        
        // Responsive: chuyển đổi giữa desktop và mobile mode
        function handleResize() {
            if (window.innerWidth <= 992) {
                sidebar.classList.add('collapsed');
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
                const savedState = localStorage.getItem('sidebarCollapsed');
                if (savedState === 'true') {
                    sidebar.classList.add('collapsed');
                } else {
                    sidebar.classList.remove('collapsed');
                }
            }
        }
        
        window.addEventListener('resize', handleResize);
        handleResize(); // Chạy ngay khi load
    }
}

function setupActiveMenu() {
    // Lấy path hiện tại
    const currentPath = window.location.pathname; // "/screen/admin/adminhome.html"
    
    // Convert thành format tương tự data-page
    const pathParts = currentPath.split('/');
    const fileName = pathParts.pop(); // "adminhome.html"
    const folderName = pathParts.pop(); // "admin"
    const dataPageValue = `../${folderName}/${fileName}`; // "../admin/adminhome.html"
    
    // Tìm và highlight menu active
    const menuItems = document.querySelectorAll('.sidebar li[data-page]');
    
    menuItems.forEach(item => {
        // Xóa class active cũ
        item.classList.remove('active');
        
        // So sánh data-page với current path
        if (item.dataset.page === dataPageValue) {
            item.classList.add('active');
            
            // Thêm hiệu ứng animation
            item.style.animation = 'fadeIn 0.3s ease-out';
        }
    });
}

function setupNavigation() {
    // Thêm event listener cho các link trong sidebar
    document.addEventListener('click', function(e) {
        // Kiểm tra nếu click vào link trong sidebar
        if (e.target.closest('.sidebar a') && !e.target.closest('.sidebar a[href="#"]')) {
            const link = e.target.closest('.sidebar a');
            const href = link.getAttribute('href');
            
            // Kiểm tra nếu không phải logout link
            if (href !== '#' && !link.onclick) {
                e.preventDefault();
                
                // Thêm loading indicator
                showPageLoading();
                
                // Chuyển trang sau 100ms để có hiệu ứng mượt
                setTimeout(() => {
                    window.location.href = href;
                }, 100);
            }
        }
    });
}

function setupSearch() {
    const searchInput = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i');
    
    if (searchInput) {
        // Focus vào search khi click icon
        if (searchIcon) {
            searchIcon.addEventListener('click', () => {
                searchInput.focus();
            });
        }
        
        // Xử lý search khi nhấn Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
        
        // Clear search khi nhấn Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
            }
        });
    }
}

function setupNotifications() {
    const bellIcon = document.querySelector('.bell');
    
    if (bellIcon) {
        bellIcon.addEventListener('click', () => {
            showNotifications();
        });
        
        // Kiểm tra notification count từ API
        checkNotificationCount();
    }
}

function setupUserProfile() {
    const userProfile = document.querySelector('.admin-user');
    
    if (userProfile) {
        // Load user info
        loadUserInfo();
        
        // Click để show dropdown
        userProfile.addEventListener('click', () => {
            showUserDropdown(userProfile);
        });
    }
}

function checkAdminAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        // Không có token, redirect về login
        window.location.href = '/screen/user/login.html';
        return false;
    }
    
    if (!user.roles || !user.roles.includes('admin')) {
        // Không phải admin, redirect về user home
        showErrorMessage('Access denied. Admin privileges required.');
        setTimeout(() => {
            window.location.href = '/screen/user/home.html';
        }, 2000);
        return false;
    }
    
    return true;
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userInfoElements = document.querySelectorAll('.user-info, .username-display, .user-avatar span');
    
    userInfoElements.forEach(element => {
        if (element.classList.contains('username-display')) {
            element.textContent = user.username || 'Admin';
        }
        if (element.classList.contains('user-fullname')) {
            element.textContent = user.fullName || 'Administrator';
        }
        if (element.classList.contains('user-role')) {
            element.textContent = user.roles ? user.roles.join(', ') : 'Admin';
        }
        if (element.classList.contains('user-avatar') || element.id === 'userInitial') {
            const initial = (user.username || 'A').charAt(0).toUpperCase();
            element.textContent = initial;
            
            // Tạo màu avatar ngẫu nhiên dựa trên username
            if (element.classList.contains('user-avatar')) {
                const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];
                const colorIndex = (user.username || '').length % colors.length;
                element.style.background = colors[colorIndex];
            }
        }
    });
}

// Helper functions
function showPageLoading() {
    let loading = document.querySelector('.page-loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.className = 'page-loading';
        loading.innerHTML = '<div class="loading-spinner"></div><span>Loading...</span>';
        document.body.appendChild(loading);
    }
    loading.style.display = 'flex';
}

function hidePageLoading() {
    const loading = document.querySelector('.page-loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

function showErrorMessage(message) {
    // Tạo hoặc tìm error container
    let errorContainer = document.querySelector('.error-message-global');
    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'error-message-global';
        document.body.appendChild(errorContainer);
    }
    
    errorContainer.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="error-close">&times;</button>
        </div>
    `;
    
    errorContainer.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
    
    // Close button
    const closeBtn = errorContainer.querySelector('.error-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            errorContainer.style.display = 'none';
        });
    }
}

function showNotifications() {
    // Tạo notification dropdown
    let notificationDropdown = document.querySelector('.notification-dropdown');
    if (!notificationDropdown) {
        notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        document.body.appendChild(notificationDropdown);
    }
    
    // Tạm thời hiển thị thông báo mẫu
    notificationDropdown.innerHTML = `
        <div class="notification-header">
            <h4>Notifications</h4>
            <button class="mark-all-read">Mark all as read</button>
        </div>
        <div class="notification-list">
            <div class="notification-item unread">
                <i class="fas fa-car"></i>
                <div>
                    <p>New car added: Ford Mustang 2024</p>
                    <small>5 minutes ago</small>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-user"></i>
                <div>
                    <p>New user registered: john_doe</p>
                    <small>2 hours ago</small>
                </div>
            </div>
            <div class="notification-item">
                <i class="fas fa-shopping-cart"></i>
                <div>
                    <p>New order #12345 placed</p>
                    <small>Yesterday</small>
                </div>
            </div>
        </div>
        <div class="notification-footer">
            <a href="/screen/admin/notifications.html">View all notifications</a>
        </div>
    `;
    
    // Hiển thị dropdown
    const bell = document.querySelector('.bell');
    if (bell) {
        const rect = bell.getBoundingClientRect();
        notificationDropdown.style.top = `${rect.bottom + 10}px`;
        notificationDropdown.style.right = `${window.innerWidth - rect.right}px`;
    }
    
    notificationDropdown.classList.add('show');
    
    // Đóng khi click ra ngoài
    document.addEventListener('click', function closeDropdown(e) {
        if (!notificationDropdown.contains(e.target) && e.target !== bell && !bell.contains(e.target)) {
            notificationDropdown.classList.remove('show');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

function performSearch(query) {
    if (!query.trim()) return;
    
    console.log('Searching for:', query);
    // Gọi API search hoặc redirect đến search page
    // window.location.href = `/screen/admin/search.html?q=${encodeURIComponent(query)}`;
    
    // Tạm thời hiển thị kết quả
    showSearchResults(query);
}

function showSearchResults(query) {
    // Tạo search results dropdown
    let searchResults = document.querySelector('.search-results');
    if (!searchResults) {
        searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        document.body.appendChild(searchResults);
    }
    
    // Tạm thời hiển thị kết quả mẫu
    searchResults.innerHTML = `
        <div class="search-results-header">
            <h4>Search results for "${query}"</h4>
        </div>
        <div class="search-results-list">
            <a href="/screen/admin/carmanagement.html" class="search-result-item">
                <i class="fas fa-car"></i>
                <div>
                    <p>Cars matching "${query}"</p>
                    <small>View all cars</small>
                </div>
            </a>
            <a href="/screen/admin/usermanagement.html" class="search-result-item">
                <i class="fas fa-users"></i>
                <div>
                    <p>Users matching "${query}"</p>
                    <small>View all users</small>
                </div>
            </a>
        </div>
    `;
    
    // Hiển thị dropdown
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        const rect = searchBox.getBoundingClientRect();
        searchResults.style.top = `${rect.bottom + 10}px`;
        searchResults.style.left = `${rect.left}px`;
        searchResults.style.width = `${rect.width}px`;
    }
    
    searchResults.classList.add('show');
    
    // Đóng khi click ra ngoài
    document.addEventListener('click', function closeResults(e) {
        if (!searchResults.contains(e.target) && e.target !== searchBox && !searchBox.contains(e.target)) {
            searchResults.classList.remove('show');
            document.removeEventListener('click', closeResults);
        }
    });
}

function checkNotificationCount() {
    // Gọi API để lấy số notification chưa đọc
    // fetch('/api/notifications/unread-count')
    //     .then(response => response.json())
    //     .then(data => {
    //         updateNotificationBadge(data.count);
    //     });
    
    // Tạm thời set số ngẫu nhiên
    const unreadCount = Math.floor(Math.random() * 5);
    updateNotificationBadge(unreadCount);
}

function updateNotificationBadge(count) {
    const bell = document.querySelector('.bell');
    if (bell && count > 0) {
        // Tạo hoặc cập nhật badge
        let badge = bell.querySelector('.notification-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'notification-badge';
            bell.appendChild(badge);
        }
        badge.textContent = count > 9 ? '9+' : count;
    }
}

function showUserDropdown(profileElement) {
    // Tạo user dropdown
    let userDropdown = document.querySelector('.user-dropdown');
    if (!userDropdown) {
        userDropdown = document.createElement('div');
        userDropdown.className = 'user-dropdown';
        document.body.appendChild(userDropdown);
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    userDropdown.innerHTML = `
        <div class="user-dropdown-header">
            <div class="user-info-compact">
                <div class="user-avatar-small">${(user.username || 'A').charAt(0).toUpperCase()}</div>
                <div>
                    <strong>${user.fullName || 'Administrator'}</strong>
                    <small>${user.username || 'admin'}</small>
                </div>
            </div>
        </div>
        <div class="user-dropdown-menu">
            <div class="dropdown-divider"></div>
            <a href="#" onclick="logoutAdmin()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </a>
        </div>
    `;
    
    // Hiển thị dropdown
    if (profileElement) {
        const rect = profileElement.getBoundingClientRect();
        userDropdown.style.top = `${rect.bottom + 10}px`;
        userDropdown.style.right = `${window.innerWidth - rect.right}px`;
    }
    
    userDropdown.classList.add('show');
    
    // Đóng khi click ra ngoài
    document.addEventListener('click', function closeUserDropdown(e) {
        if (!userDropdown.contains(e.target) && e.target !== profileElement && !profileElement.contains(e.target)) {
            userDropdown.classList.remove('show');
            document.removeEventListener('click', closeUserDropdown);
        }
    });
}

// Logout function
function logoutAdmin() {
    const token = localStorage.getItem('token');
    
    if (token) {
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(response => response.json())
        .then(data => {
            // Xóa thông tin user khỏi localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('sidebarCollapsed');
            
            // Redirect về trang login
            window.location.href = '/screen/user/login.html';
        })
        .catch(error => {
            console.error('Logout error:', error);
            // Vẫn xóa localStorage và redirect
            localStorage.clear();
            window.location.href = '/screen/user/login.html';
        });
    } else {
        // Không có token, redirect thẳng về login
        localStorage.clear();
        window.location.href = '/screen/user/login.html';
    }
    
    return false; // Ngăn link hành vi mặc định
}

// Thêm CSS cho các component động
const style = document.createElement('style');
style.textContent = `
    .sidebar-overlay {
        display: none;
        position: fixed;
        top: 71px;
        left: 0;
        width: 100%;
        height: calc(100vh - 71px);
        background: rgba(0, 0, 0, 0.5);
        z-index: 98;
    }
    
    .sidebar-overlay.active {
        display: block;
    }
    
    .page-loading {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.9);
        z-index: 9999;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-size: 16px;
        color: #333;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(26, 115, 232, 0.3);
        border-radius: 50%;
        border-top-color: #1a73e8;
        animation: spin 1s ease-in-out infinite;
        margin-bottom: 15px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .error-message-global {
        display: none;
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
    }
    
    .error-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .error-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: auto;
    }
    
    .notification-dropdown,
    .user-dropdown,
    .search-results {
        display: none;
        position: fixed;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        min-width: 300px;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .notification-dropdown.show,
    .user-dropdown.show,
    .search-results.show {
        display: block;
    }
    
    .notification-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #ff4757;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 18px;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Gọi hàm khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", loadLayoutAdmin);

// Ẩn loading khi page đã load
window.addEventListener('load', hidePageLoading);