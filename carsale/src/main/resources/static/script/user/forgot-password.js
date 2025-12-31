// ===== CẤU HÌNH =====
const CONFIG = {
    API: {
        FORGOT_PASSWORD: '/api/auth/forgot-password',
        CHECK_EMAIL: '/api/auth/check-email/'
    },
    ROUTES: {
        LOGIN: '/screen/user/login.html'
    }
};

// ===== BIẾN TOÀN CỤC =====
let isSubmitting = false;

// ===== DOM ELEMENTS =====
const $ = (id) => document.getElementById(id);
const elements = {
    form: $('forgotForm'),
    email: $('email'),
    submitBtn: $('submitBtn'),
    errorMsg: $('errorMessage'),
    successMsg: $('successMessage'),
    loading: $('loading')
};

// ===== KHỞI TẠO =====
document.addEventListener('DOMContentLoaded', init);

function init() {
    // Tự động focus vào input email
    setTimeout(() => {
        if (elements.email) elements.email.focus();
    }, 100);
    
    // Setup event listeners
    setupEventListeners();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form submission
    elements.form.addEventListener('submit', handleSubmit);
    
    // Enter key support
    elements.email.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isSubmitting) {
            e.preventDefault();
            elements.form.requestSubmit();
        }
    });
    
    // Real-time email validation
    elements.email.addEventListener('input', debounce(validateEmail, 300));
}

// ===== FORM SUBMISSION =====
async function handleSubmit(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    // Validate email
    const email = elements.email.value.trim();
    if (!validateEmailFormat(email)) {
        showError('Vui lòng nhập email hợp lệ');
        return;
    }
    
    // Update UI state
    updateSubmitState(true);
    
    try {
        // Send reset password request
        const result = await sendResetRequest(email);
        
        // Handle success
        handleSuccess(result);
        
    } catch (error) {
        // Handle error
        handleError(error);
        
    } finally {
        // Reset UI state
        updateSubmitState(false);
    }
}

// ===== API FUNCTIONS =====
async function sendResetRequest(email) {
    const response = await fetchWithTimeout(CONFIG.API.FORGOT_PASSWORD, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ email })
    }, 10000);
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
    }
    
    if (!result.success) {
        throw new Error(result.message || 'Gửi yêu cầu thất bại');
    }
    
    return result.data;
}

async function checkEmailExists(email) {
    try {
        const response = await fetchWithTimeout(`${CONFIG.API.CHECK_EMAIL}${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }, 5000);
        
        const result = await response.json();
        return result.success ? result.data : false;
    } catch (error) {
        console.log('Email check failed:', error);
        return null;
    }
}

// ===== VALIDATION FUNCTIONS =====
function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function validateEmail() {
    const email = elements.email.value.trim();
    
    if (!validateEmailFormat(email)) {
        elements.email.style.borderColor = 'var(--error)';
        return false;
    }
    
    // Optional: Check if email exists in database
    const emailExists = await checkEmailExists(email);
    if (emailExists === false) {
        elements.email.style.borderColor = 'var(--error)';
        return false;
    }
    
    elements.email.style.borderColor = '';
    return true;
}

// ===== SUCCESS HANDLER =====
function handleSuccess() {
    // Show success message
    showSuccess('Đã gửi liên kết đặt lại mật khẩu! Kiểm tra email của bạn.');
    
    // Clear form
    elements.form.reset();
    
    // Redirect to login after 5 seconds
    setTimeout(() => {
        window.location.href = CONFIG.ROUTES.LOGIN;
    }, 5000);
}

// ===== ERROR HANDLER =====
function handleError(error) {
    console.error('Forgot password error:', error);
    
    let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại.';
    
    if (error.name === 'AbortError') {
        errorMessage = 'Hết thời gian chờ. Vui lòng kiểm tra kết nối.';
    } else if (error.message.includes('Network')) {
        errorMessage = 'Lỗi mạng. Vui lòng kiểm tra kết nối internet.';
    } else if (error.message.includes('404') || error.message.includes('not found')) {
        errorMessage = 'Email không tồn tại trong hệ thống.';
    } else if (error.message.includes('429')) {
        errorMessage = 'Quá nhiều yêu cầu. Vui lòng đợi vài phút.';
    }
    
    showError(errorMessage);
    
    // Focus back to email field
    elements.email.focus();
}

// ===== UI HELPERS =====
function showError(message) {
    const span = elements.errorMsg.querySelector('span');
    if (span) span.textContent = message;
    elements.errorMsg.style.display = 'flex';
    elements.successMsg.style.display = 'none';
    
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
}

function updateSubmitState(isSubmitting) {
    isSubmitting = isSubmitting;
    elements.submitBtn.disabled = isSubmitting;
    elements.submitBtn.textContent = isSubmitting
        ? 'Đang gửi...'
        : 'Gửi liên kết đặt lại';
    
    if (isSubmitting) {
        elements.loading.style.display = 'flex';
    } else {
        elements.loading.style.display = 'none';
    }
}

// ===== UTILITY FUNCTIONS =====
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

// ===== TRÌNH TỰ HOẠT ĐỘNG =====
// 1. Người dùng nhập email
// 2. Validate email format
// 3. Gửi request đến server
// 4. Server gửi email reset password
// 5. Hiển thị thông báo thành công
// 6. Tự động redirect về trang login

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmailFormat,
        handleSubmit,
        sendResetRequest
    };
}