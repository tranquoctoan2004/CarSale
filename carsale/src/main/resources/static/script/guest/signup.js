// signup.js
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin exists to show special notice
    checkAdminExists();
    
    // Setup form validation
    setupValidation();
    
    // Handle form submission
    document.getElementById('registerForm').addEventListener('submit', handleSignup);
});

function showMessage(message, isSuccess) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (isSuccess) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        errorDiv.style.display = 'none';
    } else {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
    }
    
    // Auto hide messages after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
    }, 5000);
}

function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
    const submitBtn = document.querySelector('.signup-btn');
    if (submitBtn) {
        submitBtn.disabled = show;
    }
}

async function checkAdminExists() {
    try {
        const response = await fetch('/api/auth/check-admin-exists');
        const result = await response.json();
        
        if (result.success && !result.data) {
            // No admin exists yet - show special notice
            document.getElementById('adminNotice').style.display = 'block';
        }
    } catch (error) {
        console.log('Could not check admin status:', error);
    }
}

function setupValidation() {
    // Real-time password validation
    document.getElementById('password').addEventListener('input', function() {
        const errorDiv = document.getElementById('passwordError');
        errorDiv.style.display = this.value.length < 6 && this.value.length > 0 ? 'block' : 'none';
    });

    // Real-time confirm password validation
    document.getElementById('confirm').addEventListener('input', function() {
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('confirmError');
        errorDiv.style.display = this.value !== password && this.value.length > 0 ? 'block' : 'none';
    });

    // Real-time username availability check
    let usernameTimeout;
    document.getElementById('username').addEventListener('input', function() {
        clearTimeout(usernameTimeout);
        const username = this.value.trim();
        
        if (username.length >= 3) {
            usernameTimeout = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/auth/check-username/${username}`);
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        showMessage('Username already taken', false);
                    }
                } catch (error) {
                    console.log('Username check failed:', error);
                }
            }, 500);
        }
    });

    // Real-time email availability check
    let emailTimeout;
    document.getElementById('email').addEventListener('input', function() {
        clearTimeout(emailTimeout);
        const email = this.value.trim();
        
        if (email.includes('@')) {
            emailTimeout = setTimeout(async () => {
                try {
                    const response = await fetch(`/api/auth/check-email/${email}`);
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        showMessage('Email already registered', false);
                    }
                } catch (error) {
                    console.log('Email check failed:', error);
                }
            }, 500);
        }
    });
}

function validateForm() {
    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const terms = document.getElementById('terms').checked;

    // Reset errors
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('confirmError').style.display = 'none';

    // Basic validation
    if (!username || !fullName || !email || !password || !confirm) {
        showMessage('Please fill all required fields', false);
        return false;
    }

    if (username.length < 3) {
        showMessage('Username must be at least 3 characters', false);
        return false;
    }

    if (fullName.length < 2) {
        showMessage('Full name must be at least 2 characters', false);
        return false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').style.display = 'block';
        return false;
    }

    if (password !== confirm) {
        document.getElementById('confirmError').style.display = 'block';
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', false);
        return false;
    }

    if (!terms) {
        showMessage('Please agree to the Terms & Conditions', false);
        return false;
    }

    return true;
}

async function handleSignup(event) {
    event.preventDefault();
    
    if (!validateForm()) return;

    showLoading(true);
    showMessage('', false);

    try {
        const formData = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            email: document.getElementById('email').value.trim(),
            fullName: document.getElementById('fullName').value.trim(),
            phoneNumber: document.getElementById('phone').value.trim() || null
        };

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        showLoading(false);

        if (result.success) {
            const isFirstUser = document.getElementById('adminNotice').style.display === 'block';
            const message = isFirstUser 
                ? '🎉 Congratulations! You are the first user and now have ADMIN privileges!'
                : '✅ Registration successful! Welcome to CarSale!';
            
            showMessage(message, true);
            
            // Clear form
            document.getElementById('registerForm').reset();
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                window.location.href = '/screen/user/login.html';
            }, 3000);
        } else {
            showMessage('❌ ' + (result.message || 'Registration failed'), false);
        }
    } catch (error) {
        showLoading(false);
        console.error('Registration error:', error);
        showMessage('⚠️ Server error. Please try again later.', false);
    }
}

// Terms & Conditions page (simple version)
function createTermsPage() {
    // This function would create a simple terms page if needed
    // For now, we'll just have a placeholder link
}