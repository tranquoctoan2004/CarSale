// ===== CONFIGURATION =====
const CONFIG = {
    API: {
        REGISTER: '/api/auth/register',
        CHECK_ADMIN: '/api/auth/check-admin-exists'
    },
    ROUTES: {
        LOGIN: '/screen/user/login.html'
    },
    STORAGE: {
        TOKEN: 'token',
        USER: 'user'
    }
};

// ===== STATE =====
let isSubmitting = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (localStorage.getItem(CONFIG.STORAGE.TOKEN)) {
        redirectToDashboard();
        return;
    }
    
    // Check if admin exists (không bắt lỗi, chỉ thử)
    tryCheckAdminExists();
    
    // Setup form validation và features
    setupFormFeatures();
    
    // Handle form submission
    document.getElementById('registerForm').addEventListener('submit', handleSignup);
    
    // Focus on username field
    setTimeout(() => {
        const usernameInput = document.getElementById('username');
        if (usernameInput) usernameInput.focus();
    }, 100);
});

// ===== UI FUNCTIONS =====
function showMessage(message, isSuccess) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (!errorDiv || !successDiv) return;
    
    // Update message
    const span = isSuccess ? successDiv.querySelector('span') : errorDiv.querySelector('span');
    if (span) span.textContent = message;
    
    // Show/hide appropriate div
    if (isSuccess) {
        successDiv.style.display = 'flex';
        errorDiv.style.display = 'none';
    } else {
        errorDiv.style.display = 'flex';
        successDiv.style.display = 'none';
    }
    
    // Auto hide after 5 seconds (chỉ hide error, success tự redirect)
    if (!isSuccess) {
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    const submitBtn = document.getElementById('submitBtn');
    
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'flex' : 'none';
    }
    
    if (submitBtn) {
        submitBtn.disabled = show;
        submitBtn.innerHTML = show 
            ? '<span><div class="mini-spinner"></div> Creating Account...</span>' 
            : '<span>Create Account</span>';
    }
}

// ===== ADMIN CHECK (KHÔNG BẮT LỖI) =====
async function tryCheckAdminExists() {
    try {
        const response = await fetch(CONFIG.API.CHECK_ADMIN, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const result = await response.json();
            if (result.success && !result.data) {
                // No admin exists yet - show special notice
                const adminNotice = document.getElementById('adminNotice');
                if (adminNotice) {
                    adminNotice.style.display = 'block';
                }
            }
        }
    } catch (error) {
        // Không làm gì cả, bỏ qua lỗi
        console.log('Admin check ignored (optional)');
    }
}

// ===== SETUP FORM FEATURES =====
function setupFormFeatures() {
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', validatePasswordStrength);
    }
    
    // Password match validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
    
    // Password visibility toggle
    setupPasswordToggle();
    
    // Google button
    const googleBtn = document.getElementById('googleBtn');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            alert('Google signup would be implemented here. For now, please use the form above.');
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length > 3 && value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
            
            this.value = value;
        });
    }
    
    // Clear field status on focus (để xóa message "Service unavailable")
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            const fieldId = this.id + 'Status';
            const statusElement = document.getElementById(fieldId);
            if (statusElement && statusElement.textContent.includes('unavailable')) {
                statusElement.textContent = '';
                statusElement.className = 'field-status';
            }
        });
    });
}

function setupPasswordToggle() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    const toggleVisibility = (inputId, button) => {
        const input = document.getElementById(inputId);
        if (input) {
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            // Update icon
            const icon = button.querySelector('svg');
            if (icon) {
                if (type === 'text') {
                    icon.innerHTML = '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.46-.14.95-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z"/>';
                } else {
                    icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
                }
            }
        }
    };
    
    if (togglePassword) {
        togglePassword.addEventListener('click', () => toggleVisibility('password', togglePassword));
    }
    
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => toggleVisibility('confirmPassword', toggleConfirmPassword));
    }
}

// ===== PASSWORD VALIDATION =====
function validatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        if (strengthBar) {
            strengthBar.style.width = '0%';
            strengthBar.className = 'strength-bar';
        }
        if (strengthText) {
            strengthText.textContent = 'Password strength: None';
        }
        return;
    }
    
    // Tính strength đơn giản
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Update UI
    if (strengthBar) {
        strengthBar.style.width = `${strength}%`;
        
        if (strength < 50) {
            strengthBar.className = 'strength-bar strength-weak';
            if (strengthText) strengthText.textContent = 'Password strength: Weak';
        } else if (strength < 75) {
            strengthBar.className = 'strength-bar strength-medium';
            if (strengthText) strengthText.textContent = 'Password strength: Medium';
        } else {
            strengthBar.className = 'strength-bar strength-strong';
            if (strengthText) strengthText.textContent = 'Password strength: Strong';
        }
    }
    
    // Validate match
    validatePasswordMatch();
}

function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const matchElement = document.getElementById('passwordMatch');
    
    if (!matchElement) return;
    
    if (!confirmPassword) {
        matchElement.textContent = '';
        matchElement.className = 'field-status';
        return;
    }
    
    if (password === confirmPassword) {
        matchElement.textContent = '✓ Passwords match';
        matchElement.className = 'field-status valid';
    } else {
        matchElement.textContent = '✗ Passwords do not match';
        matchElement.className = 'field-status invalid';
    }
}

// ===== FORM VALIDATION =====
function validateForm() {
    const username = document.getElementById('username').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms');

    // Clear all previous messages
    showMessage('', false);
    
    // Kiểm tra required fields
    const errors = [];
    
    if (!username) errors.push('Username is required');
    else if (username.length < 3) errors.push('Username must be at least 3 characters');
    
    if (!fullName) errors.push('Full name is required');
    else if (fullName.length < 2) errors.push('Full name must be at least 2 characters');
    
    if (!email) errors.push('Email is required');
    else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
    
    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters');
    
    if (!confirmPassword) errors.push('Please confirm your password');
    else if (password !== confirmPassword) errors.push('Passwords do not match');
    
    if (!terms || !terms.checked) errors.push('Please agree to the Terms & Conditions');
    
    // Hiển thị lỗi đầu tiên nếu có
    if (errors.length > 0) {
        showMessage(errors[0], false);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== FORM SUBMISSION =====
async function handleSignup(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form (chỉ client-side)
    if (!validateForm()) return;

    isSubmitting = true;
    showLoading(true);

    try {
        const formData = {
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            email: document.getElementById('email').value.trim(),
            fullName: document.getElementById('fullName').value.trim(),
            phoneNumber: document.getElementById('phone').value.trim() || null
        };

        console.log('Attempting registration with:', formData);

        // Gửi request đăng ký
        const response = await fetch(CONFIG.API.REGISTER, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        
        console.log('Registration response:', result);

        if (result.success) {
            // Hiển thị thông báo thành công
            const isFirstUser = document.getElementById('adminNotice')?.style.display === 'block';
            const message = isFirstUser 
                ? '🎉 Congratulations! Registration successful!'
                : '✅ Registration successful! Welcome to CarSale!';
            
            showMessage(message, true);
            
            // Lưu token nếu có
            if (result.data && result.data.token) {
                localStorage.setItem(CONFIG.STORAGE.TOKEN, result.data.token);
                if (result.data.account) {
                    localStorage.setItem(CONFIG.STORAGE.USER, JSON.stringify(result.data.account));
                }
            }
            
            // Reset form
            document.getElementById('registerForm').reset();
            
            // Reset password strength
            const strengthBar = document.getElementById('strengthBar');
            const strengthText = document.getElementById('strengthText');
            if (strengthBar) strengthBar.style.width = '0%';
            if (strengthText) strengthText.textContent = 'Password strength: None';
            
            // Chuyển hướng sau 2 giây
            setTimeout(() => {
                window.location.href = CONFIG.ROUTES.LOGIN;
            }, 2000);
            
        } else {
            // Xử lý lỗi từ server
            let errorMessage = result.message || 'Registration failed';
            
            // Cải thiện thông báo lỗi
            if (errorMessage.includes('username') && errorMessage.includes('exists')) {
                errorMessage = 'Username already exists. Please choose another one.';
            } else if (errorMessage.includes('email') && errorMessage.includes('exists')) {
                errorMessage = 'Email already registered. Please use another email.';
            } else if (errorMessage.includes('password')) {
                errorMessage = 'Password requirements not met.';
            }
            
            showMessage('❌ ' + errorMessage, false);
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        
        // Xử lý các loại lỗi
        let errorMessage = 'Registration failed. ';
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage += 'Network error. Please check your connection.';
        } else if (error.name === 'AbortError') {
            errorMessage += 'Request timeout. Please try again.';
        } else if (error.message && error.message.includes('500')) {
            errorMessage += 'Server error. The username or email might already exist.';
        } else {
            errorMessage += 'Please try again.';
        }
        
        showMessage('⚠️ ' + errorMessage, false);
        
    } finally {
        showLoading(false);
        isSubmitting = false;
    }
}

// ===== REDIRECT =====
function redirectToDashboard() {
    const userStr = localStorage.getItem(CONFIG.STORAGE.USER);
    
    if (!userStr) {
        window.location.href = CONFIG.ROUTES.LOGIN;
        return;
    }
    
    try {
        const user = JSON.parse(userStr);
        const isAdmin = user.roles && user.roles.includes('admin');
        window.location.href = isAdmin 
            ? '/screen/admin/adminhome.html'
            : '/screen/user/userhome.html';
    } catch {
        window.location.href = CONFIG.ROUTES.LOGIN;
    }
}

// ===== THÊM CSS CHO MINI SPINNER =====
document.head.insertAdjacentHTML('beforeend', `
<style>
    .mini-spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: mini-spin 1s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    }
    
    @keyframes mini-spin {
        to { transform: rotate(360deg); }
    }
    
    /* Shake animation for errors */
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .shake {
        animation: shake 0.5s;
    }
</style>
`);