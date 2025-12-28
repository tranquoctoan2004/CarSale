package com.firefire.carsale.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private boolean success;
    private String message;
    private AccountResponse account;
    private String token; // Simple token for session

    public LoginResponse(boolean success, String message, AccountResponse account, String token) {
        this.success = success;
        this.message = message;
        this.account = account;
        this.token = token;
    }

    public static LoginResponse success(String message, AccountResponse account, String token) {
        return new LoginResponse(true, message, account, token);
    }

    public static LoginResponse error(String message) {
        return new LoginResponse(false, message, null, null);
    }
}
