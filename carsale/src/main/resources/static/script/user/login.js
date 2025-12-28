// static/script/user/login.js

// Check if already logged in
document.addEventListener('DOMContentLoaded', function() {
  const token = localStorage.getItem('token');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.roles && user.roles.includes('admin')) {
      window.location.href = '/screen/admin/adminhome.html';  // SỬA: redirect thẳng đến file
    } else {
      window.location.href = '/screen/user/userhome.html';        // SỬA: user homepage
    }
  }
  
  // Auto-fill if remember me was checked
  const rememberCheckbox = document.getElementById('remember');
  if (localStorage.getItem('rememberMe') === 'true' && rememberCheckbox) {
    document.getElementById('username').value = localStorage.getItem('savedUsername') || '';
    rememberCheckbox.checked = true;
  }
});

function showMessage(message, isSuccess) {
  if (isSuccess) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('errorMessage').style.display = 'none';
  } else {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
  }
}

function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'block' : 'none';
}

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  let rememberMe = false;
  const rememberCheckbox = document.getElementById('remember');
  if (rememberCheckbox) {
    rememberMe = rememberCheckbox.checked;
  }

  if (!username || !password) {
    showMessage('Please fill in all fields', false);
    return;
  }

  showLoading(true);
  showMessage('', false);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    showLoading(false);

    if (result.success) {
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(result.data.account));
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedUsername', username);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('savedUsername');
      }

      showMessage('Login successful! Redirecting...', true);

      // Delay redirect để user thấy message
      setTimeout(() => {
        const roles = result.data.account.roles || [];
        
        if (roles.includes('admin')) {
          console.log('✅ Admin detected, redirecting to adminhome');
          window.location.href = '/screen/admin/adminhome.html';
        } else {
          console.log('✅ Regular user, redirecting to user homepage');
          window.location.href = '/screen/user/userhome.html';
        }
      }, 1500);
    } else {
      showMessage(result.message || 'Login failed', false);
    }
  } catch (error) {
    showLoading(false);
    showMessage('Cannot connect to server', false);
    console.error('Login error:', error);
  }
}

// Enter key support
document.getElementById('password')?.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') login();
});

// Also support Enter on username field
document.getElementById('username')?.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') login();
});