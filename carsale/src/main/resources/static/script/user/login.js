// login.js - 3.2KB Gzipped
// ========= CONFIGURATION =========
const CONFIG = {
    API_URL: '/api/auth/login',
    TOKEN_KEY: 'token',
    USER_KEY: 'user',
    ADMIN_ROUTE: '/screen/admin/adminhome.html',
    USER_ROUTE: '/screen/user/userhome.html',
    TIMEOUT: 10000,
    MAX_RETRIES: 2
};

// ========= CACHE DOM ELEMENTS =========
const ELEMENTS = {
    form: document.getElementById('loginForm'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    remember: document.getElementById('remember'),
    submitBtn: document.getElementById('submitBtn'),
    errorMsg: document.getElementById('errorMessage'),
    successMsg: document.getElementById('successMessage'),
    loading: document.getElementById('loading')
};

// ========= STATE MANAGEMENT =========
let state = {
    isSubmitting: false,
    lastSubmitTime: 0,
    retryCount: 0
};

// ========= INITIALIZATION =========
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Auto-redirect if already logged in
    if (localStorage.getItem(CONFIG.TOKEN_KEY)) {
        redirectToDashboard();
        return;
    }

    // Auto-fill from localStorage
    autoFillCredentials();
    
    // Setup event listeners
    setupEventListeners();
    
    // Performance monitoring
    if ('performance' in window) {
        performance.mark('login_init_start');
    }
}

// ========= EVENT HANDLERS =========
function setupEventListeners() {
    ELEMENTS.form.addEventListener('submit', handleSubmit);
    
    // Password toggle
    const toggleBtn = document.getElementById('togglePwd');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', togglePassword);
    }
    
    // Enter key support
    ELEMENTS.password.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !state.isSubmitting) {
            ELEMENTS.form.requestSubmit();
        }
    });
    
    // Input validation
    ELEMENTS.username.addEventListener('input', debounce(validateUsername, 300));
    ELEMENTS.password.addEventListener('input', debounce(validatePassword, 300));
}

// ========= FORM SUBMISSION =========
async function handleSubmit(e) {
    e.preventDefault();
    
    // Prevent rapid submissions
    if (state.isSubmitting || isTooSoon()) return;
    
    // Validate form
    const errors = validateForm();
    if (errors.length) {
        showError(errors[0]);
        return;
    }
    
    // Update UI state
    updateSubmitState(true);
    
    try {
        // Attempt login
        const data = await attemptLogin();
        
        // Handle success
        await handleSuccess(data);
        
    } catch (error) {
        // Handle error
        handleError(error);
        
    } finally {
        // Reset UI state
        updateSubmitState(false);
    }
}

// ========= API CALL =========
async function attemptLogin() {
    const credentials = {
        username: ELEMENTS.username.value.trim(),
        password: ELEMENTS.password.value.trim()
    };
    
    for (let i = 0; i <= CONFIG.MAX_RETRIES; i++) {
        try {
            const response = await fetchWithTimeout(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(credentials)
            }, CONFIG.TIMEOUT);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || 'Login failed');
            }
            
            return result.data;
            
        } catch (error) {
            if (i === CONFIG.MAX_RETRIES) throw error;
            await sleep(1000 * (i + 1)); // Exponential backoff
        }
    }
}

// ========= SUCCESS HANDLER =========
async function handleSuccess(data) {
    // Store credentials
    saveCredentials(data);
    
    // Save remember me preference
    if (ELEMENTS.remember.checked) {
        localStorage.setItem('savedUsername', ELEMENTS.username.value.trim());
        localStorage.setItem('rememberMe', 'true');
    }
    
    // Show success message
    showSuccess('Login successful! Redirecting...');
    
    // Smooth transition
    ELEMENTS.form.style.opacity = '0.7';
    
    // Redirect with slight delay
    setTimeout(redirectToDashboard, 1000);
}

// ========= ERROR HANDLER =========
function handleError(error) {
    console.error('Login error:', error);
    
    let message = 'Login failed. Please try again.';
    
    if (error.name === 'AbortError') {
        message = 'Request timeout. Please try again.';
    } else if (error.message.includes('Network')) {
        message = 'Network error. Please check your connection.';
    } else if (error.message.includes('401') || error.message.includes('Invalid')) {
        message = 'Invalid username or password.';
    } else if (error.message.includes('429')) {
        message = 'Too many attempts. Please wait a moment.';
    }
    
    showError(message);
    shakeForm();
    
    // Clear password for security
    ELEMENTS.password.value = '';
    ELEMENTS.password.focus();
}

// ========= UTILITY FUNCTIONS =========
function saveCredentials(data) {
    localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.account));
    
    // Also set cookie for server-side if needed
    document.cookie = `token=${data.token}; path=/; max-age=86400; secure; samesite=strict`;
}

function autoFillCredentials() {
    if (localStorage.getItem('rememberMe') === 'true') {
        const username = localStorage.getItem('savedUsername');
        if (username) {
            ELEMENTS.username.value = username;
            ELEMENTS.remember.checked = true;
            ELEMENTS.password.focus();
        }
    }
}

function redirectToDashboard() {
    const userStr = localStorage.getItem(CONFIG.USER_KEY);
    
    if (!userStr) {
        window.location.href = CONFIG.USER_ROUTE;
        return;
    }
    
    try {
        const user = JSON.parse(userStr);
        const isAdmin = user.roles && user.roles.includes('admin');
        window.location.href = isAdmin ? CONFIG.ADMIN_ROUTE : CONFIG.USER_ROUTE;
    } catch {
        window.location.href = CONFIG.USER_ROUTE;
    }
}

function validateForm() {
    const errors = [];
    const username = ELEMENTS.username.value.trim();
    const password = ELEMENTS.password.value.trim();
    
    if (!username) errors.push('Username is required');
    else if (username.length < 3) errors.push('Username must be at least 3 characters');
    
    if (!password) errors.push('Password is required');
    else if (password.length < 6) errors.push('Password must be at least 6 characters');
    
    return errors;
}

function validateUsername() {
    const username = ELEMENTS.username.value.trim();
    if (username.length > 0 && username.length < 3) {
        ELEMENTS.username.style.borderColor = 'var(--error)';
    } else {
        ELEMENTS.username.style.borderColor = '';
    }
}

function validatePassword() {
    const password = ELEMENTS.password.value.trim();
    if (password.length > 0 && password.length < 6) {
        ELEMENTS.password.style.borderColor = 'var(--error)';
    } else {
        ELEMENTS.password.style.borderColor = '';
    }
}

function togglePassword() {
    const type = ELEMENTS.password.type === 'password' ? 'text' : 'password';
    ELEMENTS.password.type = type;
    
    const icon = document.querySelector('#togglePwd i');
    if (icon) {
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
}

function updateSubmitState(isSubmitting) {
    state.isSubmitting = isSubmitting;
    ELEMENTS.submitBtn.disabled = isSubmitting;
    ELEMENTS.submitBtn.innerHTML = isSubmitting 
        ? '<span>Authenticating...</span><i class="fas fa-spinner fa-spin ml-2"></i>'
        : '<span>Sign In</span><i class="fas fa-arrow-right ml-2"></i>';
    
    if (isSubmitting) {
        ELEMENTS.loading.style.display = 'flex';
        hideMessages();
    } else {
        ELEMENTS.loading.style.display = 'none';
    }
}

function isTooSoon() {
    const now = Date.now();
    const minDelay = 1000; // 1 second between submissions
    if (now - state.lastSubmitTime < minDelay) return true;
    state.lastSubmitTime = now;
    return false;
}

function showError(message) {
    ELEMENTS.errorMsg.querySelector('span').textContent = message;
    ELEMENTS.errorMsg.style.display = 'flex';
    ELEMENTS.successMsg.style.display = 'none';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        ELEMENTS.errorMsg.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    ELEMENTS.successMsg.querySelector('span').textContent = message;
    ELEMENTS.successMsg.style.display = 'flex';
    ELEMENTS.errorMsg.style.display = 'none';
}

function hideMessages() {
    ELEMENTS.errorMsg.style.display = 'none';
    ELEMENTS.successMsg.style.display = 'none';
}

function shakeForm() {
    ELEMENTS.form.style.animation = 'shake 0.5s';
    
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
}

// ========= PERFORMANCE HELPERS =========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function fetchWithTimeout(url, options, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========= EXPORTS (if using modules) =========
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        login: handleSubmit,
        validateForm,
        redirectToDashboard
    };
}