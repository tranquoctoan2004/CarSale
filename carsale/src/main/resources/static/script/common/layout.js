async function loadLayout() {
    // load header
    const header = await fetch("/screen/components/header.html")
        .then(res => res.text());
    document.getElementById("header").innerHTML = header;

    // load footer
    const footer = await fetch("/screen/components/footer.html")
        .then(res => res.text());
    document.getElementById("footer").innerHTML = footer;
}

function setupHeaderEvents() {
  // Logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      if (!confirm('Are you sure you want to logout?')) {
        return;
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await fetch('http://localhost:8080/api/auth/logout', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
          });
        } catch (error) {
          console.error('Logout API error:', error);
        }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // SỬA PATH NÀY
      window.location.href = '/screen/user/login.html';
    });
  }
  
  // Edit profile button
  const editProfileBtn = document.getElementById('editProfile');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'updateinfo.html';
    });
  }
}

loadLayout().then(async () => {
  // Wait for header to load
  setTimeout(async () => {
    // Setup header events
    setupHeaderEvents();
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const user = result.data;
            
            // Update header user info
            const initialElement = document.getElementById('userInitial');
            if (initialElement) {
              const initial = (user.fullName || user.username || 'U').charAt(0).toUpperCase();
              initialElement.textContent = initial;
            }
            
            // Update dropdown info
            const usernameElement = document.getElementById('dropdownUsername');
            const emailElement = document.getElementById('dropdownEmail');
            if (usernameElement) usernameElement.textContent = user.fullName || user.username;
            if (emailElement) emailElement.textContent = user.email || '';
            
            // Update welcome message
            const welcomeElement = document.getElementById('welcomeMessage');
            const statsElement = document.getElementById('userStats');
            const greetingElement = document.getElementById('userGreeting');
            const userInfoBar = document.getElementById('userInfoBar');
            
            if (welcomeElement) {
              welcomeElement.textContent = `Welcome back, ${user.fullName || user.username}!`;
            }
            
            if (statsElement) {
              statsElement.textContent = `Member since ${new Date(user.createdAt).toLocaleDateString()}`;
            }
            
            if (greetingElement) {
              greetingElement.textContent = `Hi, ${user.fullName || user.username}`;
            }
            
            if (userInfoBar) {
              userInfoBar.style.display = 'block';
            }
          }
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.clear();
          const userInfoBar = document.getElementById('userInfoBar');
          if (userInfoBar) userInfoBar.style.display = 'none';
          console.warn('Token expired, please login again');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.clear();
      }
    } else {
      // Not logged in, hide userInfoBar
      const userInfoBar = document.getElementById('userInfoBar');
      if (userInfoBar) userInfoBar.style.display = 'none';
    }
  }, 300);
});