      // CẤU HÌNH
      const CONFIG = {
        API_URL: "/api/auth/login",
        TOKEN_KEY: "token",
        USER_KEY: "user",
        ADMIN_ROUTE: "/screen/admin/adminhome.html",
        USER_ROUTE: "/screen/user/userhome.html",
        SIGNUP_ROUTE: "/screen/guest/signup.html",
      };

      // BIẾN TOÀN CỤC
      let isSubmitting = false;
      let lastSubmitTime = 0;
      const SUBMIT_DELAY = 1000; // 1 giây giữa các lần submit

      // DOM ELEMENTS
      const $ = (id) => document.getElementById(id);
      const elements = {
        form: $("loginForm"),
        username: $("username"),
        password: $("password"),
        remember: $("remember"),
        togglePwd: $("togglePwd"),
        submitBtn: $("submitBtn"),
        errorMsg: $("errorMessage"),
        successMsg: $("successMessage"),
        loading: $("loading"),
      };

      // KHỞI TẠO ỨNG DỤNG
      document.addEventListener("DOMContentLoaded", () => {
        initApp();
        setupEventListeners();
      });

      // KHỞI TẠO
      function initApp() {
        // Kiểm tra đã login chưa
        if (localStorage.getItem(CONFIG.TOKEN_KEY)) {
          redirectToDashboard();
          return;
        }
        autoFillCredentials();
        // Tự động điền username nếu có remember
        if (localStorage.getItem("rememberMe") === "true") {
          const savedUsername = localStorage.getItem("savedUsername");
          if (savedUsername) {
            elements.username.value = savedUsername;
            elements.remember.checked = true;
            elements.password.focus();
          }
        }

        // Kiểm tra nếu đang trên mobile
        if (/Mobi|Android/i.test(navigator.userAgent)) {
          document.body.style.padding = "10px";
        }
      }

      // THIẾT LẬP EVENT LISTENERS
      function setupEventListeners() {
        // Form submit
        elements.form.addEventListener("submit", handleSubmit);

        // Toggle password visibility
        elements.togglePwd.addEventListener("click", togglePasswordVisibility);

        // Enter key support
        elements.username.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            elements.password.focus();
          }
        });

        elements.password.addEventListener("keypress", (e) => {
          if (e.key === "Enter" && !isSubmitting) {
            e.preventDefault();
            elements.form.requestSubmit();
          }
        });

        // Real-time validation
        elements.username.addEventListener(
          "input",
          debounce(validateUsername, 300)
        );
        elements.password.addEventListener(
          "input",
          debounce(validatePassword, 300)
        );

        // Prevent form resubmission
        elements.form.addEventListener("submit", preventDoubleSubmission);
      }

      // XỬ LÝ FORM SUBMIT
      async function handleSubmit(e) {
        e.preventDefault();

        // Rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < SUBMIT_DELAY) return;
        lastSubmitTime = now;

        // Validation
        const errors = validateForm();
        if (errors.length > 0) {
          showError(errors[0]);
          shakeForm();
          return;
        }

        // Chuẩn bị submit
        isSubmitting = true;
        elements.submitBtn.disabled = true;
        elements.submitBtn.innerHTML = "<span>Authenticating...</span>";
        hideMessages();
        elements.loading.style.display = "flex";

        // Gửi request
        try {
          const response = await fetchWithTimeout(
            CONFIG.API_URL,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
              body: JSON.stringify({
                username: elements.username.value.trim(),
                password: elements.password.value.trim(),
              }),
            },
            10000
          ); // 10 seconds timeout

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.message || `HTTP ${response.status}`);
          }

          if (result.success) {
            await handleLoginSuccess(result.data);
          } else {
            throw new Error(result.message || "Login failed");
          }
        } catch (error) {
          handleLoginError(error);
        } finally {
          resetSubmitState();
        }
      }

      // XỬ LÝ LOGIN THÀNH CÔNG
      async function handleLoginSuccess(data) {
        // Lưu token và user info
        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.account));

        // Lưu remember me
        if (elements.remember.checked) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("savedUsername", elements.username.value.trim());
          localStorage.setItem('savedPassword', elements.password.value);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("savedUsername");
          localStorage.removeItem('savedPassword');
        }

        // Hiển thị success message
        showSuccess("Login successful! Redirecting...");

        // Thêm hiệu ứng
        elements.form.style.opacity = "0.7";
        elements.form.style.transform = "scale(0.98)";
        elements.form.style.transition = "all 0.3s";

        // Redirect sau 1 giây
        setTimeout(() => {
          redirectToDashboard();
        }, 1000);
      }

      // XỬ LÝ LỖI
      function handleLoginError(error) {
        console.error("Login error:", error);

        let errorMessage = "Login failed. Please try again.";

        if (error.name === "AbortError" || error.message.includes("timeout")) {
          errorMessage = "Request timeout. Please check your connection.";
        } else if (error.message.includes("Network")) {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (
          error.message.includes("401") ||
          error.message.includes("Invalid")
        ) {
          errorMessage = "Invalid username or password.";
        }

        showError(errorMessage);
        shakeForm();

        // Clear password và focus lại
        elements.password.value = "";
        elements.password.focus();
      }

      // VALIDATION FUNCTIONS
      // Kiểm tra tính hợp lệ toàn bộ biểu mẫu
      function validateForm() {
        const errors = [];
        const username = elements.username.value.trim();
        const password = elements.password.value.trim();

        // Kiểm tra tài khoản: không trống, tối thiểu 3 ký tự, không chứa ký tự đặc biệt
        if (!username) errors.push("Username is required");
        else if (username.length < 3)
          errors.push("Username must be at least 3 characters");
        else if (!/^[a-zA-Z0-9_]+$/.test(username))
          errors.push("Username can only contain letters, numbers and underscores");

        // Kiểm tra mật khẩu: không trống và tối thiểu 6 ký tự
        if (!password) errors.push("Password is required");
        else if (password.length < 6)
          errors.push("Password must be at least 6 characters");

        return errors;
      }

      // Kiểm tra và đổi màu viền ô Username khi nhập liệu
      function validateUsername() {
        const username = elements.username.value.trim();
        if (username.length > 0 && username.length < 3) {
          elements.username.style.borderColor = "var(--error)";
        } else {
          elements.username.style.borderColor = "";
        }
      }

      // Kiểm tra và đổi màu viền ô Password khi nhập liệu
      function validatePassword() {
        const password = elements.password.value.trim();
        if (password.length > 0 && password.length < 6) {
          elements.password.style.borderColor = "var(--error)";
        } else {
          elements.password.style.borderColor = "";
        }
      }

      // HIỂN THỊ THÔNG BÁO LỖI (Ẩn sau 5 giây)
      function showError(message) {
        elements.errorMsg.querySelector("span").textContent = message;
        elements.errorMsg.style.display = "flex";
        elements.successMsg.style.display = "none";
        elements.loading.style.display = "none";

        setTimeout(() => {
          elements.errorMsg.style.display = "none";
        }, 5000);
      }

      // HIỂN THỊ THÔNG BÁO THÀNH CÔNG
      function showSuccess(message) {
        elements.successMsg.querySelector("span").textContent = message;
        elements.successMsg.style.display = "flex";
        elements.errorMsg.style.display = "none";
        elements.loading.style.display = "none";
      }

      // ẨN TẤT CẢ THÔNG BÁO VÀ TRẠNG THÁI CHỜ
      function hideMessages() {
        elements.errorMsg.style.display = "none";
        elements.successMsg.style.display = "none";
        elements.loading.style.display = "none";
      }

      // HIỆU ỨNG RUNG FORM KHI CÓ LỖI (Kèm rung vật lý trên mobile)
      function shakeForm() {
        elements.form.style.animation = "none";
        setTimeout(() => {
          elements.form.style.animation = "shake 0.5s";
        }, 10);

        // Chèn mã CSS keyframes cho hiệu ứng rung nếu chưa có
        if (!document.querySelector("#shake-style")) {
          const style = document.createElement("style");
          style.id = "shake-style";
          style.textContent = `
                    @keyframes shake {
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    }
                `;
          document.head.appendChild(style);
        }

        // Tạo phản hồi rung trên thiết bị di động hỗ trợ
        if ("vibrate" in navigator) {
          navigator.vibrate([50, 30, 50]);
        }
      }

      // UTILITY FUNCTIONS
      function togglePasswordVisibility() {
        const type =
          elements.password.type === "password" ? "text" : "password";
        elements.password.type = type;

        // Update icon
        const icon = elements.togglePwd.querySelector("svg");
        if (type === "text") {
          icon.innerHTML =
            '<path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.46-.14.95-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.02-.39-1.41 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16c-.64.32-1.37.5-2.14.5zm2.97-5.33c-.15-1.4-1.25-2.49-2.64-2.64l2.64 2.64z"/>';
        } else {
          icon.innerHTML =
            '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
        }
      }

      // Điều hướng người dùng dựa trên vai trò (Admin hoặc Customer)
      function redirectToDashboard() {
        const userStr = localStorage.getItem(CONFIG.USER_KEY);
        if (!userStr) {
          window.location.href = CONFIG.USER_ROUTE; // Về trang mặc định nếu chưa đăng nhập
          return;
        }

        try {
          const user = JSON.parse(userStr);
          // Kiểm tra quyền truy cập từ thông tin lưu trữ
          const isAdmin = user.roles && user.roles.includes("admin");
          window.location.href = isAdmin
            ? CONFIG.ADMIN_ROUTE // Trang quản trị xe
            : CONFIG.USER_ROUTE; // Trang người dùng mua xe
        } catch {
          window.location.href = CONFIG.USER_ROUTE;
        }
      }

      // Khôi phục trạng thái ban đầu của nút bấm sau khi xử lý xong
      function resetSubmitState() {
        isSubmitting = false;
        elements.submitBtn.disabled = false;
        elements.submitBtn.innerHTML = "<span>Sign In</span>";
        elements.loading.style.display = "none";
      }

      // Chống gửi trùng lặp dữ liệu khi người dùng nhấn nút nhiều lần
      function preventDoubleSubmission(e) {
        if (isSubmitting) {
          e.preventDefault();
          return false;
        }
      }

      // PERFORMANCE UTILITIES
      // Kỹ thuật Debounce: Trì hoãn thực thi hàm (tối ưu khi nhập liệu tìm kiếm xe)
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

      // Gọi API kèm cơ chế tự động hủy yêu cầu nếu phản hồi quá lâu (Timeout)
      async function fetchWithTimeout(resource, options = {}, timeout = 8000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout); // Tự động ngắt kết nối

        try {
          const response = await fetch(resource, {
            ...options,
            signal: controller.signal,
          });
          clearTimeout(id); // Hủy bộ đếm nếu phản hồi kịp lúc
          return response;
        } catch (error) {
          clearTimeout(id);
          throw error;
        }
      }
      // AUTO-RETRY FAILED REQUESTS (optional)
      async function fetchWithRetry(url, options, maxRetries = 2) {
        for (let i = 0; i < maxRetries; i++) {
          try {
            return await fetchWithTimeout(url, options);
          } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
          }
        }
      }
      function autoFillCredentials() {
        // 1. Ưu tiên lấy từ Đăng ký (sessionStorage)
        const signupUser = sessionStorage.getItem("signup_username");
        const signupPass = sessionStorage.getItem("signup_password");

        if (signupUser && signupPass) {
          // Điền vào ô input dùng biến elements có sẵn trong HTML của bạn
          elements.username.value = signupUser;
          elements.password.value = signupPass;

          // Kích hoạt sự kiện để UI nhận diện có chữ
          elements.username.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          elements.password.dispatchEvent(
            new Event("input", { bubbles: true })
          );

          // Xóa để bảo mật
          sessionStorage.removeItem("signup_username");
          sessionStorage.removeItem("signup_password");

          showSuccess("Account ready! Please log in.");
          return;
        }

        // 2. Nếu không có đăng ký mới thì mới xét Remember Me (localStorage)
        if (localStorage.getItem('rememberMe') === 'true') {
        const savedU = localStorage.getItem('savedUsername');
        const savedP = localStorage.getItem('savedPassword');
        
        if (savedU) {
            elements.username.value = savedU;
            elements.remember.checked = true;
        }
        if (savedP) {
            elements.password.value = savedP;
        }
        
        // Nếu đã có cả 2 thì không cần focus vào username nữa mà focus vào nút login luôn
        if(savedU && savedP) {
            elements.submitBtn.focus();
        }
    }
      }