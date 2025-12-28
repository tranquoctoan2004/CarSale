// static/script/common/auth-check.js

async function checkAuth() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Nếu không có token, redirect về login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return null;
  }

  try {
    // SỬA: Không cần full URL
    const response = await fetch('/api/auth/me', {
      headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return null;
    }

    const result = await response.json();
    
    if (result.success) {
      const user = result.data;
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update UI if elements exist
      if (document.getElementById('userGreeting')) {
        document.getElementById('userGreeting').textContent = `Hello, ${user.fullName || user.username}!`;
        document.getElementById('userInfoBar').style.display = 'flex';
      }
      
      if (document.getElementById('welcomeMessage')) {
        document.getElementById('welcomeMessage').textContent = `Logged in as: ${user.roles?.join(', ') || 'user'}`;
      }
      
      return user;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      return null;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Chỉ redirect nếu không phải trang login
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    return null;
  }
}

async function logout() {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }
  
  localStorage.clear();
  window.location.href = '/login';
}

// Auto-check on page load (tùy chọn)
// document.addEventListener('DOMContentLoaded', checkAuth);

// Auto logout after 1 hour (tùy chọn)
setTimeout(() => {
  if (localStorage.getItem('token')) {
    logout();
  }
}, 3600000);

// Export functions nếu cần
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkAuth, logout };
}