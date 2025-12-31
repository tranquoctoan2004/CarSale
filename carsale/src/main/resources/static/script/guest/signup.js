// ===== CONFIGURATION =====
const CONFIG = {
    API: {
        REGISTER: '/api/auth/register',
        CHECK_ADMIN: '/api/auth/check-admin-exists',
        CHECK_USERNAME: '/api/auth/check-username/',
        CHECK_EMAIL: '/api/auth/check-email/'
    },
    ROUTES: {
        LOGIN: '/screen/user/login.html',
        TERMS: '/screen/guest/terms.html',
        PRIVACY: '/screen/guest/privacy.html'
    },
    STORAGE: {
        TOKEN: 'token',
        USER: 'user'
    },
    TIMEOUT: 10000,
    DEBOUNCE_DELAY: 500
};

// ===== STATE MANAGEMENT =====
const state = {
    isSubmitting: false,
    debounceTimers: {},
    formValidity: {
        username: { valid: false, available: false },
        email: { valid: false, available: false },
        password: { valid: false, strength: 0 },
        confirmPassword: { valid: false, match: false }
    }
};

// ===== DOM ELEMENTS =====
const $ = (id) => document.getElementById(id);
const elements = {
    // Form
    form: $('registerForm'),
    username: $('username'),
    fullName: $('fullName'),
    email: $('email'),
    phone: $('phone'),
    password: $('password'),
    confirmPassword: $('confirmPassword'),
    terms: $('terms'),
    
    // Buttons
    submitBtn: $('submitBtn'),
    togglePassword: $('togglePassword'),
    toggleConfirmPassword: $('toggleConfirmPassword'),
    googleBtn: $('googleBtn'),
    
    // Messages & Status
    errorMsg: $('errorMessage'),
    successMsg: $('successMessage'),
    loading: $('loading'),
    adminNotice: $('adminNotice'),
    
    // Status indicators
    usernameStatus: $('usernameStatus'),
    emailStatus: $('emailStatus'),
    passwordMatch: $('passwordMatch'),
    strengthBar: $('strengthBar'),
    strengthText: $('strengthText')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Check if already logged in
    if (localStorage.getItem(CONFIG.STORAGE.TOKEN)) {
        redirectToDashboard();
        return;
    }
    
    // Check admin existence
    checkAdminExists();
    
    // Setup event listeners
    setupEventListeners();
    
    // Auto-focus username field
    setTimeout(() => {
        if (elements.username) elements.username.focus();
    }, 100);
    
    // Performance monitoring
    if ('performance' in window) {
        performance.mark('signup_init_start');
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleSubmit);
    
    // Password visibility toggles
    elements.togglePassword.addEventListener('click', () => togglePasswordVisibility(elements.password, elements.togglePassword));
    elements.toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(elements.confirmPassword, elements.toggleConfirmPassword));
    
    // Real-time validation
    elements.username.addEventListener('input', debounce(validateUsername, CONFIG.DEBOUNCE_DELAY));
    elements.email.addEventListener('input', debounce(validateEmail, CONFIG.DEBOUNCE_DELAY));
    elements.password.addEventListener('input', validatePasswordStrength);
    elements.confirmPassword.addEventListener('input', validatePasswordMatch);
    
    // Enter key support
    elements.form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !state.isSubmitting) {
            if (e.target.type !== 'submit' && e.target.type !== 'checkbox') {
                e.preventDefault();
                moveToNextField(e.target);
            }
        }
    });
    
    // Google button
    elements.googleBtn.addEventListener('click', handleGoogleSignup);
    
    // Auto-format phone number
    elements.phone.addEventListener('input', formatPhoneNumber);
}

// ===== FORM SUBMISSION =====
async function handleSubmit(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (state.isSubmitting) return;
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
        showError(errors[0]);
        shakeForm();
        return;
    }
    
    // Update UI state
    updateSubmitState(true);
    
    try {
        // Prepare form data
        const formData = {
            username: elements.username.value.trim(),
            password: elements.password.value,
            email: elements.email.value.trim(),
            fullName: elements.fullName.value.trim(),
            phoneNumber: elements.phone.value.trim() || null
        };
        
        // Send registration request
        const result = await registerUser(formData);
        
        // Handle success
        await handleRegistrationSuccess(result);
        
    } catch (error) {
        // Handle error
        handleRegistrationError(error);
        
    } finally {
        // Reset UI state
        updateSubmitState(false);
    }
}

// ===== API FUNCTIONS =====
async function checkAdminExists() {
    try {
        const response = await fetchWithTimeout(CONFIG.API.CHECK_ADMIN, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, 5000);
        
        const result = await response.json();
        
        if (result.success && !result.data) {
            // No admin exists - show special notice
            elements.adminNotice.style.display = 'block';
        }
    } catch (error) {
        console.log('Could not check admin status:', error);
    }
}

async function checkUsernameAvailability(username) {
    if (username.length < 3) return false;
    
    try {
        const response = await fetchWithTimeout(`${CONFIG.API.CHECK_USERNAME}${encodeURIComponent(username)}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, 5000);
        
        const result = await response.json();
        return result.success ? !result.data : false;
    } catch (error) {
        console.log('Username check failed:', error);
        return false;
    }
}

async function checkEmailAvailability(email) {
    if (!isValidEmail(email)) return false;
    
    try {
        const response = await fetchWithTimeout(`${CONFIG.API.CHECK_EMAIL}${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, 5000);
        
        const result = await response.json();
        return result.success ? !result.data : false;
    } catch (error) {
        console.log('Email check failed:', error);
        return false;
    }
}

async function registerUser(formData) {
    const response = await fetchWithTimeout(CONFIG.API.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(formData)
    }, CONFIG.TIMEOUT);
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    if (!result.success) {
        throw new Error(result.message || 'Registration failed');
    }
    
    return result.data;
}

// ===== VALIDATION FUNCTIONS =====
function validateForm() {
    const errors = [];
    
    // Username validation
    if (!state.formValidity.username.valid) {
        errors.push('Username must be 3-30 characters (letters, numbers, underscores only)');
    } else if (!state.formValidity.username.available) {
        errors.push('Username is already taken');
    }
    
    // Full name validation
    const fullName = elements.fullName.value.trim();
    if (!fullName || fullName.length < 2) {
        errors.push('Full name must be at least 2 characters');
    }
    
    // Email validation
    if (!state.formValidity.email.valid) {
        errors.push('Please enter a valid email address');
    } else if (!state.formValidity.email.available) {
        errors.push('Email is already registered');
    }
    
    // Password validation
    if (!state.formValidity.password.valid) {
        errors.push('Password must be at least 6 characters');
    }
    
    // Password confirmation
    if (!state.formValidity.confirmPassword.match) {
        errors.push('Passwords do not match');
    }
    
    // Terms acceptance
    if (!elements.terms.checked) {
        errors.push('You must agree to the Terms & Conditions');
    }
    
    return errors;
}

async function validateUsername() {
    const username = elements.username.value.trim();
    const statusEl = elements.usernameStatus;
    
    // Reset status
    statusEl.textContent = '';
    statusEl.className = 'field-status';
    
    // Basic validation
    if (username.length === 0) {
        state.formValidity.username.valid = false;
        return;
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    const isValid = usernameRegex.test(username);
    
    if (!isValid) {
        statusEl.textContent = '3-30 characters, letters, numbers, underscores only';
        statusEl.className = 'field-status invalid';
        state.formValidity.username.valid = false;
        return;
    }
    
    // Check availability
    statusEl.textContent = 'Checking availability...';
    
    const isAvailable = await checkUsernameAvailability(username);
    
    if (isAvailable) {
        statusEl.textContent = '✓ Available';
        statusEl.className = 'field-status valid';
        state.formValidity.username = { valid: true, available: true };
    } else {
        statusEl.textContent = '✗ Username taken';
        statusEl.className = 'field-status invalid';
        state.formValidity.username = { valid: true, available: false };
    }
}

async function validateEmail() {
    const email = elements.email.value.trim();
    const statusEl = elements.emailStatus;
    
    // Reset status
    statusEl.textContent = '';
    statusEl.className = 'field-status';
    
    // Basic validation
    if (email.length === 0) {
        state.formValidity.email.valid = false;
        return;
    }
    
    const isValid = isValidEmail(email);
    
    if (!isValid) {
        statusEl.textContent = 'Please enter a valid email address';
        statusEl.className = 'field-status invalid';
        state.formValidity.email.valid = false;
        return;
    }
    
    // Check availability
    statusEl.textContent = 'Checking availability...';
    
    const isAvailable = await checkEmailAvailability(email);
    
    if (isAvailable) {
        statusEl.textContent = '✓ Available';
        statusEl.className = 'field-status valid';
        state.formValidity.email = { valid: true, available: true };
    } else {
        statusEl.textContent = '✗ Email already registered';
        statusEl.className = 'field-status invalid';
        state.formValidity.email = { valid: true, available: false };
    }
}

function validatePasswordStrength() {
    const password = elements.password.value;
    const strengthBar = elements.strengthBar;
    const strengthText = elements.strengthText;
    
    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'strength-bar';
        strengthText.textContent = 'Password strength: None';
        state.formValidity.password.valid = false;
        state.formValidity.password.strength = 0;
        return;
    }
    
    // Calculate strength
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 10; // Uppercase
    if (/[a-z]/.test(password)) strength += 10; // Lowercase
    if (/[0-9]/.test(password)) strength += 10; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 10; // Special chars
    
    // Ensure max 100%
    strength = Math.min(strength, 100);
    
    // Update UI
    strengthBar.style.width = `${strength}%`;
    
    // Set strength class
    if (strength < 40) {
        strengthBar.className = 'strength-bar strength-weak';
        strengthText.textContent = 'Password strength: Weak';
    } else if (strength < 70) {
        strengthBar.className = 'strength-bar strength-medium';
        strengthText.textContent = 'Password strength: Medium';
    } else if (strength < 90) {
        strengthBar.className = 'strength-bar strength-strong';
        strengthText.textContent = 'Password strength: Strong';
    } else {
        strengthBar.className = 'strength-bar strength-very-strong';
        strengthText.textContent = 'Password strength: Very Strong';
    }
    
    // Update state
    state.formValidity.password.valid = password.length >= 6;
    state.formValidity.password.strength = strength;
    
    // Also validate password match
    validatePasswordMatch();
}

function validatePasswordMatch() {
    const password = elements.password.value;
    const confirmPassword = elements.confirmPassword.value;
    const statusEl = elements.passwordMatch;
    
    if (confirmPassword.length === 0) {
        statusEl.textContent = '';
        statusEl.className = 'field-status';
        state.formValidity.confirmPassword = { valid: false, match: false };
        return;
    }
    
    if (password === confirmPassword) {
        statusEl.textContent = '✓ Passwords match';
        statusEl.className = 'field-status valid';
        state.formValidity.confirmPassword = { valid: true, match: true };
    } else {
        statusEl.textContent = '✗ Passwords do not match';
        statusEl.className = 'field-status invalid';
        state.formValidity.confirmPassword = { valid: false, match: false };
    }
}

// ===== SUCCESS HANDLER =====
async function handleRegistrationSuccess(userData) {
    // Store user data
    localStorage.setItem(CONFIG.STORAGE.TOKEN, userData.token);
    localStorage.setItem(CONFIG.STORAGE.USER, JSON.stringify(userData.account));
    
    // Get admin notice status
    const isFirstUser = elements.adminNotice.style.display === 'block';
    
    // Show success message
    const message = isFirstUser
        ? '🎉 Congratulations! You are the first user and now have ADMIN privileges!'
        : '✅ Registration successful! Welcome to CarSale!';
    
    showSuccess(message);
    
    // Add success animation
    elements.form.style.opacity = '0.7';
    elements.form.style.transform = 'scale(0.98)';
    elements.form.style.transition = 'all 0.3s';
    
    // Redirect to login after delay
    setTimeout(() => {
        window.location.href = CONFIG.ROUTES.LOGIN;
    }, 2000);
}

// ===== ERROR HANDLER =====
function handleRegistrationError(error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.name === 'AbortError') {
        errorMessage = 'Request timeout. Please try again.';
    } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.';
    } else if (error.message.includes('400') || error.message.includes('Invalid')) {
        errorMessage = 'Invalid data. Please check your inputs.';
    } else if (error.message.includes('409') || error.message.includes('exists')) {
        errorMessage = 'Username or email already exists.';
    }
    
    showError(errorMessage);
    shakeForm();
}

// ===== UI HELPERS =====
function showError(message) {
    const span = elements.errorMsg.querySelector('span');
    if (span) span.textContent = message;
    elements.errorMsg.style.display = 'flex';
    elements.successMsg.style.display = 'none';
    elements.loading.style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        elements.errorMsg.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    const span = elements.successMsg.querySelector('span');
    if (span) span.textContent = message;
    elements.successMsg.style.display = 'flex';
    elements.errorMsg.style.display = 'none';
    elements.loading.style.display = 'none';
}

function updateSubmitState(isSubmitting) {
    state.isSubmitting = isSubmitting;
    elements.submitBtn.disabled = isSubmitting;
    elements.submitBtn.innerHTML = isSubmitting
        ? '<span>Creating Account...</span>'
        : '<span>Create Account</span>';
    
    if (isSubmitting) {
        elements.loading.style.display = 'flex';
    } else {
        elements.loading.style.display = 'none';
    }
}

function shakeForm() {
    elements.form.style.animation = 'none';
    setTimeout(() => {
        elements.form.style.animation = 'shake 0.5s';
    }, 10);
    
    // Add shake animation if not present
    if (!document.querySelector('#shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Haptic feedback for mobile
    if ('vibrate' in navigator) {
        navigator.vibrate([50, 30, 50]);
    }
}

// ===== UTILITY FUNCTIONS =====
function togglePasswordVisibility(passwordField, toggleButton) {
    const type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
    
    // Update icon
    const icon = toggleButton.querySelector('svg');
    if (type === 'text') {
        icon.innerHTML = '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.46-.14.95-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z"/>';
    } else {
        icon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    }
}

function moveToNextField(currentField) {
    const formElements = Array.from(elements.form.elements);
    const currentIndex = formElements.indexOf(currentField);
    
    if (currentIndex < formElements.length - 1) {
        formElements[currentIndex + 1].focus();
    }
}

function formatPhoneNumber() {
    let value = elements.phone.value.replace(/\D/g, '');
    
    if (value.length > 3 && value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    }
    
    elements.phone.value = value;
}

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

async function handleGoogleSignup() {
    alert('Google signup functionality would be implemented here.');
    // In a real app, you would:
    // 1. Redirect to Google OAuth
    // 2. Handle the callback
    // 3. Create/authenticate user
}

// ===== HELPER FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(state.debounceTimers[func.name]);
            func(...args);
        };
        clearTimeout(state.debounceTimers[func.name]);
        state.debounceTimers[func.name] = setTimeout(later, wait);
    };
}

async function fetchWithTimeout(resource, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', () => {
    if ('performance' in window) {
        performance.mark('signup_load_end');
        performance.measure('signup_load_time', 'signup_init_start', 'signup_load_end');
        
        const measure = performance.getEntriesByName('signup_load_time')[0];
        console.log(`Signup page loaded in ${measure.duration.toFixed(2)}ms`);
    }
});

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateUsername,
        validateEmail,
        validatePasswordStrength,
        isValidEmail,
        handleSubmit
    };
}