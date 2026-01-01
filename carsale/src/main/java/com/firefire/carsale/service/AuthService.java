package com.firefire.carsale.service;

import com.firefire.carsale.dto.request.LoginRequest;
import com.firefire.carsale.dto.request.RegisterRequest;
import com.firefire.carsale.dto.response.AccountResponse;
import com.firefire.carsale.dto.response.LoginResponse;

public interface AuthService {
    AccountResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    void logout(String token);

    AccountResponse getCurrentUser(String token);

    boolean isAdmin(Integer accountId);

    boolean isUsernameExists(String username);

    boolean isEmailExists(String email);
}