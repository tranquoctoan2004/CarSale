package com.firefire.carsale.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;

    public AuthInterceptor(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // 1. Tài nguyên tĩnh (Static resources)
        // Lưu ý: Đổi /images/ thành /image/ để khớp với WebMvcConfig
        if (path.startsWith("/screen/") ||
                path.startsWith("/style/") ||
                path.startsWith("/script/") ||
                path.startsWith("/image/") ||
                path.startsWith("/uploads/") ||
                path.endsWith(".ico")) {
            return true;
        }

        // 2. Các trang giao diện cho khách (Guest pages)
        if (path.equals("/") ||
                path.equals("/login") ||
                path.equals("/signup") ||
                path.equals("/about") ||
                path.equals("/cars") ||
                path.equals("/news")) {
            return true;
        }

        // 3. API Công khai (Public API)
        // Fix: Chỉ cho phép GET nếu KHÔNG PHẢI đường dẫn admin
        boolean isPublicGet = "GET".equalsIgnoreCase(method) &&
                (path.startsWith("/api/cars") || path.startsWith("/api/news")) ||
                path.startsWith("/api/comments") &&
                        !path.startsWith("/api/admin/");

        if (path.startsWith("/api/auth/") ||
                path.startsWith("/api/accounts/register") ||
                path.startsWith("/api/accounts/login") ||
                isPublicGet) {
            return true;
        }

        /* ================== KIỂM TRA QUYỀN ADMIN ================== */
        if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return handleUnauthorized(request, response);
            }

            String token = authHeader.substring(7);

            if (!sessionService.isValidSession(token)) {
                return handleUnauthorized(request, response);
            }

            // Kiểm tra role admin
            if (!sessionService.hasRole(token, "admin")) {
                return handleForbidden(request, response);
            }

            return true;
        }

        /* ================== TRANG CỦA USER (Cần đăng nhập) ================== */
        if (path.equals("/dashboard") ||
                path.equals("/orders") ||
                path.equals("/profile")) {

            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.sendRedirect("/login");
                return false;
            }

            String token = authHeader.substring(7);
            if (!sessionService.isValidSession(token)) {
                response.sendRedirect("/login");
                return false;
            }
            return true;
        }

        /* ================== CÁC API KHÁC (Catch-all) ================== */
        if (path.startsWith("/api/")) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return handleUnauthorized(request, response);
            }
        }

        return true;
    }

    private boolean handleUnauthorized(HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        if (request.getRequestURI().startsWith("/api/")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter()
                    .write("{\"status\":401, \"error\":\"Unauthorized\", \"message\":\"Bạn cần đăng nhập\"}");
        } else {
            response.sendRedirect("/login");
        }
        return false;
    }

    private boolean handleForbidden(HttpServletRequest request, HttpServletResponse response)
            throws Exception {
        if (request.getRequestURI().startsWith("/api/")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter()
                    .write("{\"status\":403, \"error\":\"Forbidden\", \"message\":\"Quyền Admin mới được truy cập\"}");
        } else {
            response.sendRedirect("/403");
        }
        return false;
    }
}