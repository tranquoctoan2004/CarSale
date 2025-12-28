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

        // === CHO PHÉP TRUY CẬP KHÔNG CẦN TOKEN ===
        // 1. Static resources
        if (path.startsWith("/screen/") ||
                path.startsWith("/style/") ||
                path.startsWith("/script/") ||
                path.startsWith("/image/")) {
            return true;
        }

        // 2. Guest pages
        if (path.equals("/") ||
                path.equals("/login") ||
                path.equals("/signup") ||
                path.equals("/about") ||
                path.equals("/cars") ||
                path.equals("/terms") ||
                path.equals("/news")) {
            return true;
        }

        // 3. API public
        if (path.startsWith("/api/auth/") ||
                path.startsWith("/api/accounts/register") ||
                path.startsWith("/api/accounts/login") ||
                (path.startsWith("/api/cars") && "GET".equals(request.getMethod()))) {
            return true;
        }

        // === CÁC TRANG USER (CẦN KIỂM TRA TOKEN) ===
        if (path.equals("/dashboard") ||
                path.equals("/orders") ||
                path.equals("/payment") ||
                path.equals("/profile")) {

            // Kiểm tra token
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // Nếu không có token, redirect đến login
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

        // === CÁC API KHÁC (CẦN KIỂM TRA TOKEN) ===
        if (path.startsWith("/api/")) {
            // Kiểm tra token
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized - No token provided\"}");
                return false;
            }

            String token = authHeader.substring(7);
            if (!sessionService.isValidSession(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized - Invalid token\"}");
                return false;
            }

            return true;
        }

        return true;
    }
}
