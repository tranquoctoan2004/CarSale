package com.firefire.carsale.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.firefire.carsale.dto.request.LoginRequest;
import com.firefire.carsale.dto.request.RegisterRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.dto.response.LoginResponse;
import com.firefire.carsale.service.AuthService;
import com.firefire.carsale.util.ApiResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AccountResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AccountResponse response = authService.register(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success("Login successful", response));
        } else {
            return ResponseEntity.badRequest().body(ApiResponse.error(response.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AccountResponse>> getCurrentUser(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }

        token = token.substring(7);
        AccountResponse account = authService.getCurrentUser(token);

        if (account == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Invalid token"));
        }

        return ResponseEntity.ok(ApiResponse.success(account));
    }
}
